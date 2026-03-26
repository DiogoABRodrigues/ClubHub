import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/BottomNav.styles';
import { COLORS } from '../theme/colors';

import { Ionicons } from '@expo/vector-icons';

interface Props {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const BottomNav = ({ currentRoute, navigate }: Props) => {
  const navItems = [
    { route: 'Home', icon: 'home-outline', label: 'Home' },
    { route: 'Matches', icon: 'trophy-outline', label: 'Matches' },
    { route: 'Standings', icon: 'stats-chart-outline', label: 'Table' },
    { route: 'News', icon: 'newspaper-outline', label: 'News' },
    { route: 'Notifications', icon: 'notifications-outline', label: 'Alerts' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.route;

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.item}
            onPress={() => navigate(item.route)}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isActive ? COLORS.secondary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? COLORS.secondary : COLORS.textSecondary },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};