import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import { LiveBadge } from "../../components/LiveBadge";
import { EventRow } from "../../components/EventRow";

import { COLORS } from "../../theme/colors";
import { styles } from "./MatchDetail.styles";

import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { usePlayers } from "../../hooks/usePlayers";
import { useCompetitions } from "../../hooks/useCompetitions";

import {
  formatDateWithWeekdayPT,
  getPenaltyDisplayScore,
} from "../../utils/dateUtils";

import { getPositionOrder } from "../../utils/playerPositionUtils";
import { Competition } from "../../models/Competition";

export const MatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };

  const { competitions, refreshCompetitions } = useCompetitions();
  const { getActivePlayers, refreshPlayers } = usePlayers();
  const { matches, loading, refreshMatches } = useMatches();
  const { teams, refreshTeams } = useTeams();

  const players = useMemo(() => getActivePlayers(), [getActivePlayers]);

  const playersMap = useMemo(() => {
    const map = new Map<number, any>();
    for (const p of players) {
      map.set(p.id, p);
    }
    return map;
  }, [players]);

  const match = matches.find((m) => m.id === id);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshMatches(),
        refreshCompetitions(),
        refreshTeams(),
        refreshPlayers(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshCompetitions, refreshTeams, refreshPlayers]);

  const [activeTab, setActiveTab] = useState<"timeline" | "lineup">(
    "timeline",
  );

  const tabs = useMemo(
    () => [
      { key: "timeline", label: "Sumário" },
      { key: "lineup", label: "Formação" },
    ],
    [],
  );

  if (loading) {
    return (
      <View style={[styles.container]}>
        <Text style={styles.mutedText}>A carregar jogo...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={[styles.container]}>
        <Text style={styles.mutedText}>Match not found</Text>
      </View>
    );
  }

  const homeTeamName =
    match.homeOrAway === "C" ? match.teamName : match.opponent;

  const awayTeamName =
    match.homeOrAway === "F" ? match.teamName : match.opponent;

  const isHomeGame = match.homeOrAway === "C";

  const competition = useMemo(() => {
    return competitions.find(
      (c) => c.id === match.competitionId,
    ) as Competition;
  }, [match.competitionId, competitions]);

  const getTeamteamLogo = useCallback(
    (teamName: string) => {
      const normalized = teamName.trim().toLowerCase();
      return teams.find(
        (t) => t.name.trim().toLowerCase() === normalized,
      )?.logoUrl;
    },
    [teams],
  );

  const hometeamLogo = getTeamteamLogo(homeTeamName);
  const awayteamLogo = getTeamteamLogo(awayTeamName);

  const penaltyDisplay = useMemo(
    () =>
      getPenaltyDisplayScore(
        match.result,
        match.outcome,
        match.homeOrAway,
        match.decidedByPenalties,
      ),
    [
      match.result,
      match.outcome,
      match.homeOrAway,
      match.decidedByPenalties,
    ],
  );

  const [homeScoreDisplay, awayScoreDisplay] = (
    penaltyDisplay ?? match.result?.split("-") ?? ["", ""]
  );

  const sortedLineup = useMemo(() => {
    if (!match.Lineups) return [];

    return [...match.Lineups].sort((a, b) => {
      const aPos = playersMap.get(a.playerId)?.position ?? "";
      const bPos = playersMap.get(b.playerId)?.position ?? "";

      const orderA = getPositionOrder(aPos);
      const orderB = getPositionOrder(bPos);

      if (orderA !== orderB) return orderA - orderB;

      const aName = playersMap.get(a.playerId)?.name || "";
      const bName = playersMap.get(b.playerId)?.name || "";

      return aName.localeCompare(bName);
    });
  }, [match.Lineups, playersMap]);

  // 🔥 EVENTOS OTIMIZADOS (1 PASS ONLY)
  const groupedEvents = useMemo(() => {
    return (match.events ?? []).reduce(
      (acc, e) => {
        if (e.type === "penalty_shootout") {
          acc.penalties.push(e);
          return acc;
        }

        if (e.phase === "1st" || (!e.phase && e.minute <= 45)) {
          acc.firstHalf.push(e);
          return acc;
        }

        if (e.phase === "2nd" || (!e.phase && e.minute > 45)) {
          acc.secondHalf.push(e);
          return acc;
        }

        if (e.phase === "extra") {
          acc.extraTime.push(e);
        }

        return acc;
      },
      {
        firstHalf: [] as any[],
        secondHalf: [] as any[],
        extraTime: [] as any[],
        penalties: [] as any[],
      },
    );
  }, [match.events]);

  const { firstHalf, secondHalf, extraTime, penalties } = groupedEvents;

  return (
    <ScrollView
      style={styles.container}
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Detalhes do jogo</Text>

        <View style={styles.statusContainer}>
          {match.status === "live" && <LiveBadge interval={match.statusTime === "interval"} />}
          {match.status === "upcoming" && (
            <Text style={styles.badgeText}>Agendado</Text>
          )}
          {match.status === "finished" && (
            <Text style={styles.badgeText}>Terminado</Text>
          )}
        </View>

        <Text style={styles.competition}>
          {competition?.name || ""} {match.round ? `- ${match.round}` : ""}
        </Text>

        {/* SCORE */}
        <View style={styles.scoreCard}>
          <View style={styles.teamContainer}>
            {hometeamLogo ? (
              <Image source={{ uri: hometeamLogo }} style={styles.teamLogo} />
            ) : (
              <Text>🏆</Text>
            )}
            <Text style={styles.teamName}>{homeTeamName}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{homeScoreDisplay}</Text>
            <Text style={styles.colon}>-</Text>
            <Text style={styles.scoreText}>{awayScoreDisplay}</Text>
          </View>

          <View style={styles.teamContainer}>
            {awayteamLogo ? (
              <Image source={{ uri: awayteamLogo }} style={styles.teamLogo} />
            ) : (
              <Text>🏆</Text>
            )}
            <Text style={styles.teamName}>{awayTeamName}</Text>
          </View>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsList}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={[
                styles.tabTrigger,
                activeTab === tab.key && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && {
                    color: COLORS.textSecondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CONTENT */}
        <View style={styles.tabContent}>
          {activeTab === "timeline" &&
            (match.events?.length ? (
              <>
                {firstHalf.length > 0 && (
                  <>
                  <View style={[styles.halfHeader]}>
                    <Text style={styles.halfHeaderText}>1ª Parte</Text>
                  </View>  
                    {firstHalf.map((event: any) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        isOurs={isHomeGame ? !event.isOpponent : event.isOpponent}
                      />
                    ))}
                  </>
                )}

                {secondHalf.length > 0 && (
                  <>
                    <View style={[styles.halfHeader]}>
                      <Text style={styles.halfHeaderText}>2ª Parte</Text>
                    </View>
                    {secondHalf.map((event: any) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        isOurs={isHomeGame ? !event.isOpponent : event.isOpponent}
                      />
                    ))}
                  </>
                )}

                {extraTime.length > 0 && (
                  <>
                    <Text style={styles.halfHeaderText}>Prolongamento</Text>
                    {extraTime.map((event: any) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        isOurs={isHomeGame ? !event.isOpponent : event.isOpponent}
                      />
                    ))}
                  </>
                )}

                {penalties.length > 0 && (
                  <>
                    <Text style={styles.halfHeaderText}>Penaltis</Text>
                    {penalties.map((event: any) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        isOurs={isHomeGame ? !event.isOpponent : event.isOpponent}
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome5
                  name="hourglass-half"
                  size={36}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.mutedText}>Sem eventos ainda</Text>
              </View>
            ))}

          {activeTab === "lineup" && (
            <>
              {sortedLineup.length > 0 ? (
                <>
                  <Text style={styles.lineupSectionTitle}>Titulares</Text>
                  {sortedLineup
                    .filter((e: any) => e.isStarting)
                    .map((e: any) => {
                      const player = playersMap.get(e.playerId);
                      if (!player) return null;

                      return (
                        <View key={e.playerId} style={styles.lineupRow}>
                          <Text style={styles.lineupName}>
                            {player.name}
                          </Text>
                        </View>
                      );
                    })}

                  <Text style={styles.lineupSectionTitle}>Suplentes</Text>
                  {sortedLineup
                    .filter((e: any) => !e.isStarting)
                    .map((e: any) => {
                      const player = playersMap.get(e.playerId);
                      if (!player) return null;

                      return (
                        <View key={e.playerId} style={styles.lineupRow}>
                          <Text style={styles.lineupName}>
                            {player.name}
                          </Text>
                        </View>
                      );
                    })}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.mutedText}>
                    Formação não disponível
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};