import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trophy, Users, BarChart3, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./Season.styles";
import { AdminSquadScreen } from "../AdminSquad/SquadAdmin";
import { Standings } from "../../Standings/Standings";
import { SquadStats } from "../../Stats/Stats";
import { useSeasons } from "../../../contexts/SeasonContext";

type SeasonTab = "standings" | "squad" | "stats";

const TABS = [
  { key: "standings", label: "Classificação", icon: Trophy },
  { key: "squad", label: "Plantel", icon: Users },
  { key: "stats", label: "Estatísticas", icon: BarChart3 },
] as const;

export function AdminSeasonScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<SeasonTab>("standings");
  const { seasons } = useSeasons();

  const currentSeason = useMemo(() => {
    if (!seasons.length) return null;
    return seasons.reduce((a, b) => (b.id > a.id ? b : a));
  }, [seasons]);

  const handleTabPress = useCallback((tab: SeasonTab) => {
    setActiveTab(tab);
  }, []);

  const renderContent = () => {
    if (activeTab === "standings") return <Standings />;
    if (activeTab === "squad") return <AdminSquadScreen />;
    return <SquadStats />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <ArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Época {currentSeason?.year}</Text>
        <View style={styles.placeholder} />
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

      {renderContent()}
    </View>
  );
}

const TabButton = React.memo(({ Icon, label, active, onPress }: any) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
  >
    <Icon width={20} height={20} color={active ? "#3b82f6" : "#666"} />
    <Text style={[styles.tabText, active && styles.tabTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
));