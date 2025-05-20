import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UniversalStorage from '../../src/utils/UniversalStorage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FavoriteRecipe = {
  name: string;
  ingredients: string[];
  kcal?: string;
  video?: any;
  date?: string;
};

export default function RecetasScreen() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const favs = await UniversalStorage.getItem('favoriteRecipes');
      setFavorites(favs ? JSON.parse(favs) : []);
    };
    const unsubscribe = () => {};
    loadFavorites();
    return unsubscribe;
  }, []);

  const toggleExpand = (name: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === name ? null : name);
  };

  const removeFavorite = async (name: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('¿Quieres eliminar esta receta de tus favoritos?');
      if (confirmed) {
        const newFavs = favorites.filter((item) => item.name !== name);
        setFavorites(newFavs);
        await UniversalStorage.setItem('favoriteRecipes', JSON.stringify(newFavs));
      }
      return;
    }
    Alert.alert(
      'Eliminar favorito',
      '¿Quieres eliminar esta receta de tus favoritos?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            const newFavs = favorites.filter((item) => item.name !== name);
            setFavorites(newFavs);
            await UniversalStorage.setItem('favoriteRecipes', JSON.stringify(newFavs));
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9F0' }}>
      {/* Cabecera vistosa con gradiente y avatar */}
      <LinearGradient
        colors={["#F4A259", "#FFD6A5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, paddingTop: 48, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="star" size={36} color="#fff" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>Mis Recetas Favoritas</Text>
        </View>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#F4A259', shadowOpacity: 0.2, shadowRadius: 8 }}>
          <MaterialIcons name="person" size={32} color="#F4A259" />
        </View>
      </LinearGradient>
      {/* Lista de recetas con tarjetas vistosas */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout.springify()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              marginBottom: 18,
              padding: 18,
              shadowColor: '#F4A259',
              shadowOpacity: 0.10,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => toggleExpand(item.name)}>
              <MaterialIcons name="restaurant-menu" size={28} color="#F4A259" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 20, color: '#F4A259', fontWeight: 'bold', flex: 1 }}>{item.name}</Text>
              <MaterialIcons
                name={expanded === item.name ? 'expand-less' : 'expand-more'}
                size={28}
                color={'#F4A259'}
                onPress={() => toggleExpand(item.name)}
              />
              <TouchableOpacity onPress={() => removeFavorite(item.name)} style={{ marginLeft: 8 }}>
                <MaterialIcons name={'star'} size={28} color={'#FFD600'} />
              </TouchableOpacity>
            </TouchableOpacity>
            {expanded === item.name && (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={{ marginTop: 14 }}
              >
                <Text style={{ fontWeight: 'bold', color: '#F4A259', marginBottom: 6 }}>Ingredientes:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                  {item.ingredients && item.ingredients.length > 0 ? (
                    item.ingredients.map((ing: string, idx: number) => (
                      <View key={idx} style={{ backgroundColor: '#FFD6A5', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginRight: 6, marginBottom: 6 }}>
                        <Text style={{ color: '#4d4d4d', fontSize: 15 }}>{ing}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: '#bdbdbd' }}>No hay ingredientes guardados.</Text>
                  )}
                </View>
                <Text style={{ fontWeight: 'bold', color: '#F4A259', marginBottom: 6 }}>Kcal por persona: <Text style={{ color: '#4d4d4d' }}>{item.kcal ? item.kcal : 'No disponible'}</Text></Text>
                {item.video && item.video.videoId && (
                  <TouchableOpacity
                    style={{ marginTop: 10, backgroundColor: '#F4A259', borderRadius: 8, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => {
                      if (Platform.OS === 'web') {
                        window.open(`https://www.youtube.com/watch?v=${item.video.videoId}`, '_blank');
                      }
                    }}
                  >
                    <MaterialIcons name="play-circle-fill" size={24} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ver tutorial en YouTube</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            )}
          </Animated.View>
        )}
        ListEmptyComponent={<Text style={{ color: '#bdbdbd', fontStyle: 'italic', marginTop: 32, textAlign: 'center', fontSize: 18 }}>No tienes recetas favoritas aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F4A259', marginBottom: 16 },
  recipeRow: { borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 12, marginBottom: 8 },
  recipeName: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  empty: { color: '#bdbdbd', fontStyle: 'italic', marginTop: 8 },
  detailsBox: { backgroundColor: '#FFF9F0', borderRadius: 8, padding: 12, marginTop: 8 },
  sectionTitle: { fontWeight: 'bold', color: '#F4A259', marginTop: 8, marginBottom: 4 },
  ingredientItem: { fontSize: 15, color: '#333', marginLeft: 8 },
  videoButton: { marginTop: 10, backgroundColor: '#F4A259', borderRadius: 6, padding: 10, alignItems: 'center' },
  videoButtonText: { color: '#fff', fontWeight: 'bold' },
}); 