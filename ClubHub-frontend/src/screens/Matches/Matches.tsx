import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Matches.styles";
import { MatchCard } from "../../components/MatchCard";
import { COLORS } from "../../theme/colors";
import { useMatches } from "../../contexts/MatchesContext";
import { useTeams } from "../../contexts/TeamsContext";

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

const MatchesSection: React.FC<MatchesSectionProps> = ({
  title,
  matches,
  showAll,
  toggleShowAll,
  getTeamLogo,
  navigation,
  getHomeTeam,
  getAwayTeam,
}) => {
  const limitedMatches = useMemo(
    () => (showAll ? matches : matches.slice(0, 3)),
    [matches, showAll],
  );

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
          onPress={() => navigation.navigate("MatchDetail", { id: match.id })}
        />
      ))}
    </View>
  );
};

export const Matches = ({ navigation }: any) => {
  const { matches, loading } = useMatches();
  const { teams } = useTeams();

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

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            A carregar jogos...
          </Text>
        ) : (
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
        )}
      </ScrollView>
    </View>
  );
};
