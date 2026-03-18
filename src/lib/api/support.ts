import { getSupabaseBrowserClient } from "../supabase/client";

export interface TicketItem {
  id: string;
  subject: string;
  message: string;
  status: "pending" | "open" | "closed";
  created_at: string;
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

/**
 * Fetch tickets for the current user
 */
export const fetchUserTickets = async (userId: string) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as TicketItem[];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

/**
 * Create a new support ticket
 */
export const createTicket = async (userId: string, message: string) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .insert([
        {
          user_id: userId,
          subject: message.length > 50 ? message.substring(0, 50) + "..." : message,
          message: message,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as TicketItem;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

/**
 * Fetch all forum posts with author information
 * Pattern followed from Frontend/src/services/dataService.js
 */
export const fetchForumPosts = async () => {
  const supabase = getSupabaseBrowserClient();
  try {
    // Attempting to fetch with alumni relationship if author_id exists
    // This follows the Frontend pattern of fetching related alumni info
    const { data, error } = await supabase
      .from("forum_posts")
      .select(`
        *,
        author_alumni:alumni!author_id(
          id,
          name,
          avatar,
          batch
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback if the relationship doesn't exist or errors out
      console.warn("Falling back to simple forum_posts fetch:", error.message);
      const { data: simpleData, error: simpleError } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (simpleError) throw simpleError;
      return simpleData as ForumPost[];
    }

    return data as ForumPost[];
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return [];
  }
};

/**
 * Create a new forum post
 */
export const createForumPost = async (authorId: string, title: string, content: string) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from("forum_posts")
      .insert([
        {
          author_id: authorId,
          title,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating forum post:", error);
    throw error;
  }
};
