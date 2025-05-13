// Servicio para extraer ingredientes usando Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyDQTSOexVPE4Octz6ozaZh6KYleaWpUekk';

export async function extractIngredientsFromText(text) {
  const prompt = `Eres un chef profesional. Extrae solo la lista de ingredientes (sin cantidades ni instrucciones) del siguiente texto de receta o transcripción de video. Devuelve solo los ingredientes, uno por línea.\n\n${text}`;
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  });
  const data = await response.json();
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text.split('\n').filter(Boolean);
  }
  return [];
}

export async function getIngredientsFromGoogle(dishName) {
  const prompt = `¿Cuáles son los ingredientes típicos para preparar el plato "${dishName}"? Devuelve solo la lista de ingredientes en español, uno por línea, sin cantidades ni instrucciones. Al final, indica en una línea separada el valor promedio de kilocalorías (kcal) por persona para este plato, en el formato: 'Kcal por persona: <valor>'.`;
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  });
  const data = await response.json();
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    const lines = data.candidates[0].content.parts[0].text.split('\n').filter(Boolean);
    const kcalLine = lines.find(line => /kcal por persona/i.test(line));
    const kcal = kcalLine ? kcalLine.replace(/.*?:/i, '').trim() : null;
    const ingredients = lines.filter(line => !/kcal por persona/i.test(line));
    return { ingredients, kcal };
  }
  return { ingredients: [], kcal: null };
} 