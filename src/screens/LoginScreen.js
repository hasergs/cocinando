import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '319396681228-au9iqmpbspshsodqjn7l3q5p6ce9kjv8.apps.googleusercontent.com', // Reemplaza con tu client ID de Google
    iosClientId: 'TU_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'TU_GOOGLE_ANDROID_CLIENT_ID',
    webClientId: '319396681228-au9iqmpbspshsodqjn7l3q5p6ce9kjv8.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    // Si el usuario ya está autenticado, redirige a las tabs
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/(tabs)');
    });
  }, []);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      }
    }
  }, [response]);

  React.useEffect(() => {
    // Listener de cambios de sesión
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.replace('/(tabs)');
    });
    // Limpieza del listener al desmontar
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async (accessToken) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: accessToken,
    });
    setLoading(false);
    if (error) {
      if (error.message === 'Email not confirmed') {
        Alert.alert('Error', 'Debes confirmar tu correo antes de iniciar sesión con Google. Revisa tu bandeja de entrada.');
      } else if (error.message === 'Invalid login credentials') {
        Alert.alert('Error', 'Tu cuenta de Google no está autorizada o las credenciales son incorrectas.');
      } else {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Éxito', 'Inicio de sesión con Google exitoso.');
      router.replace('/(tabs)');
    }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      if (error.message === 'Email not confirmed') {
        Alert.alert('Error', 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else if (error.message === 'Invalid login credentials') {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
      } else {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Éxito', 'Inicio de sesión exitoso.');
      router.replace('/(tabs)');
    }
  };

  const handleEmailRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Éxito', 'Revisa tu correo para confirmar el registro.');
  };

  // Botón para saltar login (test SIN autenticación)
  const handleSkipLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a Cocina Fácil</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#bdbdbd"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#bdbdbd"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar sesión'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleEmailRegister} disabled={loading}>
        <Text style={styles.registerButtonText}>{loading ? 'Cargando...' : 'Registrarse'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkipLogin}>
        <Text style={styles.skipButtonText}>SALTAR LOGIN (TEST: acceso directo)</Text>
      </TouchableOpacity>
      <Text style={styles.or}>o</Text>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request || loading}
      >
        <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6f2', // Color pastel suave
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d4d4d',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#a3c9a8', // Verde pastel
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  or: {
    color: '#bdbdbd',
    marginVertical: 8,
  },
  googleButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#ffe0b2', // Naranja pastel
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#4d4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#b2d8ff', // Azul pastel
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    color: '#4d4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#ffb2b2', // Rojo pastel para destacar que es de test
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 