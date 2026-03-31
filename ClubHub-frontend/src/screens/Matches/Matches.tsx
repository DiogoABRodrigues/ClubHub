import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Matches.styles";
import { MatchCard } from "../../components/MatchCard";
import { COLORS } from "../../theme/colors";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useCompetitions } from "../../hooks/useCompetitions";

interface MatchesSectionProps {
  title: string;
  matches: any[];
  showAll: boolean;
  toggleShowAll: () => void;
  getTeamLogo: (teamName: string) => string | undefined;
  navigation: any;
  getHomeTeam: (match: any) => string;
  getAwayTeam: (match: any) => string;
}

const MatchesSection = React.memo(({
  title,
  matches,
  showAll,
  toggleShowAll,
  getTeamLogo,
  navigation,
  getHomeTeam,
  getAwayTeam,
}: MatchesSectionProps) => {
  const limitedMatches = useMemo(() => {
    return showAll ? matches : matches.slice(0, 3);
  }, [matches, showAll]);
  
  const { competitions } = useCompetitions();

    const competitionsMap = useMemo(() => {
    const map = new Map();
    for (const c of competitions) {
      map.set(c.id, c);
    }
    return map;
  }, [competitions]);

  const isAdmin = false; 
  const navigateToMatchDetail = useCallback((matchId: string) => {
    if (isAdmin) {
      navigation.navigate("AdminMatchDetail", { id: matchId });
    } else {
      navigation.navigate("MatchDetail", { id: matchId });
    }
  }, [navigation, isAdmin]);
  
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
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
});

export const Matches = ({ navigation }: any) => {
  const { matches, loading, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();
  const teamsMap = useMemo(() => {
    const map = new Map();
    for (const t of teams) {
      map.set(t.name.trim().toLowerCase(), t.logoUrl);
    }
    return map;
  }, [teams]);
  const { refreshCompetitions } = useCompetitions();

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);

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

  const [refreshing, setRefreshing] = useState(false);

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

  const getTeamLogo = useCallback((teamName: string) => {
    return teamsMap.get(teamName.trim().toLowerCase());
  }, [teamsMap]);

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

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jogos e Resultados</Text>
        </View>
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
          <>
            {liveMatches.length > 0 && (
              <MatchesSection
                title="A Decorrer"
                matches={liveMatches}
                showAll={true}
                toggleShowAll={() => {}}
                getTeamLogo={getTeamLogo}
                navigation={navigation}
                getHomeTeam={getHomeTeam}
                getAwayTeam={getAwayTeam}
              />
            )}

            {upcomingMatches.length > 0 && (
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

            {finishedMatches.length > 0 && (
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

            {matches.length === 0 && (
              <View style={styles.noMatches}>
                <Text style={styles.noMatchesText}>
                  Não foram encontrados jogos
                </Text>
              </View>
            )}
          </>
      </ScrollView>
    </View>
  );
};
