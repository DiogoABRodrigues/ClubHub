import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS } from "../../theme/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as Notifications from 'expo-notifications';

// URL do teu backend
const BACKEND_URL = 'https://teu-backend.com/api/device/preferences';

export const NotificationSettings = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState({
    matchStart: true,
    goals: true,
    finalResult: true,
    newsAlerts: false,
  });

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  // 2️⃣ Carregar preferências do AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem('notificationPrefs');
        if (stored) setPreferences(JSON.parse(stored));
      } catch (e) {
        console.log('Erro a carregar preferências', e);
      }
    };
    loadPreferences();
  }, []);

  // 3️⃣ Guardar preferências local + enviar para backend
  const savePreferences = async (newPrefs: typeof preferences) => {
    setPreferences(newPrefs);
    await AsyncStorage.setItem('notificationPrefs', JSON.stringify(newPrefs));

    if (deviceId && pushToken) {
      try {
        await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, pushToken, preferences: newPrefs }),
        });
      } catch (e) {
        console.log('Erro a enviar preferências para o backend', e);
      }
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    savePreferences(newPrefs);
  };

  const notificationTypes = [
    {
      key: "matchStart" as const,
      icon: "trophy-outline",
      title: "Início do Jogo",
      description: "Recebe notificações quando um jogo está prestes a começar",
      color: COLORS.chart3,
    },
    {
      key: "goals" as const,
      icon: "football-outline",
      title: "Golos",
      description: "Recebe alertas instantâneos quando há um golo",
      color: COLORS.chart3,
    },
    {
      key: "finalResult" as const,
      icon: "checkmark-done-outline",
      title: "Resultado Final",
      description: "Recebe notificação quando um jogo termina",
      color: COLORS.chart3,
    },
    {
      key: "newsAlerts" as const,
      icon: "newspaper-outline",
      title: "Alertas de Notícias",
      description: "Mantém-te atualizado com as últimas notícias do clube",
      color: COLORS.chart3,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Definições</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Notification Toggles */}
        <View style={styles.section}>
          {notificationTypes.map(({ key, icon, title, description, color }) => (
            <View key={key} style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: color + "20" }]}
                >
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