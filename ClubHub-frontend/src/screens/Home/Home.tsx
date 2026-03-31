import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./Home.styles";
import { useStatements } from "../../contexts/StatementContext";

import { MatchCard } from "../../components/MatchCard";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";

import { useMatches } from "../../contexts/MatchesContext";
import { useTeams } from "../../contexts/TeamsContext";
import { Image } from "react-native";

import { useNews } from "../../contexts/NewsContext";
import { formatDatePT } from "../../utils/dateUtils";
import { useCompetitions } from "../../contexts/CompetitionContext";

import { RefreshControl } from "react-native";

export const Home = ({ navigation }: any) => {
  const { news, refreshNews } = useNews();

  const recentNews = news.slice(0, 3);

  const { statements } = useStatements();
  const activeStatement = statements?.[0];
  const { matches, loading, refreshMatches } = useMatches();
  const { competitions, refreshCompetitions } = useCompetitions();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refreshMatches();
      await refreshCompetitions();
      await refreshNews();

    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const liveMatches = useMemo(
    () => matches.filter((m) => m.status === "live"),
    [matches],
  );

  const { teams } = useTeams();

  // próximo jogo (primeiro upcoming)
  const nextMatch = useMemo(
    () => matches.filter((m) => m.status === "upcoming").toReversed()[0],
    [matches],
  );

  // último jogo (mais recente finished)
  const recentMatch = useMemo(
    () => matches.filter((m) => m.status === "finished")[0],
    [matches],
  );

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

  const appTeamLogo = require("../../../assets/icon.png");

  return (
    <View style={styles.container}>
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
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{"Início"}</Text>
          </View>

          <View style={styles.logoCircle}>
            {appTeamLogo ? (
              <Image source={appTeamLogo} style={styles.logoCircle} />
            ) : (
              <Text>🏆</Text>
            )}
          </View>
        </View>
        {activeStatement && (
        <View style={styles.statementBanner}>
          <View style={styles.statementIconRow}>
            <Ionicons name="megaphone-outline" size={16} color={COLORS.primary} />
            <Text style={styles.statementTitle}>{activeStatement.title}</Text>
          </View>
          <Text style={styles.statementMessage}>{activeStatement.message}</Text>
        </View>
      )}
        {/* LIVE MATCHES */}
        {liveMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text
                style={[styles.sectionTitle, { color: COLORS.destructive }]}
              >
                A Decorrer
              </Text>
            </View>
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                homeLogo={getTeamLogo(getHomeTeam(match)) || ""}
                awayLogo={getTeamLogo(getAwayTeam(match)) || ""}
                onPress={() =>
                  navigation.navigate("MatchDetail", { id: match.id })
                }
                competition={competitions.find((c) => c.id === match.competitionId)}
              />
            ))}
          </View>
        )}

        {/* Next Match */}
        {nextMatch && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={COLORS.secondary}
              />
              <Text style={styles.sectionTitle}>Próximo Jogo</Text>
            </View>

            <MatchCard
              match={nextMatch}
              homeLogo={getTeamLogo(getHomeTeam(nextMatch)) || ""}
              awayLogo={getTeamLogo(getAwayTeam(nextMatch)) || ""}
              onPress={() =>
                navigation.navigate("MatchDetail", { id: nextMatch.id })
              }
              competition={competitions.find((c) => c.id === nextMatch.competitionId)}
            />
          </View>
        )}

        {/* RECENT MATCHE */}
        {recentMatch && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="time-outline"
                size={20}
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
              competition={competitions.find((c) => c.id === recentMatch.competitionId)}
            />
          </View>
        )}

        {/* NEWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Notícias</Text>

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
