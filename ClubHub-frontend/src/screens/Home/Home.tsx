import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { styles } from "./Home.styles";
import { useStatements } from "../../hooks/useStatements";

import { MatchCard } from "../../components/MatchCard";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";

import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { Image } from "react-native";

import { useNews } from "../../hooks/useNews";
import { formatDatePT } from "../../utils/dateUtils";
import { useCompetitions } from "../../hooks/useCompetitions";

import { RefreshControl } from "react-native";

export const Home = ({ navigation }: any) => {
  const { news, refreshNews } = useNews();

  const recentNews = useMemo(() => {
    return news.slice(0, 3);
  }, [news]);

  const { statements } = useStatements();
  const activeStatement = statements?.[0];
  const { matches, loading, refreshMatches } = useMatches();
  const { competitions, refreshCompetitions } = useCompetitions();

  const competitionsMap = useMemo(() => {
    const map = new Map();
    for (const c of competitions) {
      map.set(c.id, c);
    }
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
    for (const t of teams) {
      map.set(t.name.trim().toLowerCase(), t.logoUrl || "");
    }
    return map;
  }, [teams]);

  const nextMatch = useMemo(() => {
    return matches.filter((m) => m.status === "upcoming").toReversed()[0];
  }, [matches]);

  const recentMatch = useMemo(() => {
    return matches.filter((m) => m.status === "finished")[0];
  }, [matches]);

  const getTeamLogo = useCallback(
    (teamName: string) => {
      return teamsMap.get(teamName.trim().toLowerCase());
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

  const appTeamLogo = require("../../../assets/icon.png");

  const isAdmin = true;

  const navigateToMatchDetail = (matchId: number) => {
    navigation.navigate(isAdmin ? "AdminMatchDetail" : "MatchDetail", {
      id: matchId,
    });
  };

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.eyebrow}>Bem-vindo</Text>
            <Text style={styles.title}>Início</Text>
          </View>
          <View style={styles.logoCircle}>
            {appTeamLogo ? (
              <Image source={appTeamLogo} style={styles.logoCircle} />
            ) : (
              <Text>🏆</Text>
            )}
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

        {/* ── LIVE MATCHES ── */}
        {liveMatches.length > 0 && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                {/* Live pill — igual ao badge dentro do card */}
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
          </>
        )}

        {/* ── NEXT MATCH ── */}
        {nextMatch && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={COLORS.secondary}
                />
                <Text style={styles.sectionTitle}>Próximo Jogo</Text>
              </View>
              <MatchCard
                match={nextMatch}
                homeLogo={getTeamLogo(getHomeTeam(nextMatch)) || ""}
                awayLogo={getTeamLogo(getAwayTeam(nextMatch)) || ""}
                onPress={() => navigateToMatchDetail(nextMatch.id)}
                competition={competitions.find(
                  (c) => c.id === nextMatch.competitionId,
                )}
              />
            </View>
          </>
        )}

        {/* ── RECENT MATCH ── */}
        {recentMatch && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={COLORS.secondary}
                />
                <Text style={styles.sectionTitle}>Último Jogo</Text>
              </View>
              <MatchCard
                match={recentMatch}
                homeLogo={getTeamLogo(getHomeTeam(recentMatch)) || ""}
                awayLogo={getTeamLogo(getAwayTeam(recentMatch)) || ""}
                onPress={() =>
                  navigation.navigate("MatchDetail", { id: recentMatch.id })
                }
                competition={competitions.find(
                  (c) => c.id === recentMatch.competitionId,
                )}
              />
            </View>
          </>
        )}

        {/* ── NEWS ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="newspaper-outline"
              size={16}
              color={COLORS.secondary}
            />
            <Text style={styles.sectionTitle}>Últimas Notícias</Text>
          </View>
          {recentNews.map((news) => (
            <TouchableOpacity
              key={news.id}
              style={styles.newsCard}
              onPress={() => navigation.navigate("NewsDetail", { id: news.id })}
              activeOpacity={0.7}
            >
              <View style={styles.relatedImage}>
                {news.image ? (
                  <Image
                    source={{ uri: news.image }}
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
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsExcerpt}>{news.excerpt}</Text>
                <Text style={styles.relatedDate}>
                  {formatDatePT(news.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
