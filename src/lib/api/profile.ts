import { getSupabaseBrowserClient } from "../supabase/client";

// Fetch current user profile
export const fetchUserProfile = async () => {
  const supabase = getSupabaseBrowserClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('No authenticated user');
    }

    // Get from alumni table
    const { data: alumni, error: alumniError } = await supabase
      .from('alumni')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (alumni) {
      return {
        id: alumni.id,
        name: alumni.full_name || alumni.name || 'User',
        avatar: alumni.avatar,
        email: user.email,
        batch: alumni.batch,
      };
    }

    // Return default user info if no alumni record
    return {
      id: user.id,
      name: user.email?.split('@')[0] || 'User',
      avatar: null,
      email: user.email,
      batch: null,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      id: null,
      name: 'User',
      avatar: null,
      email: null,
      batch: null,
    };
  }
};
