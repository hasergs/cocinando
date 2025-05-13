import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, Text, ActivityIndicator, TouchableOpacity, ScrollView, Platform, TextInput, WebView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFonts as usePacifico, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { useFonts as useRoboto, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { searchYouTubeVideo } from '../services/youtubeApi';
import { extractIngredientsFromText, getIngredientsFromGoogle } from '../services/geminiApi';
import { WebView as NativeWebView } from 'react-native-webview';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyDQTSOexVPE4Octz6ozaZh6KYleaWpUekk';

const RECOMMENDATIONS = [
  {
    user: 'Ana',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: '¡Me encanta esta app! Identificó mi paella al instante.',
    rating: 5,
  },
  {
    user: 'Carlos',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Muy útil para saber qué estoy comiendo fuera de casa.',
    rating: 4,
  },
];

const PhotoCaptureScreen = () => {
  const [image, setImage] = useState(null);
  const [dishName, setDishName] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [video, setVideo] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [kcal, setKcal] = useState(null);

  const [pacificoLoaded, pacificoError] = usePacifico({ Pacifico_400Regular });
  const [robotoLoaded, robotoError] = useRoboto({ Roboto_400Regular, Roboto_700Bold });

  if ((!pacificoLoaded && !pacificoError) || (!robotoLoaded && !robotoError)) {
    return null;
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: Platform.OS === 'web' ? 'image' : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      identifyDish(result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      identifyDish(result.assets[0].base64);
    }
  };

  const identifyDish = async (base64Image) => {
    setLoading(true);
    setDishName('');
    setVideo(null);
    setIngredients([]);
    setKcal(null);
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image,
                  },
                },
                {
                  text: `Eres un experto chef con todo el conocimiento del mundo sobre cocina. Analiza la imagen que te envío y utiliza todos los recursos y conocimientos posibles para identificar con la mayor precisión posible el nombre de la receta o plato que aparece en la imagen. Si puedes, responde solo con el nombre más probable del plato o receta, sin explicaciones adicionales.${userInfo ? '\nInformación adicional del usuario: ' + userInfo : ''}`
                }
              ],
            },
          ],
        }),
      });
      const data = await response.json();
      console.log('Gemini response:', data);
      if (!data?.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        setDishName('No identificado');
        Alert.alert('Gemini', 'Respuesta inesperada de la API: ' + JSON.stringify(data));
        return;
      }
      const name = data.candidates[0].content.parts[0].text;
      setDishName(name);
      // Buscar video en YouTube
      const videoResult = await searchYouTubeVideo(name);
      setVideo(videoResult);
      // Siempre obtenemos los ingredientes por prompt a Gemini
      const googleResult = await getIngredientsFromGoogle(name);
      setIngredients(googleResult.ingredients);
      setKcal(googleResult.kcal);
    } catch (error) {
      Alert.alert('Error', 'No se pudo identificar el plato: ' + error.message);
      console.log('Error Gemini:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: 'Roboto_700Bold' }]}>¡Bienvenido a</Text>
        <Text style={[styles.brand, { fontFamily: 'Roboto_700Bold' }]}>Cocina Real</Text>
        <Text style={[styles.subtitle, { fontFamily: 'Pacifico_400Regular' }]}>Descubre el plato de tu foto</Text>
        <Text style={[styles.description, { fontFamily: 'Roboto_400Regular' }]}>Sube o toma una foto y descubre el nombre del plato y cómo hacerlo en casa.</Text>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image source={require('../../assets/images/sample-bowl.jpg')} style={styles.image} />
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="¿Algo más que quieras contar sobre el plato? (opcional)"
          placeholderTextColor="#F4A25999"
          value={userInfo}
          onChangeText={setUserInfo}
          multiline
          numberOfLines={2}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Seleccionar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={takePhoto}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Tomar foto</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#E07A5F" style={{ marginTop: 20 }} />}
        {dishName ? (
          <Text style={styles.dishName}>Plato identificado: {dishName}</Text>
        ) : null}
        {video && (
          <View style={styles.videoContainer}>
            <Text style={styles.videoTitle}>Video recomendado:</Text>
            {Platform.OS !== 'web' ? (
              <View style={styles.webviewWrapper}>
                <NativeWebView
                  source={{ uri: `https://www.youtube.com/embed/${video.videoId}` }}
                  style={styles.webview}
                  allowsFullscreenVideo
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                style={styles.webviewWrapper}
              >
                <Image source={{ uri: video.thumbnail }} style={styles.webview} />
                <Text style={{ color: '#F4A259', textAlign: 'center' }}>Ver en YouTube</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.videoText}>{video.title}</Text>
            <Text style={styles.videoChannel}>Canal: {video.channelTitle}</Text>
          </View>
        )}
        {/* INGREDIENTES SIEMPRE DEBAJO DEL VIDEO */}
        {video && (
          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Ingredientes sugeridos:</Text>
            {ingredients.length > 0 ? (
              ingredients.map((ing, idx) => (
                <Text key={idx} style={styles.ingredientItem}>• {ing}</Text>
              ))
            ) : (
              <Text style={styles.ingredientItem}>No se pudieron extraer ingredientes de este video.</Text>
            )}
            {kcal ? (
              <Text style={styles.kcalText}>Kcal por persona: {kcal}</Text>
            ) : (
              <Text style={styles.kcalText}>Kcal por persona: No disponible</Text>
            )}
          </View>
        )}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Recomendaciones</Text>
          {RECOMMENDATIONS.map((rec, idx) => (
            <View key={idx} style={styles.recommendationCard}>
              <Image source={{ uri: rec.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recText}>{rec.text}</Text>
                <Text style={styles.recUser}>{rec.user} {'★'.repeat(rec.rating)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFF9F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    color: '#222',
    marginBottom: 0,
    textAlign: 'center',
  },
  brand: {
    fontSize: 28,
    color: '#F4A259',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#F4A259',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F4A259',
  },
  secondaryButtonText: {
    color: '#F4A259',
  },
  dishName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 18,
  },
  recommendationsContainer: {
    width: '100%',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4A25933',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4A259',
    marginBottom: 8,
    textAlign: 'left',
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#F4A259',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  recText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  recUser: {
    fontSize: 13,
    color: '#F4A259',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    minHeight: 44,
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F4A25955',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4A259',
    marginBottom: 6,
  },
  webviewWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  webview: {
    flex: 1,
    minHeight: 180,
    backgroundColor: '#000',
  },
  videoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  videoChannel: {
    fontSize: 13,
    color: '#F4A259',
    marginBottom: 2,
  },
  ingredientsContainer: {
    width: '100%',
    backgroundColor: '#FFF9F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  ingredientsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F4A259',
    marginBottom: 6,
  },
  ingredientItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  kcalText: {
    fontSize: 14,
    color: '#F4A259',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});

async function getYouTubeTranscript(videoId) {
  try {
    const url = `https://yt.lemnoslife.com/videos?part=transcript&id=${videoId}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data?.items?.[0]?.transcript?.length) {
      return data.items[0].transcript.map(t => t.text).join('\n');
    }
    return '';
  } catch (e) {
    return '';
  }
}

export default PhotoCaptureScreen; 