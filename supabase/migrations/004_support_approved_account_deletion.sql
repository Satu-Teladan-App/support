-- Account deletion is approved by support, never self-service.
-- Flow (support portal, support-satuteladan.vercel.app; the mobile app links to /hapusakun):
--   1. The user signs in on /hapusakun and files a request                 -> 'pending'
--   2. An admin approves or rejects it on /admin/deletion-requests          -> 'approved' / 'rejected'
--   3. An admin completes an approved request: the portal's API (service role) calls
--      delete_user_account(), which deletes the account and anonymizes the request -> 'completed'
-- The anonymized request keeps its id, dates, status and the admin who processed it. The user id,
-- reason, email, IP address, user agent and admin notes are removed.


-- 1. Production only allowed pending/processing/completed/cancelled, so the portal's approve and
--    reject actions failed. processing and cancelled stay valid for existing and superseded rows.
alter table public.account_deletion_requests
  drop constraint account_deletion_requests_status_check;
alter table public.account_deletion_requests
  add constraint account_deletion_requests_status_check
  check (status in ('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled'));

comment on column public.account_deletion_requests.status is
  'pending -> approved or rejected (support) -> completed (account deleted, request anonymized). cancelled: superseded by another completed request.';


-- 2. Keep the request when its user is deleted (it used to cascade away with the account), and
--    when the admin who processed it is deleted (that used to block deleting the admin).
alter table public.account_deletion_requests
  alter column user_id drop not null;
alter table public.account_deletion_requests
  drop constraint account_deletion_requests_user_id_fkey,
  add constraint account_deletion_requests_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete set null;
alter table public.account_deletion_requests
  drop constraint account_deletion_requests_processed_by_fkey,
  add constraint account_deletion_requests_processed_by_fkey
    foreign key (processed_by) references auth.users (id) on delete set null;

create index if not exists account_deletion_requests_processed_by_idx
  on public.account_deletion_requests (processed_by);


-- 3. Users may only file pending requests for themselves, so they cannot pre-approve one.
--    Updates stay service-role only ("Only service role can update deletion requests").
drop policy "Users can create their own deletion requests" on public.account_deletion_requests;
create policy "Users can request deletion of their own account"
  on public.account_deletion_requests
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'pending'
    and processed_by is null
    and processed_at is null
  );

drop policy "Users can view their own deletion requests" on public.account_deletion_requests;
create policy "Users can view their own deletion requests"
  on public.account_deletion_requests
  for select
  to authenticated
  using ((select auth.uid()) = user_id);


-- 4. delete_user_account(): the only way the apps can delete an account.
--    Only the service role may call it (the support portal's API, after checking the caller is an
--    admin). It refuses unless p_admin_id is an admin and the request is 'approved', and runs in
--    one transaction: removes the user's data, anonymizes their deletion requests, then deletes
--    the auth user (the remaining user data cascades from auth.users).
--    SECURITY DEFINER is required to delete from auth.users and to clear rows other users own that
--    reference this user (received messages, reports about them).
--    Returns the user's uploaded files that no remaining row points to. Storage blocks direct SQL
--    deletes, so the caller removes them through the Storage API.
create or replace function public.delete_user_account(p_request_id uuid, p_admin_id uuid)
returns table (storage_bucket text, storage_path text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
  v_uid uuid;
  v_alumni uuid;
begin
  if p_admin_id is null
     or not exists (select 1 from public.admin_roles ar where ar.user_id = p_admin_id) then
    raise exception 'Only admins can complete account deletions'
      using errcode = '42501';
  end if;

  -- Lock the request so it cannot be completed twice.
  select r.status, r.user_id
    into v_status, v_uid
  from public.account_deletion_requests r
  where r.id = p_request_id
  for update;

  if not found then
    raise exception 'Deletion request % does not exist', p_request_id
      using errcode = 'P0002';
  end if;
  if v_status <> 'approved' then
    raise exception 'Deletion request % is %; support must approve it first', p_request_id, v_status
      using errcode = '55000';
  end if;

  -- v_uid is null when the account was already removed some other way. Then only the request is
  -- closed and anonymized.
  if v_uid is not null then
    select a.id into v_alumni from public.alumni a where a.user_id = v_uid;

    -- Reports about the user, their content or their conversations. They reference that content
    -- with NO ACTION foreign keys, so they go first.
    delete from public.reports r
    where r.reported_id = v_uid
       or r.alumni_id = v_alumni
       or r.berita_id in (select b.id from public.berita b where b.writer = v_uid or b.writer_alumni_id = v_alumni)
       or r.donasi_id in (select d.id from public.donasi d where d.creator = v_uid or d.creator_alumni_id = v_alumni)
       or r.komunitas_id in (select k.id from public.komunitas k where k.creator = v_uid or k.creator_alumni_id = v_alumni)
       or r.kegiatan_id in (
            select g.id from public.kegiatan g
            where g.creator = v_uid
               or g.creator_alumni_id = v_alumni
               or g.komunitas_id in (select k.id from public.komunitas k where k.creator = v_uid or k.creator_alumni_id = v_alumni))
       or r.messages_id in (
            select m.id from public.messages m
            where m.sender = v_uid or m.sender_alumni_id = v_alumni or m.receiver_alumni_id = v_alumni);

    -- Reports the user filed about other people stay for moderation, without the reporter.
    update public.reports r set reporter_id = null where r.reporter_id = v_uid;

    -- Chats in both directions, and content linked only through the alumni id (rows whose
    -- creator/writer column is null would otherwise block deleting the profile).
    delete from public.messages m
    where m.sender = v_uid or m.sender_alumni_id = v_alumni or m.receiver_alumni_id = v_alumni;
    delete from public.berita b where b.writer = v_uid or b.writer_alumni_id = v_alumni;
    delete from public.kegiatan g where g.creator = v_uid or g.creator_alumni_id = v_alumni;
    delete from public.komunitas k where k.creator = v_uid or k.creator_alumni_id = v_alumni;
    delete from public.donasi d where d.creator = v_uid or d.creator_alumni_id = v_alumni;
    delete from public.user_feature_blacklist f where f.alumni_id = v_alumni;

    -- Keep what the user did for others as an admin (verifications, bans, broadcasts). Some of
    -- these foreign keys cascade and would otherwise delete other users' verifications.
    update public.alumni_verification set verificator_id = null where verificator_id = v_uid;
    update public.kegiatan_verification set verificator_id = null where verificator_id = v_uid;
    update public.donasi_verification set verificator_id = null where verificator_id = v_uid;
    update public.komunitas_verification set verificator_id = null where verificator_id = v_uid;
    update public.user_feature_blacklist set blacklisted_by = null where blacklisted_by = v_uid;
    update public.notifications set author = null where author = v_uid;
  end if;

  -- Anonymize every request the user filed: this one is completed, other open ones are closed.
  update public.account_deletion_requests r
     set status = case
                    when r.id = p_request_id then 'completed'
                    when r.status in ('pending', 'approved', 'processing') then 'cancelled'
                    else r.status
                  end,
         user_id = null,
         reason = null,
         metadata = jsonb_strip_nulls(jsonb_build_object(
           'processed_by_email', r.metadata ->> 'processed_by_email',
           'completed_by', case when r.id = p_request_id then p_admin_id end,
           'completed_at', case when r.id = p_request_id then now() end,
           'anonymized_at', now()
         ))
   where r.id = p_request_id
      or (v_uid is not null and r.user_id = v_uid);

  -- Everything else cascades from auth.users (profile, scores, memberships, blocks, tickets,
  -- sessions); payment transactions keep their rows with the user set to null.
  if v_uid is not null then
    delete from auth.users u where u.id = v_uid;
  end if;

  -- Files the user uploaded to the app's buckets that nothing references any more: the profile
  -- photo and the images/documents of the content deleted above. Files still used by someone
  -- else's content are kept.
  return query
    select o.bucket_id::text, o.name::text
    from storage.objects o
    where v_uid is not null
      and o.owner_id = v_uid::text
      and o.bucket_id in ('avatars', 'berita-images', 'donasi-documents', 'donasi-images', 'kegiatan-images', 'komunitas-images')
      and not exists (
        select 1
        from (
          select a.avatar as url from public.alumni a
          union all select ap.avatar from public.alumni_private ap
          union all select b.image_url from public.berita b
          union all select d.image_url from public.donasi d
          union all select d.proposal_url from public.donasi d
          union all select d.report_url from public.donasi d
          union all select g.image_url from public.kegiatan g
          union all select k.image from public.komunitas k
        ) refs
        where strpos(refs.url, '/' || o.bucket_id || '/' || o.name) > 0
      );
end;
$$;

comment on function public.delete_user_account(uuid, uuid) is
  'Deletes the account behind an approved account_deletion_requests row and anonymizes the request. Service role only (support portal API). Returns unreferenced Storage files for the caller to remove via the Storage API.';

revoke execute on function public.delete_user_account(uuid, uuid) from public, anon, authenticated;
grant execute on function public.delete_user_account(uuid, uuid) to service_role;
