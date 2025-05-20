import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../services/supabaseClient';
import ChefHat from '@/assets/images/avatars/ChefHat';
import Apron from '@/assets/images/avatars/Apron';
import Bread from '@/assets/images/avatars/Bread';
import WoodenSpoon from '@/assets/images/avatars/WoodenSpoon';
import ForkKnife from '@/assets/images/avatars/ForkKnife';
import Cupcake from '@/assets/images/avatars/Cupcake';
import Carrot from '@/assets/images/avatars/Carrot';
import FoodieHeart from '@/assets/images/avatars/FoodieHeart';

const AVATAR_COMPONENTS = [ChefHat, Apron, Bread, WoodenSpoon, ForkKnife, Cupcake, Carrot, FoodieHeart];

const PREFERENCIAS = [
  'Vegano',
  'Postres',
  'Saludable',
  'Rápido',
  'Internacional',
];

const NIVELES = ['Principiante', 'Intermedio', 'Chef'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [level, setLevel] = useState(NIVELES[0]);
  const [birthdate, setBirthdate] = useState('');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No hay usuario autenticado');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
        setCity(data.city || '');
        setPreferences(data.preferences || []);
        setLevel(data.level || NIVELES[0]);
        setBirthdate(data.birthdate || '');
        setAvatarIdx(data.avatarIdx || 0);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleTogglePref = (pref) => {
    setPreferences((prev) => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        bio,
        city,
        preferences,
        level,
        birthdate,
        avatarIdx,
      })
      .eq('id', user.id);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Perfil actualizado');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, justifyContent: 'center' }}>
        {AVATAR_COMPONENTS.map((AvatarComp, idx) => (
          <TouchableOpacity key={idx} onPress={() => setAvatarIdx(idx)} style={[styles.avatarOption, avatarIdx === idx && styles.avatarSelected]}>
            <View style={styles.avatar}><AvatarComp width={64} height={64} /></View>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Biografía"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Ciudad o país"
        value={city}
        onChangeText={setCity}
      />
      <Text style={styles.label}>Preferencias culinarias:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {PREFERENCIAS.map((pref) => (
          <TouchableOpacity
            key={pref}
            onPress={() => handleTogglePref(pref)}
            style={[styles.chip, preferences.includes(pref) && styles.chipSelected]}
          >
            <Text style={{ color: preferences.includes(pref) ? '#fff' : '#F4A259' }}>{pref}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Nivel de experiencia:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {NIVELES.map((n) => (
          <TouchableOpacity key={n} onPress={() => setLevel(n)} style={[styles.chip, level === n && styles.chipSelected]}>
            <Text style={{ color: level === n ? '#fff' : '#F4A259' }}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f7f6f2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#4d4d4d' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
  avatarOption: { marginHorizontal: 6, borderWidth: 2, borderColor: 'transparent', borderRadius: 36, padding: 2 },
  avatarSelected: { borderColor: '#F4A259' },
  input: { width: '100%', height: 48, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  button: { width: '100%', height: 48, backgroundColor: '#a3c9a8', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  label: { alignSelf: 'flex-start', marginBottom: 4, color: '#4d4d4d', fontWeight: 'bold' },
  chip: { borderWidth: 1, borderColor: '#F4A259', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8, backgroundColor: '#fff' },
  chipSelected: { backgroundColor: '#F4A259', borderColor: '#F4A259' },
}); 