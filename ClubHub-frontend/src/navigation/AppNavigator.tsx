import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

import { HomeStack } from "./HomeStack";
import { MatchesStack } from "./MatchesStack";
import { NewsStack } from "./NewsStack";
import { SeasonScreen } from "../screens/Season/SeasonScreen";
import { NotificationSettings } from "../screens/NotificationSettings/NotificationSettings";
import { AdminDashboard } from "../screens/Admin/AdminDashboard/AdminDashboard";
import { AdminNewsStack } from "../navigation/AdminNewsStack";
import { AdminMatchesStack } from "../navigation/AdminMatchsStack ";
import { AdminNotifications } from "../screens/Admin/AdminNotifications/AdminNotifications";
import { AdminSeasonScreen } from "../screens/Admin/AdminSeason/AdminSeasonScreen";
import { AdminSettings } from "../screens/Admin/AdminSettings/AdminSettings";

const Tab = createBottomTabNavigator();

const ICON_MAP: Record<string, string> = {
  "Início": "home-outline",
  "Jogos": "trophy-outline",
  "Época": "calendar-outline",
  "Notícias": "newspaper-outline",
  "Definições": "settings-outline",
  "Plantel": "people-outline",
  "Notificações": "notifications-outline",
};

export const AppNavigator = () => {
  const isAdmin = true;
  const [adminMode, setAdminMode] = useState(false);

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
            const iconName = ICON_MAP[route.name] ?? "ellipse-outline";
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeStack} />

        {/* Troca automática de stack conforme o modo */}
        <Tab.Screen
          name="Jogos"
          component={adminMode ? AdminMatchesStack : MatchesStack}
        />
        <Tab.Screen
          name="Notícias"
          component={adminMode ? AdminNewsStack : NewsStack}
        />
        <Tab.Screen 
          name="Época" 
          component={adminMode ? AdminSeasonScreen : SeasonScreen} 
        />
        <Tab.Screen
          name="Definições"
          component={adminMode ? AdminSettings : NotificationSettings}
        />

        {/* Botão Admin — só visível para admins */}
        {isAdmin && (
          <Tab.Screen
            name="Admin"
            component={AdminDashboard}
            options={{
              tabBarIcon: ({ size }) => (
                <Ionicons
                  name="shield-checkmark"
                  size={size}
                  color={adminMode ? COLORS.secondary : COLORS.textSecondary}
                />
              ),
              tabBarLabel: "Admin",
              tabBarLabelStyle: {
                color: adminMode ? COLORS.secondary : COLORS.textSecondary,
                fontWeight: adminMode ? "700" : "400",
              },
              tabBarButton: (props) => (
                // @ts-ignore comment
                <TouchableOpacity
                  {...props}
                  onPress={() => setAdminMode((prev) => !prev)}
                />
              ),
            }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};