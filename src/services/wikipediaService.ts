export async function getWikipediaImage(title: string): Promise<string | null> {
  try {
    const res = await fetch(`https://tr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600&origin=*`);
    
    if (!res.ok) {
      return null;
    }
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      const pages = data.query?.pages;
      if (pages) {
        const pageIds = Object.keys(pages);
        if (pageIds.length > 0 && pageIds[0] !== '-1') {
          const thumb = pages[pageIds[0]]?.thumbnail?.source;
          if (thumb) return thumb;
        }
      }
    } catch (parseError) {
      // Not JSON, probably rate limited
      return null;
    }
  } catch (e) {
    // Silently handle fetch failures
  }
  return null;
}
