import { getSupabaseBrowserClient } from "../supabase/client";

export const fetchKegiatanData = async (limit = 10) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select(`
        *,
        creator_alumni:alumni!creator_alumni_id(
          id,
          name,
          avatar,
          batch
        ),
        kegiatan_verification(
          id,
          created_at,
          verificator_id
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map((item) => {
      const creator = item.creator_alumni;
      const verifications = item.kegiatan_verification || [];

      return {
        id: item.id,
        image: item.image_url || null,
        imageUrl: item.image_url || null,
        eventName: item.name,
        title: item.name,
        venue: item.address || 'Lokasi belum ditentukan',
        address: item.address || 'Lokasi belum ditentukan',
        dateRaw: item.kegiatan_date,
        date: new Date((item.kegiatan_date || item.created_at || new Date()) as string).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        organizer: creator?.name || 'Organizer',
        targetAmount: 'Kegiatan',
        progress: 1,
        description: item.description,
        time: item.kegiatan_time,
        time_range: item.kegiatan_time || 'Waktu belum ditentukan',
        latitude: item.latitude,
        longitude: item.longitude,
        pelaksana: item.pelaksana,
        verified: verifications.length > 0,
        creator_alumni: creator || null,
        kegiatan_verification: verifications,
      };
    });
  } catch (error) {
    console.error('Error fetching kegiatan:', error);
    return [];
  }
};
