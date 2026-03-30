import React, { useMemo, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LiveBadge } from "../../../components/LiveBadge";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../MatchDetails/MatchDetail.styles";
import { useMatches } from "../../../contexts/MatchesContext";
import { useTeams } from "../../../contexts/TeamsContext";
import { formatDateWithWeekdayPT } from "../../../utils/dateUtils";
import { teamConfig } from "../../../config/teamConfig";
import { adminStyles } from "./AdminMatchDetail.styles";
import { COLORS } from "../../../theme/colors";
import { LocationModal } from "./Components/LocationModal";
import { DateTimePickerModal } from "./Components/DateTimePickerModal";
import { AddLineupModal } from "./Components/AddLineupModal";
import { AddEventModal } from "./Components/AddEventModal";
import { usePlayers } from "../../../contexts/PlayersContext";
import { mapToMainPosition } from "../../../utils/playerPositionUtils";
import { PlayerWithStats } from "../../../models/Player";
import { createEventFromForm } from "../../../utils/events";
import { EventForm } from "../../../utils/events";
import { EventRow } from "../../../components/EventRow";

export const AdminMatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };
  const {
    matches,
    addMatchEvent,
    updateMatch,
    startMatch,
    finishMatch,
  } = useMatches();
  const { teams } = useTeams();
  const { getActivePlayers } = usePlayers();

  const players = getActivePlayers();
  const match = useMemo(() => matches.find((m) => m.id === id), [matches, id]);

  const [activeTab, setActiveTab] = useState<"timeline" | "lineup">("timeline");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const tabs = useMemo(
    () => [
      { key: "timeline", label: "Sumário" },
      { key: "lineup", label: "Formação" },
    ],
    [],
  );

  const getTeamLogo = useCallback(
    (teamName: string) => {
      const normalized = teamName.trim().toLowerCase();
      return teams.find((t) => t.name.trim().toLowerCase() === normalized)?.logoUrl;
    },
    [teams],
  );

  const handleSaveEvent = useCallback(
    async (event: EventForm) => {
      if (!match) return;

      const newEvent = createEventFromForm(event);

      await addMatchEvent(match.id, newEvent);
    },
    [match, addMatchEvent]
  );

  const handleSaveDateTime = useCallback(
    async (date: string, time: string) => {
      if (!match) return;
      await updateMatch(match.id, { date, time });
    },
    [match, updateMatch],
  );

  const handleSaveLocation = useCallback(
    async (location: string) => {
      if (!match) return;
      await updateMatch(match.id, { location });
    },
    [match, updateMatch],
  );

  const handleFinishMatch = useCallback(() => {
    if (!match) return;
    Alert.alert(
      "Terminar jogo",
      "Tens a certeza que queres terminar o jogo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Terminar", style: "destructive", onPress: () => finishMatch(match.id) },
      ]
    );
  }, [match, finishMatch]);

  if (!match) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.mutedText}>Jogo não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.primaryText, { marginTop: 8 }]}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const homeTeamName = match.homeOrAway === "C" ? match.teamName : match.opponent;
  const awayTeamName = match.homeOrAway === "F" ? match.teamName : match.opponent;
  const homeLogo = getTeamLogo(homeTeamName);
  const awayLogo = getTeamLogo(awayTeamName);
  const location = homeTeamName === teamConfig.name ? teamConfig.team_stadium : match.location;

  // Formação existente para pré-selecionar no modal
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

  const startingPlayers = useMemo(() => {
    if (!sortedLineup || sortedLineup.length === 0) 
      return players.slice().sort((a, b) => a.name.localeCompare(b.name));

    return sortedLineup
      .filter((l) => l.isStarting)
      .map((l) => players.find((p) => p.id === l.playerId))
      .filter((p): p is PlayerWithStats => p !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sortedLineup, players]);

  const substitutePlayers = useMemo(() => {
    if (!sortedLineup || sortedLineup.length === 0) return [];

    return sortedLineup
      .filter((l) => !l.isStarting)
      .map((l) => players.find((p) => p.id === l.playerId))
      .filter((p): p is PlayerWithStats => p !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sortedLineup, players]);

  const isLive = match.status === "live";
  const isHalftime = match.status === "halftime";
  const isUpcoming = match.status === "upcoming";
  const canEditDateTime = isLive || isUpcoming;

  const gameIsToday = useMemo(() => {
    const today = new Date();
    const matchDate = new Date(match.date);
    return (today.getFullYear() === matchDate.getFullYear() &&
      today.getMonth() === matchDate.getMonth() &&
      today.getDate() === matchDate.getDate());
  }, [match.date]);

  const isHomeGame = useMemo(() => match.homeOrAway === "C", [match.homeOrAway]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do jogo</Text>
          <View style={styles.statusContainer}>
            {isLive && <LiveBadge interval={match.statusTime === "interval"} />}
            {isHalftime && (
              <View >
                <Text >Intervalo</Text>
              </View>
            )}
          </View>

          {/* Score */}
          <View style={styles.scoreCard}>
            <View style={styles.teamContainer}>
              <View style={styles.teamLogo}>
                {homeLogo ? (
                  <Image source={{ uri: homeLogo }} style={{ width: 50, height: 50 }} />
                ) : <Text>🏆</Text>}
              </View>
              <Text style={styles.teamName}>{homeTeamName}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: COLORS.textPrimary }]}>
                {match.result?.split("-")[0]}
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text style={[styles.scoreText, { color: COLORS.textPrimary }]}>
                {match.result?.split("-")[1]}
              </Text>
            </View>
            <View style={styles.teamContainer}>
              <View style={styles.teamLogo}>
                {awayLogo ? (
                  <Image source={{ uri: awayLogo }} style={{ width: 50, height: 50 }} />
                ) : <Text>🏆</Text>}
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
              {canEditDateTime && (
                <TouchableOpacity onPress={() => setShowDateModal(true)}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{location}</Text>
              {canEditDateTime && (
                <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Controlo — upcoming */}
          {isUpcoming && gameIsToday && (
          <View style={adminStyles.adminActions}>
            <TouchableOpacity
              style={[adminStyles.adminBtn, adminStyles.adminBtn]}
              onPress={() => updateMatch(match.id, { result: "0-0", status: "live", statusTime: "1st" })}
            >
              <Ionicons name="play-circle-outline" size={16} color={COLORS.primary} />
              <Text style={[adminStyles.adminBtnText]}>Começar jogo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={adminStyles.adminBtn} onPress={() => setShowLineupModal(true)}>
              <Ionicons name="people-outline" size={16} color={COLORS.primary} />
              <Text style={adminStyles.adminBtnText}>Formação</Text>
            </TouchableOpacity>
          </View>
        )}
        {isLive && (
          <View style={adminStyles.adminActions}>
            <TouchableOpacity style={adminStyles.adminBtn} onPress={() => setShowEventModal(true)}>
              <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} />
              <Text style={adminStyles.adminBtnText}>Evento</Text>
            </TouchableOpacity>  
            <TouchableOpacity style={adminStyles.adminBtn} onPress={() => setShowLineupModal(true)}>
              <Ionicons name="people-outline" size={16} color={COLORS.primary} />
              <Text style={adminStyles.adminBtnText}>Formação</Text>
            </TouchableOpacity>
            {match.statusTime === "1st" && (
              <TouchableOpacity
                style={adminStyles.adminBtn}
                onPress={() => updateMatch(match.id, { statusTime: "interval" })}
              >
                <Ionicons name="pause-circle-outline" size={16} color={COLORS.warning} />
                <Text style={[adminStyles.adminBtnText, { color: COLORS.warning }]}>Intervalo</Text>
              </TouchableOpacity>
            )}

            {match.statusTime === "interval" && (
              <TouchableOpacity
                style={[adminStyles.adminBtn]}
                onPress={() => updateMatch(match.id, { statusTime: "2nd" })}
              >
                <Ionicons name="play-circle-outline" size={16} color={COLORS.warning} />
                <Text style={[adminStyles.adminBtnText, { color: COLORS.warning }]}>Recomeçar</Text>
              </TouchableOpacity>
            )}

            {match.statusTime === "2nd" && (
            <TouchableOpacity style={adminStyles.adminBtn} onPress={handleFinishMatch}>
              <Ionicons name="stop-circle-outline" size={16} color={COLORS.error} />
              <Text style={[adminStyles.adminBtnText, { color: COLORS.error }]}>Terminar</Text>
            </TouchableOpacity>
             )}
          </View>
        )}

          {/* Controlo — halftime */}
          {isHalftime && (
            <View style={adminStyles.adminActions}>
              <TouchableOpacity
                style={[adminStyles.adminBtn, adminStyles.adminBtn]}
                onPress={() => startMatch(match.id)}
              >
                <Ionicons name="play-circle-outline" size={16} color="#fff" />
                <Text style={[adminStyles.adminBtnText, { color: "#fff" }]}>Recomeçar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={adminStyles.adminBtn} onPress={handleFinishMatch}>
                <Ionicons name="stop-circle-outline" size={16} color={COLORS.error} />
                <Text style={[adminStyles.adminBtnText, { color: COLORS.error }]}>Terminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsList}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                style={[styles.tabTrigger, activeTab === tab.key && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab.key && { color: COLORS.primary }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tabContent}>
            <View style={styles.tabContent}>
              {activeTab === "timeline" && (
                match.events && match.events.length > 0 ? (() => {
                  // @ts-ignore comment
                  const sorted = [...match.events].sort((a, b) => a.minute - b.minute);
                  // @ts-ignore comment
                  const firstHalf  = sorted.filter(e => e.minute <= 45);
                  // @ts-ignore comment
                  const secondHalf = sorted.filter(e => e.minute > 45);
            
                  const scoreAt = (events: any[]) => {
                    return "";
                  };
            
                  return (
                    <>
                      {firstHalf.length > 0 && (
                        <>
                          <View style={styles.halfHeader}>
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
                          <View style={[styles.halfHeader, { marginTop: 4 }]}>
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
                    </>
                  );
                })() : (
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
                  <Text style={adminStyles.lineupSectionTitle}>Titulares</Text>
                  {sortedLineup
                    .filter((e: any) => e.isStarting)
                    .map((e: any) => {
                      const player = players.find((p) => String(p.id) === String(e.playerId));
                      if (!player) return null;
                      return (
                        <View key={String(e.playerId)} style={adminStyles.lineupRow}>
                          {player.photoUrl ? (
                            <Image source={{ uri: player.photoUrl }} style={adminStyles.lineupPhoto} />
                          ) : (
                            <View style={adminStyles.lineupAvatar}>
                              <Text style={adminStyles.lineupAvatarText}>
                                {player.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <Text style={adminStyles.lineupName}>{player.name}</Text>
                          <Text style={adminStyles.lineupPosition}>{player.stats?.position}</Text>
                        </View>
                      );
                    })}

                  {/* Suplentes */}
                  <Text style={adminStyles.lineupSectionTitle}>Suplentes</Text>
                  {sortedLineup
                    .filter((e: any) => !e.isStarting)
                    .map((e: any) => {
                      const player = players.find((p) => String(p.id) === String(e.playerId));
                      if (!player) return null;
                      return (
                        <View key={String(e.playerId)} style={adminStyles.lineupRow}>
                          {player.photoUrl ? (
                            <Image source={{ uri: player.photoUrl }} style={adminStyles.lineupPhoto} />
                          ) : (
                            <View style={adminStyles.lineupAvatar}>
                              <Text style={adminStyles.lineupAvatarText}>
                                {player.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <Text style={adminStyles.lineupName}>{player.name}</Text>
                          <Text style={adminStyles.lineupPosition}>{player.stats?.position}</Text>
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
        </View>
      </ScrollView>

      <AddEventModal
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        startingPlayers={startingPlayers}
        substitutePlayers={substitutePlayers}
      />
      <AddLineupModal
        visible={showLineupModal}
        matchId={match.id}
        onClose={() => setShowLineupModal(false)}
        existingLineup={existingLineup}
      />
      <DateTimePickerModal
        visible={showDateModal}
        initialDate={match.date ?? ""}
        initialTime={match.time ?? ""}
        onClose={() => setShowDateModal(false)}
        onSave={handleSaveDateTime}
      />
      <LocationModal
        visible={showLocationModal}
        initialValue={match.location ?? ""}
        onClose={() => setShowLocationModal(false)}
        onSave={handleSaveLocation}
      />
    </>
  );
};