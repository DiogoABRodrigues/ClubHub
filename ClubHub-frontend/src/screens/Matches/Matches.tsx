import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import { styles, localStyles } from "./Matches.styles";
import { MatchCard } from "../../components/MatchCard";
import { COLORS } from "../../theme/colors";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useAuth } from "../../contexts/AuthContext";
import { EmptyState } from "../../components/EmptyState";

type TabKey = "upcoming" | "finished";

interface LiveBannerProps {
  matches: any[];
  getTeamLogo: (teamName: string) => string | undefined;
  navigation: any;
  getHomeTeam: (match: any) => string;
  getAwayTeam: (match: any) => string;
  competitionsMap: Map<any, any>;
  onPressMatch: (matchId: string) => void;
}

const LiveBanner = React.memo(
  ({
    matches,
    getTeamLogo,
    getHomeTeam,
    getAwayTeam,
    competitionsMap,
    onPressMatch,
  }: LiveBannerProps) => {
    if (matches.length === 0) return null;

    return (
      <View style={localStyles.liveBannerWrapper}>
        <View style={styles.sectionHeader}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}>Em direto</Text>
          </View>
        </View>

        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            homeLogo={getTeamLogo(getHomeTeam(match)) || ""}
            awayLogo={getTeamLogo(getAwayTeam(match)) || ""}
            onPress={() => onPressMatch(match.id)}
            competition={competitionsMap.get(match.competitionId)}
          />
        ))}
      </View>
    );
  },
);

interface TabBarProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const TAB_LABELS: Record<TabKey, string> = {
  upcoming: "Próximos jogos",
  finished: "Resultados",
};

const TabBar = React.memo(({ activeTab, onChange }: TabBarProps) => (
  <View style={localStyles.tabsContainer}>
    {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => {
      const active = activeTab === key;
      return (
        <TouchableOpacity
          key={key}
          style={[localStyles.tab, active && localStyles.tabActive]}
          onPress={() => onChange(key)}
          activeOpacity={0.7}
        >
          <Text style={[localStyles.tabText, active && localStyles.tabTextActive]}>
            {TAB_LABELS[key]}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
));

export const Matches = ({ navigation }: any) => {
  const { matches, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();
  const { competitions, refreshCompetitions } = useCompetitions();
  const { adminMode } = useAuth();

  const teamsMap = useMemo(() => {
    const map = new Map();
    for (const t of teams) map.set(t.name.trim().toLowerCase(), t.logoUrl);
    return map;
  }, [teams]);

  const competitionsMap = useMemo(() => {
    const map = new Map();
    for (const c of competitions) map.set(c.id, c);
    return map;
  }, [competitions]);

  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
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

  const activeList =
    activeTab === "upcoming" ? upcomingMatches : finishedMatches;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshMatches(),
        refreshCompetitions(),
        refreshTeams(),
      ]);
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

  const navigateToMatchDetail = useCallback(
    (matchId: string) => {
      navigation.navigate(adminMode ? "AdminMatchDetail" : "MatchDetail", {
        id: matchId,
      });
    },
    [navigation, adminMode],
  );

  const renderMatch = useCallback(
    ({ item: match }: { item: any }) => (
      <MatchCard
        match={match}
        homeLogo={getTeamLogo(getHomeTeam(match)) || ""}
        awayLogo={getTeamLogo(getAwayTeam(match)) || ""}
        onPress={() => navigateToMatchDetail(match.id)}
        competition={competitionsMap.get(match.competitionId)}
      />
    ),
    [getTeamLogo, getHomeTeam, getAwayTeam, navigateToMatchDetail, competitionsMap],
  );

  const emptyMessage =
    activeTab === "upcoming"
      ? {
          title: "Sem jogos agendados",
          message: "Volta mais tarde para veres os próximos jogos.",
        }
      : {
          title: "Sem resultados",
          message: "Ainda não há jogos terminados nesta época, volta mais tarde.",
        };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Jogos e Resultados</Text>
          </View>
        </View>
      </View>

      <LiveBanner
        matches={liveMatches}
        getTeamLogo={getTeamLogo}
        navigation={navigation}
        getHomeTeam={getHomeTeam}
        getAwayTeam={getAwayTeam}
        competitionsMap={competitionsMap}
        onPressMatch={navigateToMatchDetail}
      />

      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <FlatList
        data={activeList}
        renderItem={renderMatch}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState title={emptyMessage.title} message={emptyMessage.message} />
        }
      />
    </View>
  );
};