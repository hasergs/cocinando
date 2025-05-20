import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { supabase } from '../src/services/supabaseClient';
import { useAppColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const { theme } = useAppColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Si no hay sesión y no estamos en /login ni en /(tabs), redirige a login
      if (!session && segments[0] !== 'login' && segments[0] !== '(tabs)') {
        router.replace('/login');
      }
      // Si hay sesión y estamos en /login, redirige a las tabs
      if (session && segments[0] === 'login') {
        router.replace('/(tabs)');
      }
    });
  }, [segments]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
