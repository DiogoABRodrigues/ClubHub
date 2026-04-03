import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

import { HomeStack } from "./HomeStack";
import { MatchesStack } from "./MatchesStack";
import { NewsStack } from "./NewsStack";
import { SeasonScreen } from "../screens/Season/SeasonScreen";
import { NotificationSettings } from "../screens/NotificationSettings/NotificationSettings";
import { AdminNewsStack } from "../navigation/AdminNewsStack";
import { AdminSettings } from "../screens/Admin/AdminSettings/AdminSettings";
import { useAuth } from "../contexts/AuthContext";

const Tab = createBottomTabNavigator();

const ICON_MAP: Record<string, string> = {
  Início: "home-outline",
  Jogos: "trophy-outline",
  Época: "calendar-outline",
  Notícias: "newspaper-outline",
  Definições: "settings-outline",
  Plantel: "people-outline",
  Notificações: "notifications-outline",
};

export const AppNavigator = () => {
    const { isAdmin, adminMode, setAdminMode } = useAuth();
    const EmptyScreen = () => null;
  return (
    <NavigationContainer key={adminMode ? "admin-root" : "user-root"}>
      <Tab.Navigator
       key={adminMode ? "admin" : "user"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: COLORS.border,
          },
          tabBarIcon: ({ color, size }) => {
            const iconName = ICON_MAP[route.name] ?? "ellipse-outline";
            return (
              <Ionicons name={iconName as any} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeStack} />

        {/* Troca automática de stack conforme o modo */}
        <Tab.Screen
          name="Jogos"
          component={MatchesStack}
        />
        <Tab.Screen
          name="Época"
          component={SeasonScreen}
        />
        <Tab.Screen
          name="Notícias"
          component={adminMode ? AdminNewsStack : NewsStack}
        />
        <Tab.Screen
          name="Definições"
          component={adminMode ? AdminSettings : NotificationSettings}
        />

        {/* Botão Admin — só visível para admins */}
        {isAdmin && (
          <Tab.Screen
          name="Admin"
          component={EmptyScreen} // continua necessário, mas agora limpo
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // impede navegação
              setAdminMode(!adminMode);
            },
          }}
          options={{
            tabBarIcon: ({ size }) => (
              <Ionicons
                name="shield-checkmark"
                size={size}
                color={adminMode ? COLORS.secondary : COLORS.textSecondary}
              />
            ),
          }}
        />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};
