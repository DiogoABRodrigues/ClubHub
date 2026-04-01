import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Matches.styles";
import { MatchCard } from "../../components/MatchCard";
import { COLORS } from "../../theme/colors";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useCompetitions } from "../../hooks/useCompetitions";

// ── Tipos de tab ──────────────────────────────────────────────────────────────
type TabKey = "all" | "live" | "upcoming";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "live", label: "Em direto" },
  { key: "upcoming", label: "Próximos" },
];

// ── MatchesSection ────────────────────────────────────────────────────────────
interface MatchesSectionProps {
  title: string;
  isLive?: boolean;
  matches: any[];
  showAll: boolean;
  toggleShowAll: () => void;
  getTeamLogo: (teamName: string) => string | undefined;
  navigation: any;
  getHomeTeam: (match: any) => string;
  getAwayTeam: (match: any) => string;
}

const MatchesSection = React.memo(
  ({
    title,
    isLive = false,
    matches,
    showAll,
    toggleShowAll,
    getTeamLogo,
    navigation,
    getHomeTeam,
    getAwayTeam,
  }: MatchesSectionProps) => {
    const limitedMatches = useMemo(
      () => (showAll ? matches : matches.slice(0, 3)),
      [matches, showAll],
    );

    const { competitions } = useCompetitions();
    const competitionsMap = useMemo(() => {
      const map = new Map();
      for (const c of competitions) map.set(c.id, c);
      return map;
    }, [competitions]);

    const isAdmin = true;
    const navigateToMatchDetail = useCallback(
      (matchId: string) => {
        if (isAdmin) {
          navigation.navigate("AdminMatchDetail", { id: matchId });
        } else {
          navigation.navigate("MatchDetail", { id: matchId });
        }
      },
      [navigation, isAdmin],
    );

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {/* Título: pill vermelha para live, ícone + texto para as restantes */}
          {isLive ? (
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>{title}</Text>
            </View>
          ) : (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}

          {matches.length > 3 && (
            <TouchableOpacity onPress={toggleShowAll}>
              <Text style={styles.showMoreInline}>
                {showAll ? "Ver menos" : "Ver todos"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {limitedMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            homeLogo={getTeamLogo(getHomeTeam(match)) || ""}
            awayLogo={getTeamLogo(getAwayTeam(match)) || ""}
            onPress={() => navigateToMatchDetail(match.id)}
            competition={competitionsMap.get(match.competitionId)}
          />
        ))}
      </View>
    );
  },
);

// ── Matches screen ────────────────────────────────────────────────────────────
export const Matches = ({ navigation }: any) => {
  const { matches, loading, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();

  const teamsMap = useMemo(() => {
    const map = new Map();
    for (const t of teams) map.set(t.name.trim().toLowerCase(), t.logoUrl);
    return map;
  }, [teams]);

  const { refreshCompetitions } = useCompetitions();

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const liveMatches = useMemo(
    () => matches.filter((m) => m.status === "live"),
    [matches],
  );
  const upcomingMatches = useMemo(
    () => matches.filter((m) => m.status === "upcoming").toReversed(),
    [matches],
  );
  const finishedMatches = useMemo(
    () => matches.filter((m) => m.status === "finished"),
    [matches],
  );

  // O que mostrar depende da tab activa
  const showLive = activeTab === "all" || activeTab === "live";
  const showUpcoming = activeTab === "all" || activeTab === "upcoming";
  const showFinished = activeTab === "all";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshMatches(), refreshCompetitions(), refreshTeams()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshCompetitions, refreshTeams]);

  const getTeamLogo = useCallback(
    (teamName: string) => teamsMap.get(teamName.trim().toLowerCase()),
    [teamsMap],
  );

  const getHomeTeam = useCallback(
    (match: any) =>
      match.homeOrAway === "C" ? match.teamName : match.opponent,
    [],
  );

  const getAwayTeam = useCallback(
    (match: any) =>
      match.homeOrAway === "F" ? match.teamName : match.opponent,
    [],
  );

  const isEmpty =
    (activeTab === "all" && matches.length === 0) ||
    (activeTab === "live" && liveMatches.length === 0) ||
    (activeTab === "upcoming" && upcomingMatches.length === 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jogos e Resultados</Text>
        </View>

        {/* Tabs de filtro */}
        
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.tabsRow}>
        {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              {tab.key === "live" && (
                <View style={styles.tabLiveDot} />
              )}
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {showLive && liveMatches.length > 0 && (
          <MatchesSection
            title="Em direto"
            isLive
            matches={liveMatches}
            showAll={true}
            toggleShowAll={() => {}}
            getTeamLogo={getTeamLogo}
            navigation={navigation}
            getHomeTeam={getHomeTeam}
            getAwayTeam={getAwayTeam}
          />
        )}

        {showUpcoming && upcomingMatches.length > 0 && (
          <MatchesSection
            title="Próximos jogos"
            matches={upcomingMatches}
            showAll={showAllUpcoming}
            toggleShowAll={() => setShowAllUpcoming(!showAllUpcoming)}
            getTeamLogo={getTeamLogo}
            navigation={navigation}
            getHomeTeam={getHomeTeam}
            getAwayTeam={getAwayTeam}
          />
        )}

        {showFinished && finishedMatches.length > 0 && (
          <MatchesSection
            title="Últimos Resultados"
            matches={finishedMatches}
            showAll={showAllFinished}
            toggleShowAll={() => setShowAllFinished(!showAllFinished)}
            getTeamLogo={getTeamLogo}
            navigation={navigation}
            getHomeTeam={getHomeTeam}
            getAwayTeam={getAwayTeam}
          />
        )}

        {isEmpty && (
          <View style={styles.noMatches}>
            <Text style={styles.noMatchesText}>
              Não foram encontrados jogos
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};