import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(null); // null = unknown, true = exists, false = new user
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '319396681228-au9iqmpbspshsodqjn7l3q5p6ce9kjv8.apps.googleusercontent.com',
    iosClientId: 'TU_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'TU_GOOGLE_ANDROID_CLIENT_ID',
    webClientId: '319396681228-au9iqmpbspshsodqjn7l3q5p6ce9kjv8.apps.googleusercontent.com',
  });

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/(tabs)');
    });
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      }
    }
  }, [response]);

  useEffect(() => {
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.replace('/(tabs)');
    });
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
      Alert.alert('Error', 'Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } else {
      router.replace('/(tabs)');
    }
  };

  const checkUserExists = async (email) => {
    if (!email.trim()) return;
    
    setCheckingEmail(true);
    try {
      // Intentar hacer login con una contraseña falsa para ver si el usuario existe
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: 'fake_password_to_check_user_exists',
      });
      
      // Si el error es 'Invalid login credentials', significa que el usuario existe pero la contraseña es incorrecta
      // Si el error es diferente, probablemente el usuario no existe
      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          setIsExistingUser(true);
        } else {
          setIsExistingUser(false);
        }
      }
    } catch (err) {
      setIsExistingUser(false);
    } finally {
      setCheckingEmail(false);
      setShowForm(true);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!showForm) {
      await checkUserExists(email);
      return;
    }

    setLoading(true);
    
    if (isExistingUser) {
      // Usuario existente - Login
      if (!password.trim()) {
        Alert.alert('Error', 'Por favor ingresa tu contraseña');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      // Usuario nuevo - Registro
      if (!password.trim() || !confirmPassword.trim()) {
        Alert.alert('Error', 'Por favor completa todos los campos de contraseña');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      // Registro con metadata para futura integración con Stripe
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            subscription_status: 'none', // Para Stripe
            trial_used: false,
            created_at: new Date().toISOString(),
          }
        }
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Éxito', 'Cuenta creada exitosamente. Revisa tu correo para confirmar el registro.');
      }
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsExistingUser(null);
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleSkipLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>🍳</Text>
        </View>
      </View>

      {/* Card Principal */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {!showForm ? 'Iniciar Sesión' : (isExistingUser ? 'Bienvenido de nuevo' : 'Crear Cuenta')}
        </Text>
        
        {/* Campo de Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.emailInputContainer}>
            <TextInput
              style={[styles.input, showForm && styles.inputDisabled]}
              placeholder="Tu correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!showForm}
            />
            {showForm && (
              <TouchableOpacity style={styles.editButton} onPress={resetForm}>
                <Text style={styles.editButtonText}>Cambiar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Campos dinámicos según si el usuario existe */}
        {showForm && isExistingUser && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>
        )}

        {showForm && !isExistingUser && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoComplete="given-name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu apellido"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoComplete="family-name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Crea una contraseña (mín. 6 caracteres)"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirma tu contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>
          </>
        )}

        {/* Botón principal */}
        <TouchableOpacity 
          style={[styles.continueButton, (loading || checkingEmail) && styles.buttonDisabled]} 
          onPress={handleEmailSubmit}
          disabled={loading || checkingEmail}
          activeOpacity={0.8}
        >
          {(loading || checkingEmail) ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.continueButtonText}>
                {checkingEmail ? 'Verificando...' : 'Procesando...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.continueButtonText}>
              {!showForm ? 'Continuar' : (isExistingUser ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Separador OR */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>O</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Botón Google */}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => promptAsync()}
          disabled={!request || loading || checkingEmail}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.socialButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        {/* Información sobre planes (para nuevos usuarios) */}
        {showForm && !isExistingUser && (
          <View style={styles.planInfoContainer}>
            <Text style={styles.planInfoText}>
              Al registrarte, tendrás acceso a nuestros planes de suscripción para disfrutar de todas las funciones premium.
            </Text>
          </View>
        )}

        {/* Botón Skip (solo para desarrollo) */}
        {__DEV__ && (
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkipLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Saltar (Modo Dev)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4A259',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 25,
    borderWidth: 1,
    borderColor: '#F4A25933',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFF9F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#F4A25955',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  editButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F4A259',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  continueButton: {
    height: 48,
    backgroundColor: '#F4A259',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#F4A259',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F4A25955',
  },
  separatorText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  socialButton: {
    height: 48,
    backgroundColor: '#FFF9F0',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F4A25955',
  },
  socialButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    letterSpacing: 0.2,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    textAlign: 'center',
    borderRadius: 12,
    lineHeight: 24,
  },
  planInfoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF4E6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F4A25933',
  },
  planInfoText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  skipButton: {
    marginTop: 16,
    height: 40,
    backgroundColor: '#F4A25933',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
}); 