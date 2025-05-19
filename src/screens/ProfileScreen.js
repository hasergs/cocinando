import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
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
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({ username, avatar_url: avatarUrl })
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
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Image
        source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/icon.png')}
        style={styles.avatar}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="URL del avatar"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f7f6f2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#4d4d4d' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 24, backgroundColor: '#fff' },
  input: { width: '100%', height: 48, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  button: { width: '100%', height: 48, backgroundColor: '#a3c9a8', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
}); 