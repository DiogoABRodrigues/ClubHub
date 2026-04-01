import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trophy, Users, BarChart3, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./Season.styles";
import { SquadScreen } from "../Squad/Squad";
import { Standings } from "../Standings/Standings";
import { SquadStats } from "../Stats/Stats";
import { useSeasons } from "../../hooks/useSeasons";
import { COLORS } from "../../theme/colors";

type SeasonTab = "standings" | "squad" | "stats";

interface Tab {
  key: SeasonTab;
  label: string;
  icon: any;
}

const TABS: Tab[] = [
  { key: "standings", label: "Classificação", icon: Trophy },
  { key: "squad", label: "Plantel", icon: Users },
  { key: "stats", label: "Estatísticas", icon: BarChart3 },
];

// SeasonScreen.tsx
export function SeasonScreen() {
  const [activeTab, setActiveTab] = useState<SeasonTab>("standings");
  const { seasons } = useSeasons();

  const currentSeason = useMemo(() => {
    if (!seasons.length) return null;
    return seasons.reduce((latest, season) =>
      season.id > latest.id ? season : latest
    );
  }, [seasons]);

  const handleTabPress = useCallback((tab: SeasonTab) => {
    setActiveTab(tab);
  }, []);

  // Renderizar os componentes condicionalmente sem usar função
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Época {currentSeason?.year}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            Icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.key}
            onPress={() => handleTabPress(tab.key)}
          />
        ))}
      </View>

      {/* Renderização condicional direta */}
      {activeTab === "standings" && <Standings />}
      {activeTab === "squad" && <SquadScreen />}
      {activeTab === "stats" && <SquadStats />}
    </View>
  );
}

const TabButton = React.memo(
  ({ Icon, label, active, onPress }: any) => (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
    >
      <Icon width={20} height={20} color={active ? COLORS.primary : COLORS.primaryDark} />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
);