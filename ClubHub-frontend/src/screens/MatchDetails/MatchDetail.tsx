import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { PlayerLineup } from "../../components/PlayerLineup";
import { LiveBadge } from "../../components/LiveBadge";
import { COLORS } from "../../theme/colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { styles } from "./MatchDetail.styles";
import { useMatches } from "../../contexts/MatchesContext";
import { useTeams } from "../../contexts/TeamsContext";
import { formatDateWithWeekdayPT } from "../../utils/dateUtils";
import { teamConfig } from "../../config/teamConfig";
import { usePlayers } from "../../contexts/PlayersContext";
import { mapToMainPosition } from "../../utils/playerPositionUtils";

export const MatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };

  const { players } = usePlayers();
  const { matches, loading } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();

  const match = matches.find((m) => m.id === id);

  const [activeTab, setActiveTab] = useState<"timeline" | "lineup">("timeline");

  const tabs = useMemo(
    () => [
      { key: "timeline", label: "Sumário" },
      { key: "lineup", label: "Formação" },
    ],
    [],
  );

  if (!match) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.mutedText}>Match not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.primaryText, { marginTop: 8 }]}>
            Back to Matches
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const homeTeamName =
    match.homeOrAway === "C" ? match.teamName : match.opponent;
  const awayTeamName =
    match.homeOrAway === "F" ? match.teamName : match.opponent;

  const getTeamLogo = (teamName: string) => {
    const normalized = teamName.trim().toLowerCase();
    return teams.find((t) => t.name.trim().toLowerCase() === normalized)
      ?.logoUrl;
  };

  const homeLogo = getTeamLogo(homeTeamName);
  const awayLogo = getTeamLogo(awayTeamName);

  const location =
    homeTeamName === teamConfig.name ? teamConfig.team_stadium : match.location;

  const existingLineup = match.Lineups;
  
  //ordernar por posição (Guarda-Redes, Defesas, Médios, Avançados)
  const sortedLineup = existingLineup?.slice().sort((a, b) => {
    const playerA = players.find((p) => String(p.id) === String(a.playerId));
    const playerB = players.find((p) => String(p.id) === String(b.playerId));
    const posA = playerA ? mapToMainPosition(playerA.stats?.position) : "N/A";
    const posB = playerB ? mapToMainPosition(playerB.stats?.position) : "N/A";
    const orderA = posA === "Guarda Redes" ? 1 : posA === "Defesa" ? 2 : posA === "Médio" ? 3 : posA === "Avançado" ? 4 : 5;
    const orderB = posB === "Guarda Redes" ? 1 : posB === "Defesa" ? 2 : posB === "Médio" ? 3 : posB === "Avançado" ? 4 : 5;
    return orderA - orderB;
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do jogo</Text>

        <View style={styles.statusContainer}>
          {match.status === "live" && <LiveBadge interval={match.statusTime === "interval"} />}
          {match.status === "upcoming" && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.badgeText}>Agendado</Text>
            </View>
          )}
          {match.status === "finished" && (
            <View style={styles.fulltimeBadge}>
              <Text style={styles.badgeText}>Terminado</Text>
            </View>
          )}
        </View>

        {/* Score */}
        <View style={styles.scoreCard}>
          {/* Home */}
          <View style={styles.teamContainer}>
            <View style={styles.teamLogo}>
              {homeLogo ? (
                <Image
                  source={{ uri: homeLogo }}
                  style={{ width: 50, height: 50 }}
                />
              ) : (
                <Text>🏆</Text>
              )}
            </View>
            <Text style={styles.teamName}>{homeTeamName}</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text
              style={[
                styles.scoreText,
                { color: COLORS.textPrimary },
              ]}
            >
               {(match.result?.split("-")[0])}
            </Text>
            <Text style={styles.colon}>:</Text>
            <Text
              style={[
                styles.scoreText,
                { color: COLORS.textPrimary },
              ]}
            >
              {(match.result?.split("-")[1])}
            </Text>
          </View>

          {/* Away */}
          <View style={styles.teamContainer}>
            <View style={styles.teamLogo}>
              {awayLogo ? (
                <Image
                  source={{ uri: awayLogo }}
                  style={{ width: 50, height: 50 }}
                />
              ) : (
                <Text>🏆</Text>
              )}
            </View>
            <Text style={styles.teamName}>{awayTeamName}</Text>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.matchInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>
              {formatDateWithWeekdayPT(match.date)} • {match.time}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoText}>{location}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
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
                  activeTab === tab.key && { color: COLORS.primary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
          <View style={styles.tabContent}>
            {activeTab === "timeline" && (
              match.events && match.events.length > 0 ? (
                match.events.slice().reverse().map((event: any) => (
                  <View key={event.id} style={styles.eventCard}>
                    <View style={styles.eventMinute}>
                      <Text style={styles.eventMinuteText}>{event.minute}'</Text>
                    </View>
                    <View style={styles.eventInfo}>
                      <View style={styles.eventTypeRow}>
                        {event.type === "goal" && (
                          <MaterialCommunityIcons name="target" size={16} color={COLORS.success} />
                        )}
                        {event.type === "yellow_card" && (
                          <View style={[styles.cardIcon, { backgroundColor: "#FFD700" }]} />
                        )}
                        {event.type === "red_card" && (
                          <View style={[styles.cardIcon, { backgroundColor: COLORS.error }]} />
                        )}
                        <Text style={styles.eventTypeText}>{event.type.replace("_", " ")}</Text>
                      </View>
                      <Text style={styles.eventPlayer}>{event.player}</Text>
                      {event.description && (
                        <Text style={styles.eventDescription}>{event.description}</Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="hourglass-half" size={36} color={COLORS.textSecondary} />
                  <Text style={styles.mutedText}>Sem eventos ainda</Text>
                </View>
              )
            )}
            {activeTab === "lineup" && (
            <>
              {sortedLineup && sortedLineup.length > 0 ? (
                <>
                  {/* Titulares */}
                  <Text style={styles.lineupSectionTitle}>Titulares</Text>
                  {sortedLineup
                    .filter((e: any) => e.isStarting)
                    .map((e: any) => {
                      const player = players.find((p) => String(p.id) === String(e.playerId));
                      if (!player) return null;
                      return (
                        <View key={String(e.playerId)} style={styles.lineupRow}>
                          {player.photoUrl ? (
                            <Image source={{ uri: player.photoUrl }} style={styles.lineupPhoto} resizeMode="contain" />
                          ) : (
                            <View style={styles.lineupAvatar}>
                              <Text style={styles.lineupAvatarText}>
                                {player.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <Text style={styles.lineupName}>{player.name}</Text>
                          <Text style={styles.lineupPosition}>{player.stats?.position}</Text>
                        </View>
                      );
                    })}

                  {/* Suplentes */}
                  <Text style={styles.lineupSectionTitle}>Suplentes</Text>
                  {sortedLineup
                    .filter((e: any) => !e.isStarting)
                    .map((e: any) => {
                      const player = players.find((p) => String(p.id) === String(e.playerId));
                      if (!player) return null;
                      return (
                        <View key={String(e.playerId)} style={styles.lineupRow}>
                          {player.photoUrl ? (
                            <Image source={{ uri: player.photoUrl }} style={styles.lineupPhoto} resizeMode="contain"/>
                          ) : (
                            <View style={styles.lineupAvatar}>
                              <Text style={styles.lineupAvatarText}>
                                {player.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <Text style={styles.lineupName}>{player.name}</Text>
                          <Text style={styles.lineupPosition}>{player.stats?.position}</Text>
                        </View>
                      );
                    })}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="hourglass-half" size={36} color={COLORS.textSecondary} />
                  <Text style={styles.mutedText}>Formação não disponível</Text>
                </View>
              )}
            </>
          )}
          </View>
      </View>
    </ScrollView>
  );
};
