import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trophy, Users, BarChart3 } from "lucide-react-native";
import { styles } from "./Season.styles";
import { SquadScreen } from "../Squad/Squad";
import { Standings } from "../Standings/Standings";
import { SquadStats } from "../Stats/Stats";
import { COLORS } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";
import { useSelectedSeason } from "../../contexts/Selectedseasoncontext";
import { SeasonPicker } from "../../components/Seasonpicker";
import { CategoryPicker } from "../../components/Categorypicker";
import { AdminSquadScreen } from "../Admin/AdminSquad/SquadAdmin";

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

export function SeasonScreen({ navigation }: any) {
  const { adminMode } = useAuth();
  const [activeTab, setActiveTab] = useState<SeasonTab>("standings");
  const [visited, setVisited] = useState<Set<SeasonTab>>(new Set(["standings"]));
  const { selectedSeason: currentSeason } = useSelectedSeason();

  const handleTabPress = useCallback((tab: SeasonTab) => {
    setActiveTab(tab);
    setVisited((prev) => new Set(prev).add(tab));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Época {currentSeason?.year}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <CategoryPicker />
            <SeasonPicker />
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

      {visited.has("standings") && (
        <View style={{ flex: 1, display: activeTab === "standings" ? "flex" : "none" }}>
          <Standings
            navigation={navigation}
          />
        </View>
      )}

      {visited.has("squad") && (
        <View style={{ flex: 1, display: activeTab === "squad" ? "flex" : "none" }}>
          {adminMode ? <AdminSquadScreen /> : <SquadScreen />}
        </View>
      )}

      {visited.has("stats") && (
        <View style={{ flex: 1, display: activeTab === "stats" ? "flex" : "none" }}>
          <SquadStats />
        </View>
      )}
    </View>
  );
}

const TabButton = React.memo(({ Icon, label, active, onPress }: any) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
  >
    <Icon
      width={20}
      height={20}
      color={active ? COLORS.primary : COLORS.primaryDark}
    />
    <Text style={[styles.tabText, active && styles.tabTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
));