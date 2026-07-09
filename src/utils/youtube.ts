export const getYoutubeEmbedUrl = (url: string) => {
  if (!url || url.toLowerCase() === 'izle' || url.toLowerCase() === 'yok') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?playsinline=1`;
  }
  return null;
}
