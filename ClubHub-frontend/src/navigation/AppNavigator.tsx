import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";

import { HomeStack } from "./HomeStack";
import { MatchesStack } from "./MatchesStack";
import { NewsStack } from "./NewsStack";
import { SeasonScreen } from "../screens/Season/SeasonScreen";
import { NotificationSettings } from "../screens/NotificationSettings/NotificationSettings";
import { AdminDashboard } from "../screens/Admin/AdminDashboard/AdminDashboard";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const { isAdmin } = useAuth();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: { backgroundColor: COLORS.background, borderTopColor: COLORS.border },
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            switch (route.name) {
              case "Início": iconName = "home-outline"; break;
              case "Jogos": iconName = "trophy-outline"; break;
              case "Classificação": iconName = "stats-chart-outline"; break;
              case "Notícias": iconName = "newspaper-outline"; break;
              case "Plantel": iconName = "people-outline"; break;
              case "Definições": iconName = "settings-outline"; break;
              case "Época": iconName = "calendar-outline"; break;
              case "Admin": iconName = "shield-checkmark-outline"; break;
              default: iconName = "ellipse-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeStack} />
        <Tab.Screen name="Jogos" component={MatchesStack} />
        <Tab.Screen name="Época" component={SeasonScreen} />
        <Tab.Screen name="Notícias" component={NewsStack} />
        <Tab.Screen name="Definições" component={NotificationSettings} />
        <Tab.Screen name="Admin" component={AdminDashboard} />
        {isAdmin && (
          <>
            <Tab.Screen name="Admin" component={AdminDashboard} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};