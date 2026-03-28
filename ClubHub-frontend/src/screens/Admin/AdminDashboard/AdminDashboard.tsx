import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./AdminDashboard.styles";
import { AdminNewsStack } from "../../../navigation/AdminNewsStack";
import { AdminMatchesStack } from "../../../navigation/AdminMatchsStack ";
import { AdminNotifications } from "../AdminNotifications/AdminNotifications";
import { useNavigation } from "@react-navigation/native";

type AdminTab = "matches" | "news" | "notifications";

interface Tab {
  key: AdminTab;
  label: string;
}

interface TabButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton = React.memo(({ label, active, onPress }: TabButtonProps) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
));

export function AdminDashboard() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<AdminTab>("matches");

  const tabs: Tab[] = useMemo(
    () => [
      { key: "matches", label: "Jogos"},
      { key: "news", label: "Notícias"},
      { key: "notifications", label: "Notificações"},
    ],
    []
  );

  const handleTabPress = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
  }, []);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "matches":
        return <AdminMatchesStack/>;
      case "news":
        return <AdminNewsStack/>;
      case "notifications":
        return <AdminNotifications/>;
    }
  }, [activeTab, navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Painel Admin</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            active={activeTab === tab.key}
            onPress={() => handleTabPress(tab.key)}
          />
        ))}
      </View>

      {/* Content — sem ScrollView aqui pois cada ecrã gere o seu próprio scroll */}
      <View style={styles.content}>{renderContent}</View>
    </View>
  );
}