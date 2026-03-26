import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeStack } from './HomeStack';
import { Standings } from '../screens/Standings/Standings';
import { NotificationSettings } from '../screens/NotificationSettings/NotificationSettings';
import { SquadScreen } from '../screens/Squad/Squad';
import { MatchesStack } from './MatchesStack';
import { NewsStack } from './NewsStack';

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
              case 'Plantel':
                iconName = 'people-outline';
                break;
              case 'Definições':
                iconName = 'settings-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeStack} />
        <Tab.Screen name="Jogos" component={MatchesStack} />
        <Tab.Screen name="Classificação" component={Standings} />
        <Tab.Screen name="Notícias" component={NewsStack} />
        <Tab.Screen name="Plantel" component={SquadScreen} />
        <Tab.Screen name="Definições" component={NotificationSettings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};