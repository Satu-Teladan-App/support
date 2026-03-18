import { getSupabaseBrowserClient } from "../supabase/client";

/**
 * Fetch current user profile with alumni details
 * Matching the pattern in Frontend/src/services/dataService.js
 */
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

    // Get from alumni table matching Frontend logic
    const { data: alumni, error: alumniError } = await supabase
      .from('alumni')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (alumni) {
      return {
        ...alumni,
        id: alumni.id,
        name: alumni.full_name || alumni.name || 'User',
        avatar: alumni.avatar,
        email: user.email,
        batch: alumni.batch,
      };
    }

    // Return default user info if no alumni record
    return {
      user_id: user.id,
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

/**
 * Get current user's alumni ID
 * From Frontend/src/services/dataService.js
 */
export const getCurrentUserAlumniId = async () => {
  const supabase = getSupabaseBrowserClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('No authenticated user');
    }

    const { data: alumni, error: alumniError } = await supabase
      .from('alumni')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (alumniError || !alumni) {
      throw new Error('Alumni record not found');
    }

    return alumni.id;
  } catch (error) {
    console.error('Error getting current user alumni ID:', error);
    throw error;
  }
};

/**
 * Create or update alumni record
 * From Frontend/src/services/dataService.js
 */
export const saveAlumniData = async (alumniData: any) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('No authenticated user');
    }

    // First, create or update users table entry
    const { error: usersError } = await supabase.from('users').upsert(
      {
        user_id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      },
    );

    if (usersError) {
      console.warn('Error upserting users table:', usersError);
    }

    // Check if alumni record already exists
    const { data: existingAlumni, error: checkError } = await supabase
      .from('alumni')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const alumniRecord = {
      user_id: user.id,
      name: alumniData.name,
      full_name: alumniData.name,
      batch: alumniData.batch,
      avatar: alumniData.avatar || null,
      latitude: alumniData.latitude || null,
      longitude: alumniData.longitude || null,
      socials: alumniData.socials || null,
      domisili: alumniData.domisili || null,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existingAlumni) {
      // Update existing record
      const { data, error } = await supabase
        .from('alumni')
        .update(alumniRecord)
        .eq('id', existingAlumni.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('alumni')
        .insert([alumniRecord])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error) {
    console.error('Error saving alumni data:', error);
    throw error;
  }
};

/**
 * Check if user has completed biodata
 * From Frontend/src/services/dataService.js
 */
export const checkBiodataCompletion = async () => {
  const supabase = getSupabaseBrowserClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return false;
    }

    const { data: alumni, error: alumniError } = await supabase
      .from('alumni')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (alumniError || !alumni) {
      return false;
    }

    // Check if required fields are filled (name and batch as per Frontend)
    const requiredFields = ['name', 'batch'];
    const isComplete = requiredFields.every(
      (field) => (alumni as any)[field] && (alumni as any)[field].toString().trim() !== '',
    );

    return isComplete;
  } catch (error) {
    console.error('Error checking biodata completion:', error);
    return false;
  }
};
