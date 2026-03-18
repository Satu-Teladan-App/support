import { getSupabaseBrowserClient } from "../supabase/client";

export const fetchBeritaData = async (limit = 10) => {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase
      .from('berita')
      .select(`
        *,
        writer_alumni:alumni!writer_alumni_id(
          id,
          name,
          avatar,
          batch
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map((item) => {
      const writer = item.writer_alumni;
      return {
        id: item.id,
        imageUrl: item.image_url || null,
        title: item.title,
        profileUrl: writer?.avatar,
        sender: writer?.name || 'Unknown',
        date: new Date((item.publication_date || item.created_at || new Date()) as string).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        type: item.category || 'Berita',
        newsLink: item.link || '#',
        writer_alumni: writer || null,
      };
    });
  } catch (error) {
    console.error('Error fetching berita:', error);
    return [];
  }
};
