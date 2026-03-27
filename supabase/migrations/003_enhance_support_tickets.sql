-- =============================================================
-- Migration: Enhance Support Ticket System
-- Adds ticket_replies, admin RLS policies, and extra columns
-- =============================================================

-- -------------------------------------------------------
-- 1. Add extra columns to support_tickets
-- -------------------------------------------------------
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- -------------------------------------------------------
-- 2. Create ticket_replies table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id    UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  is_admin_reply BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------
-- 3. Helper function: check if the current user is admin
--    (uses the existing admin_roles table)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()
  );
$$;

-- -------------------------------------------------------
-- 4. Enable RLS on ticket_replies
-- -------------------------------------------------------
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 5. RLS: support_tickets  (expand existing policies)
-- -------------------------------------------------------

-- Admin can view ALL tickets
CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets
  FOR SELECT
  USING (public.is_admin());

-- Admin can update any ticket (status, priority, admin_notes, resolved_at)
CREATE POLICY "Admins can update any ticket"
  ON public.support_tickets
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------
-- 6. RLS: ticket_replies
-- -------------------------------------------------------

-- Users can see replies on their OWN tickets
CREATE POLICY "Users can view replies on their tickets"
  ON public.ticket_replies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets st
      WHERE st.id = ticket_id AND st.user_id = auth.uid()
    )
  );

-- Admins can see ALL replies
CREATE POLICY "Admins can view all replies"
  ON public.ticket_replies
  FOR SELECT
  USING (public.is_admin());

-- Users can add a follow-up reply to their OWN ticket
CREATE POLICY "Users can reply to their own tickets"
  ON public.ticket_replies
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.support_tickets st
      WHERE st.id = ticket_id AND st.user_id = auth.uid()
    )
  );

-- Admins can reply to any ticket
CREATE POLICY "Admins can reply to any ticket"
  ON public.ticket_replies
  FOR INSERT
  WITH CHECK (public.is_admin() AND auth.uid() = user_id);

-- Admins can update (edit) any reply
CREATE POLICY "Admins can update any reply"
  ON public.ticket_replies
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can delete any reply
CREATE POLICY "Admins can delete any reply"
  ON public.ticket_replies
  FOR DELETE
  USING (public.is_admin());

-- Users can delete their own replies
CREATE POLICY "Users can delete their own replies"
  ON public.ticket_replies
  FOR DELETE
  USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- 7. Auto-update updated_at triggers
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Trigger for support_tickets
DROP TRIGGER IF EXISTS trg_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER trg_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger for ticket_replies
DROP TRIGGER IF EXISTS trg_ticket_replies_updated_at ON public.ticket_replies;
CREATE TRIGGER trg_ticket_replies_updated_at
  BEFORE UPDATE ON public.ticket_replies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 8. Index for faster lookups
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status    ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id   ON public.support_tickets(user_id);
