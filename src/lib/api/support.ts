import { getSupabaseBrowserClient } from "../supabase/client";

// Escape hatch: cast the Supabase client to `any` for tables/columns that exist
// in the DB (via migration 003) but are not yet reflected in the auto-generated
// database.types.ts. Re-run `supabase gen types typescript` after applying the
// migration to remove these casts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabaseBrowserClient() as any;

export type TicketStatus = "pending" | "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";

export interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
  updated_at: string;
  /** Joined profile info when fetching replies */
  author?: {
    name: string;
    avatar: string | null;
  } | null;
}

export interface TicketItem {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  /** Joined replies, only populated when requested */
  replies?: TicketReply[];
  /** Joined user info for admin view */
  user_alumni?: {
    name: string;
    avatar: string | null;
    batch: string | null;
  } | null;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  author_name?: string;
  created_at: string;
  replies_count?: number;
  author_alumni?: {
    id: string;
    name: string;
    avatar: string;
    batch: string;
  } | null;
}

// ─── User: fetch own tickets ──────────────────────────────────────────────────

/**
 * Fetch tickets for the current user (with latest replies)
 */
export const fetchUserTickets = async (
  userId: string,
): Promise<TicketItem[]> => {
  try {
    const { data, error } = await db()
      .from("support_tickets")
      .select(
        `
        *,
        replies:ticket_replies (
          id, ticket_id, user_id, message, is_admin_reply, created_at, updated_at
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as TicketItem[];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

/**
 * Create a new support ticket
 */
export const createTicket = async (
  userId: string,
  subject: string,
  message: string,
  priority: TicketPriority = "normal",
): Promise<TicketItem> => {
  const { data, error } = await db()
    .from("support_tickets")
    .insert([
      {
        user_id: userId,
        subject,
        message,
        status: "pending",
        priority,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as TicketItem;
};

/**
 * Add a follow-up reply to an existing ticket (user side)
 */
export const addTicketReply = async (
  ticketId: string,
  userId: string,
  message: string,
): Promise<TicketReply> => {
  const { data, error } = await db()
    .from("ticket_replies")
    .insert([
      { ticket_id: ticketId, user_id: userId, message, is_admin_reply: false },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as TicketReply;
};

// ─── Admin: ticket management ────────────────────────────────────────────────

/**
 * Fetch ALL tickets (admin only, enforced by RLS)
 */
export const fetchAllTickets = async (
  status?: TicketStatus,
): Promise<TicketItem[]> => {
  try {
    let query = db()
      .from("support_tickets")
      .select(
        `
        *,
        user_alumni:alumni!user_id (
          name,
          avatar,
          batch
        ),
        replies:ticket_replies (
          id, ticket_id, user_id, message, is_admin_reply, created_at, updated_at
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as TicketItem[];
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    return [];
  }
};

/**
 * Update ticket status and/or admin notes (admin only)
 */
export const updateTicketStatus = async (
  ticketId: string,
  updates: {
    status?: TicketStatus;
    priority?: TicketPriority;
    admin_notes?: string;
  },
): Promise<TicketItem | null> => {
  try {
    const payload: Record<string, unknown> = { ...updates };
    if (updates.status === "closed" || updates.status === "resolved") {
      payload.resolved_at = new Date().toISOString();
    } else {
      payload.resolved_at = null;
    }

    const { data, error } = await db()
      .from("support_tickets")
      .update(payload)
      .eq("id", ticketId)
      .select()
      .single();

    if (error) throw error;
    return data as TicketItem;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return null;
  }
};

/**
 * Admin replies to a ticket
 */
export const adminReplyToTicket = async (
  ticketId: string,
  adminUserId: string,
  message: string,
): Promise<TicketReply> => {
  const { data, error } = await db()
    .from("ticket_replies")
    .insert([
      {
        ticket_id: ticketId,
        user_id: adminUserId,
        message,
        is_admin_reply: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Automatically move ticket to "open" when admin first replies
  await db()
    .from("support_tickets")
    .update({ status: "open" })
    .eq("id", ticketId)
    .eq("status", "pending");

  return data as TicketReply;
};

/**
 * Fetch all replies for a single ticket
 */
export const fetchTicketReplies = async (
  ticketId: string,
): Promise<TicketReply[]> => {
  try {
    const { data, error } = await db()
      .from("ticket_replies")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as TicketReply[];
  } catch (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
};

// ─── Forum ───────────────────────────────────────────────────────────────────

/**
 * Fetch all forum posts with author information
 */
export const fetchForumPosts = async (): Promise<ForumPost[]> => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from("forum_posts")
      .select(
        `
        *,
        author_alumni:alumni!user_id(
          id,
          name,
          avatar,
          batch
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback if the join errors out
      console.warn("Falling back to simple forum_posts fetch:", error.message);
      const { data: simpleData, error: simpleError } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (simpleError) throw simpleError;
      return (simpleData ?? []) as unknown as ForumPost[];
    }

    return (data ?? []) as unknown as ForumPost[];
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return [];
  }
};

/**
 * Create a new forum post
 */
export const createForumPost = async (
  authorId: string,
  title: string,
  content: string,
) => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("forum_posts")
    .insert([{ user_id: authorId, title, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
};
