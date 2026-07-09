export async function getWikipediaImage(title: string): Promise<string | null> {
  try {
    const res = await fetch(`https://tr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600&origin=*`);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageIds = Object.keys(pages);
      if (pageIds.length > 0 && pageIds[0] !== '-1') {
        const thumb = pages[pageIds[0]]?.thumbnail?.source;
        if (thumb) return thumb;
      }
    }
  } catch (e) {
    console.error("Wiki image fetch failed", e);
  }
  return null;
}
