import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TABS = [
  { name: 'index', icon: 'house.fill', label: 'Inicio' },
  { name: 'recetas', icon: 'star.fill', label: 'Recetas' },
  { name: 'profile', icon: 'person.crop.circle', label: 'Perfil' },
];

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const tabWidth = width / TABS.length;
  const indicatorWidth = 40;
  const indicatorX = useSharedValue(state.index * tabWidth + (tabWidth - indicatorWidth) / 2);

  React.useEffect(() => {
    indicatorX.value = withSpring(state.index * tabWidth + (tabWidth - indicatorWidth) / 2, { damping: 15 });
  }, [state.index, tabWidth]);

  return (
    <View style={[styles.outer, { paddingBottom: insets.bottom + 8 }]}>  
      <BlurView intensity={70} tint="light" style={styles.blur}>
        <View style={styles.inner}>
          {TABS.map((tab, idx) => {
            const isFocused = state.index === idx;
            return (
              <TouchableOpacity
                key={tab.name}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: tab.name,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(tab.name);
                  }
                }}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Animated.View style={[isFocused && styles.iconActive, { transform: [{ scale: isFocused ? 1.2 : 1 }] }]}> 
                  <IconSymbol name={tab.icon as any} size={30} color={isFocused ? Colors.light.tint : Colors.light.tabIconDefault} />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
          <Animated.View
            style={[styles.indicator, {
              width: indicatorWidth,
              left: indicatorX,
            }]}
          />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    zIndex: 100,
  },
  blur: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 32,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  iconActive: {
    shadowColor: Colors.light.tint,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  indicator: {
    position: 'absolute',
    bottom: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.tint,
    zIndex: -1,
  },
}); 