import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { styles } from "./AdminMatches.styles";
import { MatchCard } from "../../../components/MatchCard";
import { COLORS } from "../../../theme/colors";
import { useMatches } from "../../../hooks/useMatches";
import { useTeams } from "../../../hooks/useTeams";
import { useCompetitions } from "../../../hooks/useCompetitions";
import Ionicons from "@expo/vector-icons/build/Ionicons";

export const AdminMatches: React.FC = ({ navigation }: any) => {
  const { matches, loading, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();
  const { competitions, refreshCompetitions } = useCompetitions();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllLive, setShowAllLive] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const competitionsMap = useMemo(() => {
    const map = new Map<number, any>();
    competitions.forEach((c) => map.set(c.id, c));
    return map;
  }, [competitions]);

  const teamsMap = useMemo(() => {
    const map = new Map<string, string>();

    teams.forEach((t) => {
      map.set(t.name.trim().toLowerCase(), t.logoUrl?.trim() || "");
    });

    return map;
  }, [teams]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refreshMatches();
      await refreshCompetitions();
      await refreshTeams();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getTeamLogo = useCallback(
    (teamName: string) => {
      return teamsMap.get(teamName.trim().toLowerCase()) || "";
    },
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

  // ── Filtragem eficiente ───────────────────────────────
  const filteredMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return matches;

    return matches.filter((m) => {
      const home = getHomeTeam(m).toLowerCase();
      const away = getAwayTeam(m).toLowerCase();

      return home.includes(query) || away.includes(query);
    });
  }, [matches, searchQuery, getHomeTeam, getAwayTeam]);

  const { liveMatches, upcomingMatches, finishedMatches } = useMemo(() => {
    const live: any[] = [];
    const upcoming: any[] = [];
    const finished: any[] = [];

    for (const m of filteredMatches) {
      if (m.status === "live") live.push(m);
      else if (m.status === "upcoming") upcoming.push(m);
      else if (m.status === "finished") finished.push(m);
    }

    return {
      liveMatches: live,
      upcomingMatches: upcoming.toReversed(),
      finishedMatches: finished,
    };
  }, [filteredMatches]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={styles.matchWrapper}>
        <MatchCard
          match={item}
          homeLogo={getTeamLogo(getHomeTeam(item))}
          awayLogo={getTeamLogo(getAwayTeam(item))}
          competition={competitionsMap.get(item.competitionId)}
          onPress={() =>
            navigation.navigate("AdminMatchDetail", { id: item.id })
          }
        />
      </View>
    ),
    [navigation, getTeamLogo, getHomeTeam, getAwayTeam, competitionsMap],
  );

  const renderMatchesSection = (
    title: string,
    matchesArray: any[],
    showAll: boolean,
    toggleShowAll: () => void,
  ) => {
    const displayMatches = showAll ? matchesArray : matchesArray.slice(0, 3);

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>

          {matchesArray.length > 3 && (
            <TouchableOpacity onPress={toggleShowAll}>
              <Text style={styles.seeAllText}>
                {showAll ? "Ver menos" : "Ver todos"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {displayMatches.map((item) => (
          <View key={item.id} style={styles.matchWrapper}>
            <MatchCard
              match={item}
              homeLogo={getTeamLogo(getHomeTeam(item))}
              awayLogo={getTeamLogo(getAwayTeam(item))}
              competition={competitionsMap.get(item.competitionId)}
              onPress={() =>
                navigation.navigate("AdminMatchDetail", { id: item.id })
              }
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Lista de secções */}
      {filteredMatches.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 32 }}>⚽</Text>
          </View>
          <Text style={styles.emptyText}>Nenhum jogo encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={[{ key: "live" }, { key: "upcoming" }, { key: "finished" }]}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={
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
          }
          renderItem={({ item }) => {
            if (item.key === "live" && liveMatches.length) {
              return renderMatchesSection(
                "A Decorrer",
                liveMatches,
                showAllLive,
                () => setShowAllLive((v) => !v),
              );
            }

            if (item.key === "upcoming" && upcomingMatches.length) {
              return renderMatchesSection(
                "Próximos Jogos",
                upcomingMatches,
                showAllUpcoming,
                () => setShowAllUpcoming((v) => !v),
              );
            }

            if (item.key === "finished" && finishedMatches.length) {
              return renderMatchesSection(
                "Últimos Resultados",
                finishedMatches,
                showAllFinished,
                () => setShowAllFinished((v) => !v),
              );
            }

            return null;
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </View>
  );
};
