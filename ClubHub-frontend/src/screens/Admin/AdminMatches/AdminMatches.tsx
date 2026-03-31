import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Plus } from "lucide-react-native";
import { styles } from "./AdminMatches.styles";
import { MatchCard } from "../../../components/MatchCard";
import { COLORS } from "../../../theme/colors";
import { useMatches } from "../../../contexts/MatchesContext";
import { useTeams } from "../../../contexts/TeamsContext";
import { useCompetitions } from "../../../contexts/CompetitionContext";

export const AdminMatches: React.FC = ({ navigation }: any) => {
  const { matches, loading, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();
  const { competitions, refreshCompetitions } = useCompetitions();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllLive, setShowAllLive] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

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
      const normalized = teamName.trim().toLowerCase();
      const team = teams.find(
        (t) => t.name.trim().toLowerCase() === normalized,
      );
      return team?.logoUrl;
    },
    [teams],
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
    const query = searchQuery.toLowerCase();
    return matches
      .map((match) => ({
        ...match,
        homeTeamLower: getHomeTeam(match).toLowerCase(),
        awayTeamLower: getAwayTeam(match).toLowerCase(),
      }))
      .filter(
        (match) =>
          query === "" ||
          match.homeTeamLower.includes(query) ||
          match.awayTeamLower.includes(query),
      );
  }, [matches, searchQuery, getHomeTeam, getAwayTeam]);

  // ── Matches por status ───────────────────────────────
  const liveMatches = useMemo(
    () => filteredMatches.filter((m) => m.status === "live"),
    [filteredMatches],
  );
  const upcomingMatches = useMemo(
    () => filteredMatches.filter((m) => m.status === "upcoming").toReversed(),
    [filteredMatches],
  );
  const finishedMatches = useMemo(
    () => filteredMatches.filter((m) => m.status === "finished"),
    [filteredMatches],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.matchWrapper}>
        <MatchCard
          match={item}
          homeLogo={getTeamLogo(getHomeTeam(item)) || ""}
          awayLogo={getTeamLogo(getAwayTeam(item)) || ""}
          onPress={() =>
            navigation.navigate("AdminMatchDetail", { id: item.id })
          }
          competition={competitions.find((c) => c.id === item.competitionId)}
        />
      </View>
    ),
    [navigation, getTeamLogo, getHomeTeam, getAwayTeam],
  );

  // ── Função para renderizar cada secção ─────────────
  const renderMatchesSection = (
    title: string,
    matchesArray: any[],
    showAll: boolean,
    toggleShowAll: () => void,
  ) => {
    const displayMatches = showAll ? matchesArray : matchesArray.slice(0, 3);
    return (
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 16 }}>{title}</Text>
          {matchesArray.length > 3 && (
            <TouchableOpacity onPress={toggleShowAll}>
              <Text style={{ color: COLORS.primary }}>
                {showAll ? "Ver menos" : "Ver todos"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={displayMatches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false} // Para cada secção não ter scroll próprio
        />
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
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("AdminAddMatch")}
          >
            <Text style={styles.createButtonText}>Criar primeiro jogo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={[{ key: "live" }, { key: "upcoming" }, { key: "finished" }]}
          keyExtractor={(item) => item.key}
          refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                  />
                }
          ListHeaderComponent={
            <>
              {/* Botão Adicionar no topo do scroll */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AdminAddMatch")}
              >
                <Plus width={16} height={16} color="#fff" />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </>
          }
          renderItem={({ item }) => {
            if (item.key === "live" && liveMatches.length > 0) {
              return renderMatchesSection(
                "A Decorrer",
                liveMatches,
                showAllLive,
                () => setShowAllLive(!showAllLive),
              );
            }
            if (item.key === "upcoming" && upcomingMatches.length > 0) {
              return renderMatchesSection(
                "Próximos Jogos",
                upcomingMatches,
                showAllUpcoming,
                () => setShowAllUpcoming(!showAllUpcoming),
              );
            }
            if (item.key === "finished" && finishedMatches.length > 0) {
              return renderMatchesSection(
                "Últimos Resultados",
                finishedMatches,
                showAllFinished,
                () => setShowAllFinished(!showAllFinished),
              );
            }
            return null;
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
