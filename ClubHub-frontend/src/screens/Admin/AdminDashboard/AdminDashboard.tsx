import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./AdminDashboard.styles";

import { AdminNewsStack } from "../../../navigation/AdminNewsStack";
import { AdminMatchesStack } from "../../../navigation/AdminMatchsStack ";
import { AdminSquadScreen } from "../AdminSquad/SquadAdmin";

type AdminTab = "matches" | "news" | "notifications";

interface Tab {
  key: AdminTab;
  label: string;
}

const TabButton = React.memo(
  ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  ),
);

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("matches");

  const tabs: Tab[] = useMemo(
    () => [
      { key: "matches", label: "Jogos" },
      { key: "news", label: "Notícias" },
      { key: "notifications", label: "Notificações" },
    ],
    [],
  );

  const handleTabPress = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
  }, []);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "matches":
        return <AdminMatchesStack />;
      case "news":
        return <AdminNewsStack />;
      case "notifications":
        return <AdminSquadScreen />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
      </View>

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

      <View style={styles.content}>{renderContent}</View>
    </View>
  );
}
