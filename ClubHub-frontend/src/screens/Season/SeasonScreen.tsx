import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./Season.styles";

import { SquadScreen } from "../Squad/Squad";
import { Standings } from "../Standings/Standings";
import { SquadStats } from "../Stats/Stats";
import { AdminSquadScreen } from "../Admin/AdminSquad/SquadAdmin";

import { useAuth } from "../../contexts/AuthContext";
import { useSelectedSeason } from "../../contexts/Selectedseasoncontext";
import { useTheme } from "../../contexts/ThemeContext";

type SeasonTab = "standings" | "squad" | "stats";

interface Tab {
  key: SeasonTab;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: "standings", label: "Classificação", icon: "trophy-outline" },
  { key: "squad", label: "Plantel", icon: "people-outline" },
  { key: "stats", label: "Estatísticas", icon: "bar-chart-outline" },
];

export function SeasonScreen({ navigation }: any) {
  const { adminMode } = useAuth();
  const { selectedSeason: currentSeason } = useSelectedSeason();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<SeasonTab>("standings");

  // 👇 mantém tabs já carregados (mount once)
  const [mountedTabs, setMountedTabs] = useState<SeasonTab[]>([
    "standings",
    "squad",
    "stats",
  ]);

  const handleTabPress = useCallback((tab: SeasonTab) => {
    setActiveTab(tab);

    setMountedTabs((prev) =>
      prev.includes(tab) ? prev : [...prev, tab]
    );
  }, []);

  const TabButton = useCallback(
    ({
      active,
      icon,
      label,
      onPress,
    }: {
      active: boolean;
      icon: string;
      label: string;
      onPress: () => void;
    }) => {
      const inactiveIcon =
        icon === "chat-outline" ? "bar-chart-outline" : icon;
      const iconName = active
        ? inactiveIcon.replace("-outline", "")
        : inactiveIcon;

      return (
        <TouchableOpacity
          style={[styles.tab, active && styles.tabActive]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={20}
            color={colors.text.blackWhite}
          />
          <Text style={[styles.tabText, active && styles.tabTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    },
    [colors]
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>
              Época {currentSeason?.year}
            </Text>
          </View>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.key}
            onPress={() => handleTabPress(tab.key)}
          />
        ))}
      </View>

      {/* CONTENT (lazy mount + keep alive) */}
      <View style={styles.content}>
        {/* Standings */}
        {mountedTabs.includes("standings") && (
          <View
            style={{
              flex: 1,
              display: activeTab === "standings" ? "flex" : "none",
            }}
          >
            <Standings navigation={navigation} />
          </View>
        )}

        {/* Squad */}
        {mountedTabs.includes("squad") && (
          <View
            style={{
              flex: 1,
              display: activeTab === "squad" ? "flex" : "none",
            }}
          >
            {adminMode ? <AdminSquadScreen /> : <SquadScreen />}
          </View>
        )}

        {/* Stats */}
        {mountedTabs.includes("stats") && (
          <View
            style={{
              flex: 1,
              display: activeTab === "stats" ? "flex" : "none",
            }}
          >
            <SquadStats />
          </View>
        )}
      </View>
    </View>
  );
}
