// Servicio para buscar videos en YouTube
// Necesitas una API Key de YouTube Data API v3

const YOUTUBE_API_KEY = 'AIzaSyAr1mLNihCoPLD__J46nXedk_1ixsJCD2U';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function searchYouTubeVideo(query, excludeVideoId = null) {
  // Primera búsqueda: título exacto
  let url = `${YOUTUBE_SEARCH_URL}?part=snippet&type=video&maxResults=5&q=${encodeURIComponent('"' + query + '" receta profesional')}&key=${YOUTUBE_API_KEY}`;
  let response = await fetch(url);
  let data = await response.json();
  let items = (data.items || []).filter(item => item.id.kind === 'youtube#video');
  // Filtrar por título que contenga el nombre exacto del plato
  let filtered = items.filter(item =>
    item.snippet.title.toLowerCase().includes(query.toLowerCase()) &&
    (!excludeVideoId || item.id.videoId !== excludeVideoId)
  );
  let selected = filtered.length > 0 ? filtered[0] : null;
  // Si no hay coincidencia exacta, buscar como antes
  if (!selected) {
    url = `${YOUTUBE_SEARCH_URL}?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query + ' receta profesional')}&key=${YOUTUBE_API_KEY}`;
    response = await fetch(url);
    data = await response.json();
    items = (data.items || []).filter(item => item.id.kind === 'youtube#video');
    // Excluir el video actual si se pasa
    let altFiltered = items.filter(item => !excludeVideoId || item.id.videoId !== excludeVideoId);
    selected = altFiltered.length > 0 ? altFiltered[0] : null;
  }
  if (selected) {
    return {
      videoId: selected.id.videoId,
      title: selected.snippet.title,
      thumbnail: selected.snippet.thumbnails.high.url,
      channelTitle: selected.snippet.channelTitle,
    };
  }
  return null;
} 