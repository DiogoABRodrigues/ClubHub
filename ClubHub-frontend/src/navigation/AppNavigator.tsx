import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home } from '../screens/Home/Home';
import { Matches } from '../screens/Matches/Matches';
import { Standings } from '../screens/Standings/Standings';
import { News } from '../screens/News/News';
import { NotificationSettings } from '../screens/NotificationSettings/NotificationSettings';

// Screens temporários (vamos criar depois)
import { View, Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: COLORS.textSecondary,

          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.border,
          },

          tabBarIcon: ({ color, size }) => {
            let iconName: any;

            switch (route.name) {
              case 'Início':
                iconName = 'home-outline';
                break;
              case 'Jogos':
                iconName = 'trophy-outline';
                break;
              case 'Classificação':
                iconName = 'stats-chart-outline';
                break;
              case 'Notícias':
                iconName = 'newspaper-outline';
                break;
              case 'Definições':
                iconName = 'settings-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Início" component={Home} />
        <Tab.Screen name="Jogos" component={Matches} />
        <Tab.Screen name="Classificação" component={Standings} />
        <Tab.Screen name="Notícias" component={News} />
        <Tab.Screen name="Definições" component={NotificationSettings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};