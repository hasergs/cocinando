// Servicio para buscar videos en YouTube
// Necesitas una API Key de YouTube Data API v3

const YOUTUBE_API_KEY = 'AIzaSyAr1mLNihCoPLD__J46nXedk_1ixsJCD2U';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function searchYouTubeVideo(query) {
  const url = `${YOUTUBE_SEARCH_URL}?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query + ' receta profesional')}&key=${YOUTUBE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return {
      videoId: data.items[0].id.videoId,
      title: data.items[0].snippet.title,
      thumbnail: data.items[0].snippet.thumbnails.high.url,
      channelTitle: data.items[0].snippet.channelTitle,
    };
  }
  return null;
} 