/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#F4A259',
    icon: '#F4A259',
    tabIconDefault: '#bdbdbd',
    tabIconSelected: '#F4A259',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#FFD6A5',
    icon: '#FFD6A5',
    tabIconDefault: '#bdbdbd',
    tabIconSelected: '#FFD6A5',
  },
};

export type ThemeName = 'light' | 'dark' | 'gourmet' | 'saludable' | 'vintage';

export const THEMES = {
  light: {
    name: 'Claro',
    text: '#11181C',
    background: '#fff',
    tint: '#F4A259',
    icon: '#F4A259',
    tabIconDefault: '#bdbdbd',
    tabIconSelected: '#F4A259',
    card: '#FFF9F0',
    accent: '#FFD6A5',
  },
  dark: {
    name: 'Oscuro',
    text: '#ECEDEE',
    background: '#151718',
    tint: '#FFD6A5',
    icon: '#FFD6A5',
    tabIconDefault: '#bdbdbd',
    tabIconSelected: '#FFD6A5',
    card: '#232323',
    accent: '#F4A259',
  },
  gourmet: {
    name: 'Gourmet',
    text: '#3E2723',
    background: '#FFF8F0',
    tint: '#B98068',
    icon: '#B98068',
    tabIconDefault: '#D7CCC8',
    tabIconSelected: '#B98068',
    card: '#FBE9E7',
    accent: '#FFD180',
  },
  saludable: {
    name: 'Saludable',
    text: '#2E7D32',
    background: '#F1F8E9',
    tint: '#66BB6A',
    icon: '#388E3C',
    tabIconDefault: '#A5D6A7',
    tabIconSelected: '#388E3C',
    card: '#DCEDC8',
    accent: '#B2FF59',
  },
  vintage: {
    name: 'Vintage',
    text: '#5D4037',
    background: '#FFF3E0',
    tint: '#A1887F',
    icon: '#A1887F',
    tabIconDefault: '#D7CCC8',
    tabIconSelected: '#A1887F',
    card: '#FFE0B2',
    accent: '#FFAB91',
  },
};

export function getTheme(theme: ThemeName) {
  return THEMES[theme] || THEMES.light;
}
