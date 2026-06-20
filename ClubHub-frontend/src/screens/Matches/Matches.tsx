import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { styles } from "./Matches.styles";
import { MatchCard } from "../../components/MatchCard";
import { COLORS } from "../../theme/colors";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useAuth } from "../../contexts/AuthContext";
import { EmptyState } from "../../components/EmptyState";


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
  competitionsMap: Map<any, any>;
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
    competitionsMap,
  }: MatchesSectionProps) => {
    const limitedMatches = showAll ? matches : matches.slice(0, 4);
    const { adminMode } = useAuth();

    const navigateToMatchDetail = (matchId: string) => {
      navigation.navigate(adminMode ? "AdminMatchDetail" : "MatchDetail", {
        id: matchId,
      });
    };

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {isLive ? (
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>{title}</Text>
            </View>
          ) : (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          {matches.length > 4 && (
            <TouchableOpacity onPress={toggleShowAll}>
              <Text style={styles.showMoreInline}>
                {showAll ? "Ver menos" : "Ver todos"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {matches.length < 1 && (
          <EmptyState
            title="Sem jogos agendados"
            message="Volta mais tarde para veres os próximos jogos."
          />
        )}

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

export const Matches = ({ navigation }: any) => {
  const { matches, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();
  const { competitions, refreshCompetitions } = useCompetitions();

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

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const liveMatches = matches.filter(m => m.status === "live");
  const upcomingMatches = matches.filter(m => m.status === "upcoming").toReversed();
  const finishedMatches = matches.filter(m => m.status === "finished");

  const showLive = true;
  const showUpcoming = true;
  const showFinished = true;

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

  const isEmpty = matches.length === 0;

  const renderContent = () => (
    <View style={styles.content}>
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
          competitionsMap={competitionsMap}
        />
      )}

      {showUpcoming && (
        <MatchesSection
          title="Próximos jogos"
          matches={upcomingMatches}
          showAll={showAllUpcoming}
          toggleShowAll={() => setShowAllUpcoming(!showAllUpcoming)}
          getTeamLogo={getTeamLogo}
          navigation={navigation}
          getHomeTeam={getHomeTeam}
          getAwayTeam={getAwayTeam}
          competitionsMap={competitionsMap}
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
          competitionsMap={competitionsMap}
        />
      )}

      {isEmpty && (
        <EmptyState
          title="Não foi possível encontrar informação"
          message="Por favor tenta novamente mais tarde."
          onRetry={onRefresh}
          retryLabel="Atualizar"
        />
      )}
    </View>
  );

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

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};
