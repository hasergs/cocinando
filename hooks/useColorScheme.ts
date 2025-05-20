import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeName } from '@/constants/Colors';

const STORAGE_KEY = 'user-theme';

export function useAppColorScheme() {
  const [theme, setTheme] = useState<ThemeName>('light');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTheme(saved as ThemeName);
      else setTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
    })();
  }, []);

  const changeTheme = async (newTheme: ThemeName) => {
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEY, newTheme);
  };

  return { theme, changeTheme };
}
