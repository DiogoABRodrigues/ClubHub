import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Home.styles";
import { useStatements } from "../../hooks/useStatements";
import { MatchCard } from "../../components/MatchCard";
import { EmptyState } from "../../components/EmptyState";
import { COLORS } from "../../theme/colors";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useNews } from "../../hooks/useNews";
import { formatDatePT } from "../../utils/dateUtils";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useAuth } from "../../contexts/AuthContext";

export const Home = ({ navigation }: any) => {
  const { news, loading: newsLoading, refreshNews } = useNews();
  const { adminMode } = useAuth();
  const recentNews = useMemo(() => news.slice(0, 3), [news]);

  const { statements } = useStatements();
  const activeStatement = statements?.[0];
  const { matches, loading: matchesLoading, refreshMatches } = useMatches();
  const { competitions, refreshCompetitions } = useCompetitions();

  const competitionsMap = useMemo(() => {
    const map = new Map();
    for (const c of competitions) map.set(c.id, c);
    return map;
  }, [competitions]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshMatches(),
        refreshCompetitions(),
        refreshNews(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshCompetitions, refreshNews]);

  const liveMatches = useMemo(
    () => matches.filter((m) => m.status === "live"),
    [matches],
  );
  const { teams } = useTeams();

  const teamsMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of teams)
      map.set(t.name.trim().toLowerCase(), t.logoUrl || "");
    return map;
  }, [teams]);

  const nextMatch = useMemo(() => {
    const upcoming = matches.filter((m) => m.status === "upcoming");
    return upcoming.at(-1);
  }, [matches]);

  const recentMatch = useMemo(
    () => matches.filter((m) => m.status === "finished")[0],
    [matches],
  );

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

  const appTeamLogo = require("../../../assets/icon.png");

  const navigateToMatchDetail = (matchId: number) => {
    navigation.navigate(adminMode ? "AdminMatchDetail" : "MatchDetail", {
      id: matchId,
    });
  };

  const loading = matchesLoading || newsLoading;
  const isEmpty = !loading && matches.length === 0 && news.length === 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.eyebrow}>Bem-vindo</Text>
            <Text style={styles.title}>Início</Text>
          </View>
          <View style={styles.logoCircle}>
            <Image source={appTeamLogo} style={styles.logoCircle} />
          </View>
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
        {/* Banner de comunicado */}
        {activeStatement && (
          <View style={styles.statementBanner}>
            <View style={styles.statementIconRow}>
              <Ionicons
                name="megaphone-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.statementTitle}>{activeStatement.title}</Text>
            </View>
            <Text style={styles.statementMessage}>
              {activeStatement.message}
            </Text>
          </View>
        )}

        {/* Empty state global */}
        {isEmpty && (
          <EmptyState
            title="Não foi possível encontrar informação"
            message="Por favor tenta novamente mais tarde."
            onRetry={onRefresh}
            retryLabel="Atualizar"
          />
        )}

        {/* LIVE */}
        {liveMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.livePillText}>Em direto</Text>
              </View>
            </View>
            {liveMatches.map((match) => (
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
        )}

        {/* PRÓXIMO JOGO */}
        {
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              {/*<Ionicons
                name="calendar-outline"
                size={12}
                color={COLORS.secondary}
              />*/}
              <Text style={styles.sectionTitle}>Próximo Jogo</Text>
            </View>
            {(nextMatch && (
              <MatchCard
                match={nextMatch}
                homeLogo={getTeamLogo(getHomeTeam(nextMatch)) || ""}
                awayLogo={getTeamLogo(getAwayTeam(nextMatch)) || ""}
                onPress={() => navigateToMatchDetail(nextMatch.id)}
                competition={competitionsMap.get(nextMatch.competitionId)}
              />
            )) || (
              <EmptyState
                title="Sem jogos agendados"
                message="Volta mais tarde para veres os próximos jogos."
              />
            )}
          </View>
        }

        {/* ÚLTIMO JOGO */}
        {recentMatch && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              {/*<Ionicons
                name="time-outline"
                size={16}
                color={COLORS.secondary}
              />*/}
              <Text style={styles.sectionTitle}>Último Jogo</Text>
            </View>
            <MatchCard
              match={recentMatch}
              homeLogo={getTeamLogo(getHomeTeam(recentMatch)) || ""}
              awayLogo={getTeamLogo(getAwayTeam(recentMatch)) || ""}
              onPress={() => navigateToMatchDetail(recentMatch.id)}
              competition={competitionsMap.get(recentMatch.competitionId)}
            />
          </View>
        )}

        {/* NOTÍCIAS */}
        {!loading && recentNews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              {/*<Ionicons
                name="newspaper-outline"
                size={16}
                color={COLORS.secondary}
              />*/}
              <Text style={styles.sectionTitle}>Últimas Notícias</Text>
            </View>

            {(
              recentNews.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.newsCard}
                  onPress={() =>
                    navigation.navigate("NewsDetail", { id: item.id })
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.relatedImage}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.relatedImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.relatedImage,
                          { justifyContent: "center", alignItems: "center" },
                        ]}
                      >
                        <Text style={styles.logoEmoji}>⚽</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.newsExcerpt} numberOfLines={1}>
                      {item.content}
                    </Text>
                    <Text style={styles.relatedDate}>
                      {formatDatePT(item.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};