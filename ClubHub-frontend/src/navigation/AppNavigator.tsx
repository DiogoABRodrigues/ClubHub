import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, createThemedStyles } from "../theme/colors";

import { HomeStack } from "./HomeStack";
import { SeasonStack } from "./SeasonStack";
import { MatchesStack } from "./MatchesStack";
import { NewsStack } from "./NewsStack";
import { NotificationSettings } from "../screens/NotificationSettings/NotificationSettings";
import { AdminNewsStack } from "../navigation/AdminNewsStack";
import { AdminSettings } from "../screens/Admin/AdminSettings/AdminSettings";
import { useAuth } from "../contexts/AuthContext";
import { useCategory } from "../contexts/CategoryContext";
import { useCategoryTransition } from "../hooks/useCategoryTransition";
import { CategoryTransitionOverlay } from "../components/CategoryTransitionOverlay";
import { useTheme } from "../contexts/ThemeContext";
import { withThemeUpdates } from "./withThemeUpdates";
const Tab = createBottomTabNavigator();
const ThemedNotificationSettings = withThemeUpdates(NotificationSettings);
const ThemedAdminSettings = withThemeUpdates(AdminSettings);

const ICON_MAP: Record<string, string> = {
  Início: "home-outline",
  Jogos: "trophy-outline",
  Época: "calendar-outline",
  Notícias: "newspaper-outline",
  Definições: "settings-outline",
  Plantel: "people-outline",
  Notificações: "notifications-outline",
};

/** Componente interno que vive dentro do NavigationContainer e dos providers */
const AppContent = () => {
  const { isAdmin, adminMode, setAdminMode } = useAuth();
  const { isCategoryChanging } = useCategory();
  const { colors } = useTheme();

  // Activa o mecanismo que esconde o overlay quando os dados ficam prontos
  useCategoryTransition();

  const EmptyScreen = () => null;

  return (
    <View style={styles.container}>
      <Tab.Navigator
        key={adminMode ? "admin" : "user"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.text.blackWhite,
          tabBarInactiveTintColor: colors.text.blackWhite,
          color: colors.text.muted,
          textColor: colors.text.muted,
          tabBarStyle: {
            backgroundColor: colors.backgrounds.screen,
            borderTopColor: colors.borders.default,
          },
          tabBarLabelStyle: {
            fontWeight: "500",
          },
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={[
                styles.tabBarLabel,
                focused && styles.tabBarLabelActive,
                { color },
              ]}
            >
              {route.name}
            </Text>
          ),
          tabBarIcon: ({ color, focused, size }) => {
            const iconName = ICON_MAP[route.name] ?? "ellipse-outline";
            const selectedIconName = focused
              ? iconName.replace("-outline", "")
              : iconName;
            return (
              <View
                style={[
                  styles.tabBarIconWrap,
                  focused && styles.tabBarIconWrapActive,
                ]}
              >
                <Ionicons
                  name={selectedIconName as any}
                  size={size}
                  color={color}
                />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeStack} />
        <Tab.Screen name="Jogos" component={MatchesStack} />
        <Tab.Screen name="Época" component={SeasonStack} />
        <Tab.Screen
          name="Notícias"
          component={adminMode ? AdminNewsStack : NewsStack}
        />
        <Tab.Screen
          name="Definições"
          component={adminMode ? ThemedAdminSettings : ThemedNotificationSettings}
        />

        {isAdmin && (
          <Tab.Screen
            name="Admin"
            component={EmptyScreen}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
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

      {/* Overlay de transição - aparece por cima de tudo quando muda escalão/season */}
      <CategoryTransitionOverlay visible={isCategoryChanging} />
    </View>
  );
};

export const AppNavigator = () => {
  const { adminMode } = useAuth();
  const { colors, mode } = useTheme();
  const navigationTheme = React.useMemo(
    () => ({
      dark: mode === "dark",
      colors: {
        primary: colors.brand.primary,
        background: colors.backgrounds.screen,
        card: colors.backgrounds.elevated,
        text: colors.text.primary,
        border: colors.borders.default,
        notification: colors.status.warning,
      },
      fonts: {
        regular: {
          fontFamily: "System",
          fontWeight: "400" as const,
        },
        medium: {
          fontFamily: "System",
          fontWeight: "500" as const,
        },
        bold: {
          fontFamily: "System",
          fontWeight: "700" as const,
        },
        heavy: {
          fontFamily: "System",
          fontWeight: "800" as const,
        },
      },
    }),
    [colors, mode],
  );

  return (
    <NavigationContainer
      key={adminMode ? "admin-root" : "user-root"}
      theme={navigationTheme}
    >
      <AppContent />
    </NavigationContainer>
  );
};

const styles = createThemedStyles(() => ({
  container: {
    flex: 1,
  },
  tabBarIconWrap: {
    width: 42,
    height: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    //borderTopWidth: 2,
    borderTopColor: "transparent",
  },
  tabBarIconWrapActive: {
    borderTopColor: COLORS.text.blackWhite,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  tabBarLabelActive: {
    fontWeight: "700",
  },
}));
