import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UniversalStorage from '../../src/utils/UniversalStorage';

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

  const renderRecipe = ({ item }: { item: any }) => (
    <View style={styles.recipeRow}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleExpand(item.name)}>
        <Text style={styles.recipeName}>{item.name}</Text>
      </TouchableOpacity>
      <MaterialIcons
        name={expanded === item.name ? 'expand-less' : 'expand-more'}
        size={28}
        color={'#F4A259'}
        onPress={() => toggleExpand(item.name)}
      />
      <TouchableOpacity onPress={() => removeFavorite(item.name)}>
        <MaterialIcons
          name={'star'}
          size={28}
          color={'#FFD600'}
        />
      </TouchableOpacity>
      {expanded === item.name && (
        <View style={styles.detailsBox}>
          <Text style={styles.sectionTitle}>Ingredientes:</Text>
          {item.ingredients && item.ingredients.length > 0 ? (
            item.ingredients.map((ing: string, idx: number) => (
              <Text key={idx} style={styles.ingredientItem}>• {ing}</Text>
            ))
          ) : (
            <Text style={styles.ingredientItem}>No hay ingredientes guardados.</Text>
          )}
          <Text style={styles.sectionTitle}>Kcal por persona: {item.kcal ? item.kcal : 'No disponible'}</Text>
          {item.video && item.video.videoId && (
            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open(`https://www.youtube.com/watch?v=${item.video.videoId}`, '_blank');
                }
              }}
            >
              <Text style={styles.videoButtonText}>Ver tutorial en YouTube</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <MaterialIcons name="star" size={32} color="#F4A259" style={{ marginRight: 8 }} />
        <Text style={styles.title}>Mis Recetas Favoritas</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        renderItem={renderRecipe}
        ListEmptyComponent={<Text style={styles.empty}>No tienes recetas favoritas aún.</Text>}
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