// Servicio para buscar videos en YouTube
// Necesitas una API Key de YouTube Data API v3

const YOUTUBE_API_KEY = 'AIzaSyAr1mLNihCoPLD__J46nXedk_1ixsJCD2U';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function searchYouTubeVideo(query, excludeVideoId = null) {
  // Utilidad para limpiar y dividir texto
  function normalize(text) {
    return text.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  }
  function words(text) {
    return normalize(text).split(/\s+/);
  }

  let url = `${YOUTUBE_SEARCH_URL}?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query + ' receta profesional')}&key=${YOUTUBE_API_KEY}`;
  let response = await fetch(url);
  let data = await response.json();
  let items = (data.items || []).filter(item => item.id.kind === 'youtube#video');
  if (excludeVideoId) {
    items = items.filter(item => item.id.videoId !== excludeVideoId);
  }

  // 1. Coincidencia exacta
  let exact = items.find(item => normalize(item.snippet.title) === normalize(query));
  if (exact) {
    return {
      videoId: exact.id.videoId,
      title: exact.snippet.title,
      thumbnail: exact.snippet.thumbnails.high.url,
      channelTitle: exact.snippet.channelTitle,
    };
  }

  // 2. Todas las palabras del query están en el título
  const queryWords = words(query);
  let allWords = items.find(item => {
    const titleWords = words(item.snippet.title);
    return queryWords.every(qw => titleWords.includes(qw));
  });
  if (allWords) {
    return {
      videoId: allWords.id.videoId,
      title: allWords.snippet.title,
      thumbnail: allWords.snippet.thumbnails.high.url,
      channelTitle: allWords.snippet.channelTitle,
    };
  }

  // 3. Al menos la mitad de las palabras del query están en el título
  let partial = items.find(item => {
    const titleWords = words(item.snippet.title);
    const matchCount = queryWords.filter(qw => titleWords.includes(qw)).length;
    return matchCount >= Math.ceil(queryWords.length / 2);
  });
  if (partial) {
    return {
      videoId: partial.id.videoId,
      title: partial.snippet.title,
      thumbnail: partial.snippet.thumbnails.high.url,
      channelTitle: partial.snippet.channelTitle,
    };
  }

  // 4. Si no hay nada, devolver el primero
  if (items.length > 0) {
    const selected = items[0];
    return {
      videoId: selected.id.videoId,
      title: selected.snippet.title,
      thumbnail: selected.snippet.thumbnails.high.url,
      channelTitle: selected.snippet.channelTitle,
    };
  }

  return null;
} 