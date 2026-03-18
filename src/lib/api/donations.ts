import { getSupabaseBrowserClient } from "../supabase/client";

export const fetchDonasiData = async (limit = 10) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from('donasi')
      .select(`
        *,
        creator_alumni:alumni!creator_alumni_id(
          id,
          name,
          avatar,
          batch
        ),
        donasi_verification(
          id,
          created_at,
          verificator_id
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map((item) => {
      const endDate = new Date(item.end_date as string);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return {
        id: item.id,
        image: item.image_url || null,
        imageUrl: item.image_url || null,
        eventName: item.event_name,
        event_name: item.event_name,
        end_date: item.end_date,
        date: new Date((item.end_date || item.created_at || new Date()) as string).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        organizer: item.organizer || item.creator_alumni?.name || 'Organizer',
        targetAmount: `Rp ${item.target_amount?.toLocaleString('id-ID') || '0'}`,
        target_amount: item.target_amount,
        progress: item.progress || 0,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        description: item.description || `Kegiatan ${item.event_name}.`,
        creator: item.creator_alumni,
        verified: item.donasi_verification && item.donasi_verification.length > 0,
      };
    });
  } catch (error) {
    console.error('Error fetching donasi:', error);
    return [];
  }
};
