import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, TouchableOpacity, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import CustomTabBar from '@/components/ui/CustomTabBar';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.light.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="recetas"
          options={{
            title: 'Recetas',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
