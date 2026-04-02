import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS } from "../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginRequest } from "../../services/AuthService";

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

  const { loginAsAdmin } = useAuth();

const [userName, setUserName] = useState("");
const [password, setPassword] = useState("");
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
      <View style={{ marginBottom: 15 }}>
  <TextInput
    placeholder="Username"
    value={userName}
    onChangeText={setUserName}
    autoCapitalize="none"
    style={{
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    }}
  />

  <TextInput
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    style={{
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 10,
    }}
  />
</View>
      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#111",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
        onPress={async () => {
  try {
    const data = await loginRequest(userName, password);
    await loginAsAdmin(data.accessToken, data.refreshToken);
    navigation.navigate("Home");
  } catch (e) {
    console.log("login error", e);
  }
}}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};
