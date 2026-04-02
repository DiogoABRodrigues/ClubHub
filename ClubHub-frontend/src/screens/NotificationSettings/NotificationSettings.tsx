import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS } from "../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import * as Notifications from 'expo-notifications';

// URL do teu backend
const BACKEND_URL = "https://teu-backend.com/api/device/preferences";

export const NotificationSettings = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState({
    matchStart: true,
    goals: true,
    finalResult: true,
    newsAlerts: false,
    gameDayAlerts: true,
  });

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  const loadPreferences = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("notificationPrefs");
      if (stored) setPreferences(JSON.parse(stored));
    } catch (e) {
      console.log("Erro a carregar preferências", e);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // 3️⃣ Guardar preferências local + enviar para backend
  const savePreferences = useCallback(
    async (newPrefs: typeof preferences) => {
      setPreferences(newPrefs);
      await AsyncStorage.setItem("notificationPrefs", JSON.stringify(newPrefs));

      if (deviceId && pushToken) {
        try {
          await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId,
              pushToken,
              preferences: newPrefs,
            }),
          });
        } catch (e) {
          console.log("Erro a enviar preferências para o backend", e);
        }
      }
    },
    [deviceId, pushToken],
  );

  const togglePreference = useCallback(
    (key: keyof typeof preferences) => {
      setPreferences((prev) => {
        const newPrefs = { ...prev, [key]: !prev[key] };

        AsyncStorage.setItem("notificationPrefs", JSON.stringify(newPrefs));

        if (deviceId && pushToken) {
          fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId,
              pushToken,
              preferences: newPrefs,
            }),
          }).catch((e) => console.log("Erro backend prefs", e));
        }

        return newPrefs;
      });
    },
    [deviceId, pushToken],
  );

  const notificationTypes = useMemo(
    () => [
      {
        key: "gameDayAlerts" as const,
        icon: "calendar-outline",
        title: "Alertas de Jogo",
        description:
          "Recebe notificações no dia dos jogos para não perderes nenhum momento importante",
        color: COLORS.textPrimary,
      },
      {
        key: "matchStart" as const,
        icon: "trophy-outline",
        title: "Início do Jogo",
        description:
          "Recebe notificações quando um jogo está prestes a começar",
        color: COLORS.textPrimary,
      },
      {
        key: "goals" as const,
        icon: "football-outline",
        title: "Golos",
        description: "Recebe alertas instantâneos quando há um golo",
        color: COLORS.textPrimary,
      },
      {
        key: "finalResult" as const,
        icon: "checkmark-done-outline",
        title: "Resultado Final",
        description: "Recebe notificação quando um jogo termina",
        color: COLORS.textPrimary,
      },
      {
        key: "newsAlerts" as const,
        icon: "newspaper-outline",
        title: "Alertas de Notícias",
        description: "Mantém-te atualizado com as últimas notícias do clube",
        color: COLORS.textPrimary,
      },
    ],
    [],
  );
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Definições</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Notification Toggles */}
        <View style={styles.section}>
          {notificationTypes.map(({ key, icon, title, description, color }) => (
            <View key={key} style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={[styles.iconCircle]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>{title}</Text>
                  <Text style={styles.toggleDescription}>{description}</Text>
                </View>
              </View>
              <Switch
                value={preferences[key]}
                onValueChange={() => togglePreference(key)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
