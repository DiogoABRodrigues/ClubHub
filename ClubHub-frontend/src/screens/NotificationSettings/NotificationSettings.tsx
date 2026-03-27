import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "../../components/Switch";
import { styles } from "./NotificationSettings.styles";
import { COLORS } from "../../theme/colors";

export const NotificationSettings = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState({
    matchStart: true,
    goals: true,
    finalResult: true,
    newsAlerts: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
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
