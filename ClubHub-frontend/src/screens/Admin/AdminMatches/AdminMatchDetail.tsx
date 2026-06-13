import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LiveBadge } from "../../../components/LiveBadge";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../MatchDetails/MatchDetail.styles";
import { useMatches } from "../../../hooks/useMatches";
import { useTeams } from "../../../hooks/useTeams";
import {
  formatDateWithWeekdayPT,
  getPenaltyDisplayScore,
} from "../../../utils/dateUtils";
import { adminStyles } from "./AdminMatchDetail.styles";
import { COLORS } from "../../../theme/colors";
import { LocationModal } from "./Components/LocationModal";
import { DateTimePickerModal } from "./Components/DateTimePickerModal";
import { AddLineupModal } from "./Components/AddLineupModal";

import { AddEventModal } from "./Components/AddEventModal";

import { usePlayers } from "../../../hooks/usePlayers";
import { isFieldPlayer } from "../../../utils/playerPositionUtils";
import { Player } from "../../../models/Player";
import { EventRow } from "../../../components/EventRow";
import { useCompetitions } from "../../../hooks/useCompetitions";
import { Competition } from "../../../models/Competition";
import { MatchEventService } from "../../../services/MatchEventService";
import { MatchEvent } from "../../../models/MatchEvent";
import { getPositionOrder } from "../../../utils/playerPositionUtils";
import { useAuth } from "../../../contexts/AuthContext";

export const AdminMatchDetail = () => {
  const route = useRoute();
  const { isAdmin, adminMode } = useAuth();
  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Acesso negado</Text>
      </View>
    );
  }
  const navigation = useNavigation();
  const { id } = route.params as { id: number };
  const {
    matches,
    refreshMatches,
    addMatchEvent,
    updateMatch,
    deleteMatchEvent,
    startMatch,
    finishMatch,
  } = useMatches();
  const { teams, refreshTeams } = useTeams();
  const { getActivePlayers, refreshPlayers } = usePlayers();

  const players = useMemo(() => {
    return getActivePlayers().filter(isFieldPlayer);
  }, [getActivePlayers, refreshPlayers]);

  const playersMap = useMemo(() => {
    const map = new Map<number, Player>();
    for (const p of players) {
      map.set(p.id, p);
    }
    return map;
  }, [players]);
  const match = useMemo(() => matches.find((m) => m.id === id), [matches, id]);

  if (!match) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Jogo não encontrado</Text>
      </View>
    );
  }

  const { competitions, refreshCompetitions } = useCompetitions();

  const [activeTab, setActiveTab] = useState<"timeline" | "lineup">("timeline");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

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
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshCompetitions, refreshTeams, refreshPlayers]);

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
      return teams.find((t) => t.name.trim().toLowerCase() === normalized)
        ?.logoUrl;
    },
    [teams],
  );

  const handleSaveEvent = async (form: MatchEvent) => {
    if (!match) return;

    try {
      if (editingEvent && editingEvent.id) {
        // EDIT: chamar API de update do evento
        await MatchEventService.update(editingEvent.id, form);
        // Força refresh para reflectir a mudança (Redis já foi invalidado no backend)
        await refreshMatches();
      } else {
        // CREATE: adicionar na BD
        await addMatchEvent(match.id, form);
      }

      setEditingEvent(null);
      setShowEventModal(false);
    } catch (err) {
      console.error("Erro a guardar evento:", err);
    }
  };

  const handleDeleteEvent = useCallback(
    async (event: MatchEvent) => {
      if (!match) return;
      Alert.alert(
        "Apagar evento",
        "Tens a certeza que queres apagar este evento?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Apagar",
            style: "destructive",
            onPress: async () => {
              deleteMatchEvent(match.id, event);
            },
          },
        ],
      );
    },
    [match, deleteMatchEvent],
  );

  const [editingEvent, setEditingEvent] = useState<MatchEvent | null>(null);

  const handleEditEvent = useCallback((event: MatchEvent) => {
    setEditingEvent(event);
    setShowEventModal(true);
  }, []);

  const handleSaveDateTime = useCallback(
    async (date: string, time: string) => {
      await updateMatch({
        id: match.id,
        data: { date, time },
      });
    },
    [match.id, updateMatch],
  );

  const handleSaveLocation = useCallback(
    async (location: string) => {
      updateMatch({
        id: match.id,
        data: { location },
      });
    },
    [match.id, updateMatch],
  );

  const handleFinishMatch = useCallback(() => {
    if (!match) return;

    const isPenaltyDecided = match.statusTime === "penalties";

    if (isPenaltyDecided) {
      // Quando o jogo vai a penáltis, perguntar quem venceu
      Alert.alert(
        "Terminar jogo - Penáltis",
        "Quem venceu a série de penáltis?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: match.teamName,
            onPress: () => finishMatch(match.id, "V", true),
          },
          {
            text: match.opponent,
            onPress: () => finishMatch(match.id, "D", true),
          },
        ],
      );
      return;
    }

    const outcome = match.result
      ? match.result.split("-")[0] === match.result.split("-")[1]
        ? "E"
        : match.homeOrAway === "C"
          ? match.result.split("-")[0] > match.result.split("-")[1]
            ? "V"
            : "D"
          : match.result.split("-")[1] > match.result.split("-")[0]
            ? "V"
            : "D"
      : "D";

    Alert.alert("Terminar jogo", "Tens a certeza que queres terminar o jogo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Terminar",
        style: "destructive",
        onPress: () => finishMatch(match.id, outcome, false),
      },
    ]);
  }, [match, finishMatch]);

  if (!match) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.mutedText}>Jogo não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.primaryText, { marginTop: 8 }]}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const homeTeamName =
    match.homeOrAway === "C" ? match.teamName : match.opponent;
  const awayTeamName =
    match.homeOrAway === "F" ? match.teamName : match.opponent;
  const homeLogo = getTeamLogo(homeTeamName);
  const awayLogo = getTeamLogo(awayTeamName);
  const location = match.location;

  // Formação existente para pré-selecionar no modal
  const existingLineup = match.Lineups;

  //ordernar por posição (Guarda-Redes, Defesas, Médios, Avançados)
  const sortedLineup = useMemo(() => {
    if (!match.Lineups) return [];

    return [...match.Lineups].sort((a, b) => {
      const aPos = playersMap.get(a.playerId)?.Stats?.[0]?.position || "";
      const bPos = playersMap.get(b.playerId)?.Stats?.[0]?.position || "";

      const orderA = getPositionOrder(aPos);
      const orderB = getPositionOrder(bPos);

      if (orderA !== orderB) return orderA - orderB;

      // opcional: desempate (ex: nome)
      const aName = playersMap.get(a.playerId)?.name || "";
      const bName = playersMap.get(b.playerId)?.name || "";

      return aName.localeCompare(bName);
    });
  }, [match.Lineups, playersMap]);

  const playerById = useMemo(() => {
    const map = new Map<number, Player>();
    for (const p of players) map.set(p.id, p);
    return map;
  }, [players]);

  const buildPlayersFromLineup = useCallback(
    (isStarting: boolean) => {
      if (!sortedLineup || sortedLineup.length === 0) {
        return [...players].sort((a, b) => a.name.localeCompare(b.name));
      }

      const result: Player[] = [];

      for (const l of sortedLineup) {
        if (l.isStarting !== isStarting) continue;

        const player = playersMap.get(l.playerId);
        if (player) result.push(player);
      }

      return result.sort((a, b) => a.name.localeCompare(b.name));
    },
    [sortedLineup, playersMap, players],
  );

  const startingPlayers = useMemo(
    () => buildPlayersFromLineup(true),
    [buildPlayersFromLineup],
  );

  const substitutePlayers = useMemo(
    () => buildPlayersFromLineup(false),
    [buildPlayersFromLineup],
  );

  const isLive = match.status === "live";
  const isHalftime = match.status === "halftime";
  const isUpcoming = match.status === "upcoming";
  const isFinished = match.status === "finished";
  const canEditDateTime = isLive || isUpcoming || isFinished;

  const gameIsToday = useMemo(() => {
    const today = new Date();
    const matchDate = new Date(match.date);
    return (
      today.getFullYear() === matchDate.getFullYear() &&
      today.getMonth() === matchDate.getMonth() &&
      today.getDate() === matchDate.getDate()
    );
  }, [match.date]);

  const isHomeGame = useMemo(
    () => match.homeOrAway === "C",
    [match.homeOrAway],
  );

  const competition = useMemo(() => {
    return competitions.find(
      (c) => c.id === match.competitionId,
    ) as Competition;
  }, [match.competitionId, competitions]);

  const penaltyDisplay = useMemo(
    () =>
      getPenaltyDisplayScore(
        match.result,
        match.outcome,
        match.homeOrAway,
        match.decidedByPenalties,
      ),
    [match.result, match.outcome, match.homeOrAway, match.decidedByPenalties],
  );

  const homeScoreDisplay = penaltyDisplay
    ? penaltyDisplay[0]
    : match.result?.split("-")[0];
  const awayScoreDisplay = penaltyDisplay
    ? penaltyDisplay[1]
    : match.result?.split("-")[1];

  const timeline = useMemo(() => {
    const events = match.events;
    if (!events?.length) return null;

    const firstHalf: MatchEvent[] = [];
    const secondHalf: MatchEvent[] = [];
    const extra: MatchEvent[] = [];
    const penalties: MatchEvent[] = [];

    for (const e of events) {
      if (e.type === "penalty_shootout") {
        penalties.push(e);
      } else if (e.phase === "extra") {
        extra.push(e);
      } else if (e.phase === "2nd" || (!e.phase && e.minute > 45)) {
        secondHalf.push(e);
      } else {
        firstHalf.push(e);
      }
    }

    const byMinute = (a: MatchEvent, b: MatchEvent) => {
      if (a.minute !== b.minute) return a.minute - b.minute;
      // @ts-ignore
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    };

    firstHalf.sort(byMinute);
    secondHalf.sort(byMinute);
    extra.sort(byMinute);
    penalties.sort(byMinute);
    return { firstHalf, secondHalf, extra, penalties };
  }, [match.events]);

  const handleStartMatch = useCallback(() => {
    if (!match) return;

    Alert.alert("Começar jogo", "Tens a certeza que queres iniciar o jogo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Começar",
        onPress: async () => {
          await updateMatch({
            id: match.id,
            data: {
              result: "0-0",
              status: "live",
              statusTime: "1st",
            },
          });
        },
      },
    ]);
  }, [match, updateMatch]);

  const handleHalftime = useCallback(() => {
    if (!match) return;

    Alert.alert("Intervalo", "Queres marcar o jogo como intervalo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          await updateMatch({
            id: match.id,
            data: { statusTime: "interval" },
          });
        },
      },
    ]);
  }, [match, updateMatch]);

  const handleSecondHalf = useCallback(() => {
    if (!match) return;

    Alert.alert("Recomeçar jogo", "Iniciar a segunda parte?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Recomeçar",
        onPress: async () => {
          await updateMatch({
            id: match.id,
            data: { statusTime: "2nd" },
          });
        },
      },
    ]);
  }, [match, updateMatch]);

  const handleExtraTime = useCallback(() => {
    if (!match) return;
    Alert.alert("Prolongamento", "Iniciar prolongamento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          await updateMatch({ id: match.id, data: { statusTime: "extra" } });
        },
      },
    ]);
  }, [match, updateMatch]);

  const handlePenalties = useCallback(() => {
    if (!match) return;
    Alert.alert("Penaltis", "Iniciar série de penaltis?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          await updateMatch({
            id: match.id,
            data: { statusTime: "penalties" },
          });
        },
      },
    ]);
  }, [match, updateMatch]);
  return (
    <>
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do jogo</Text>
          <View style={styles.statusContainer}>
            {match.status === "live" && (
              <LiveBadge interval={match.statusTime === "interval"} />
            )}
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
          <Text style={styles.competition}>
            {competition?.name || ""} {match.round ? `- ${match.round}` : ""}
          </Text>
          {/* Score */}
          <View style={styles.scoreCard}>
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
            <View style={{ alignItems: "center", marginTop: 8 }}>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: COLORS.textPrimary }]}>
                  {homeScoreDisplay}
                </Text>
                <Text style={styles.colon}>:</Text>
                <Text style={[styles.scoreText, { color: COLORS.textPrimary }]}>
                  {awayScoreDisplay}
                </Text>
              </View>
              {match.decidedByPenalties && (
                <Text
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 2,
                  }}
                >
                  após g.p.
                </Text>
              )}
            </View>
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
              {canEditDateTime && (
                <TouchableOpacity onPress={() => setShowDateModal(true)}>
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.textPrimary}
              />
              <Text style={styles.infoText}>{location}</Text>
              {canEditDateTime && (
                <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Controlo - upcoming */}
          {isUpcoming && gameIsToday && (
            <View style={adminStyles.adminActions}>
              <TouchableOpacity
                style={[adminStyles.adminBtn, adminStyles.adminBtn]}
                onPress={handleStartMatch}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={[adminStyles.adminBtnText]}>Começar jogo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={adminStyles.adminBtn}
                onPress={() => setShowLineupModal(true)}
              >
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={adminStyles.adminBtnText}>Formação</Text>
              </TouchableOpacity>
            </View>
          )}
          {isLive && (
            <View style={adminStyles.adminActions}>
              <TouchableOpacity
                style={adminStyles.adminBtn}
                onPress={() => setShowEventModal(true)}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={adminStyles.adminBtnText}>Evento</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={adminStyles.adminBtn}
                onPress={() => setShowLineupModal(true)}
              >
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={adminStyles.adminBtnText}>Formação</Text>
              </TouchableOpacity>
              {match.statusTime === "1st" && (
                <TouchableOpacity
                  style={adminStyles.adminBtn}
                  onPress={handleHalftime}
                >
                  <Ionicons
                    name="pause-circle-outline"
                    size={16}
                    color={COLORS.warning}
                  />
                  <Text
                    style={[
                      adminStyles.adminBtnText,
                      { color: COLORS.warning },
                    ]}
                  >
                    Intervalo
                  </Text>
                </TouchableOpacity>
              )}

              {match.statusTime === "interval" && (
                <TouchableOpacity
                  style={[adminStyles.adminBtn]}
                  onPress={handleSecondHalf}
                >
                  <Ionicons
                    name="play-circle-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text
                    style={[
                      adminStyles.adminBtnText,
                      { color: COLORS.primary },
                    ]}
                  >
                    Recomeçar
                  </Text>
                </TouchableOpacity>
              )}

              {match.statusTime === "2nd" && (
                <>
                  <TouchableOpacity
                    style={adminStyles.adminBtn}
                    onPress={handleExtraTime}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={COLORS.warning}
                    />
                    <Text
                      style={[
                        adminStyles.adminBtnText,
                        { color: COLORS.warning },
                      ]}
                    >
                      Prolongamento
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={adminStyles.adminBtn}
                    onPress={handleFinishMatch}
                  >
                    <Ionicons
                      name="stop-circle-outline"
                      size={16}
                      color={COLORS.error}
                    />
                    <Text
                      style={[
                        adminStyles.adminBtnText,
                        { color: COLORS.error },
                      ]}
                    >
                      Terminar
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {match.statusTime === "extra" && (
                <>
                  <TouchableOpacity
                    style={adminStyles.adminBtn}
                    onPress={handlePenalties}
                  >
                    <Ionicons
                      name="football-outline"
                      size={16}
                      color={COLORS.warning}
                    />
                    <Text
                      style={[
                        adminStyles.adminBtnText,
                        { color: COLORS.warning },
                      ]}
                    >
                      Penaltis
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={adminStyles.adminBtn}
                    onPress={handleFinishMatch}
                  >
                    <Ionicons
                      name="stop-circle-outline"
                      size={16}
                      color={COLORS.error}
                    />
                    <Text
                      style={[
                        adminStyles.adminBtnText,
                        { color: COLORS.error },
                      ]}
                    >
                      Terminar
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {match.statusTime === "penalties" && (
                <TouchableOpacity
                  style={adminStyles.adminBtn}
                  onPress={handleFinishMatch}
                >
                  <Ionicons
                    name="stop-circle-outline"
                    size={16}
                    color={COLORS.error}
                  />
                  <Text
                    style={[adminStyles.adminBtnText, { color: COLORS.error }]}
                  >
                    Terminar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Controlo - halftime */}
          {isHalftime && (
            <View style={adminStyles.adminActions}>
              <TouchableOpacity
                style={[adminStyles.adminBtn, adminStyles.adminBtn]}
                onPress={() => startMatch(match.id)}
              >
                <Ionicons name="play-circle-outline" size={16} color="#fff" />
                <Text style={[adminStyles.adminBtnText, { color: "#fff" }]}>
                  Recomeçar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={adminStyles.adminBtn}
                onPress={handleFinishMatch}
              >
                <Ionicons
                  name="stop-circle-outline"
                  size={16}
                  color={COLORS.error}
                />
                <Text
                  style={[adminStyles.adminBtnText, { color: COLORS.error }]}
                >
                  Terminar
                </Text>
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
          <View style={styles.tabContent}>
            {activeTab === "timeline" &&
              (match.events && match.events.length > 0 ? (
                (() => {
                  const firstHalf = timeline?.firstHalf || [];
                  const secondHalf = timeline?.secondHalf || [];
                  const extraTime = timeline?.extra || [];
                  const penaltyShootout = timeline?.penalties || [];
                  return (
                    <>
                      {firstHalf.length > 0 && (
                        <>
                          <View style={styles.halfHeader}>
                            <Text style={styles.halfHeaderText}>1ª Parte</Text>
                          </View>
                          {firstHalf.map((event: MatchEvent) => (
                            <EventRow
                              key={event.id}
                              event={event}
                              isOurs={
                                isHomeGame
                                  ? !event.isOpponent
                                  : event.isOpponent
                              }
                              onEdit={handleEditEvent}
                              onDelete={() => handleDeleteEvent(event)}
                              adminMode={adminMode}
                            />
                          ))}
                        </>
                      )}
                      {secondHalf.length > 0 && (
                        <>
                          <View style={[styles.halfHeader, { marginTop: 4 }]}>
                            <Text style={styles.halfHeaderText}>2ª Parte</Text>
                          </View>
                          {secondHalf.map((event: MatchEvent) => (
                            <EventRow
                              key={event.id}
                              event={event}
                              isOurs={
                                isHomeGame
                                  ? !event.isOpponent
                                  : event.isOpponent
                              }
                              onEdit={handleEditEvent}
                              onDelete={() => handleDeleteEvent(event)}
                              adminMode={adminMode}
                            />
                          ))}
                        </>
                      )}
                      {extraTime.length > 0 && (
                        <>
                          <View style={[styles.halfHeader, { marginTop: 4 }]}>
                            <Text style={styles.halfHeaderText}>
                              Prolongamento
                            </Text>
                          </View>
                          {extraTime.map((event: MatchEvent) => (
                            <EventRow
                              key={event.id}
                              event={event}
                              isOurs={
                                isHomeGame
                                  ? !event.isOpponent
                                  : event.isOpponent
                              }
                              onEdit={handleEditEvent}
                              onDelete={() => handleDeleteEvent(event)}
                              adminMode={adminMode}
                            />
                          ))}
                        </>
                      )}
                      {penaltyShootout.length > 0 && (
                        <>
                          <View style={[styles.halfHeader, { marginTop: 4 }]}>
                            <Text style={styles.halfHeaderText}>Penaltis</Text>
                          </View>
                          {penaltyShootout.map((event: MatchEvent) => (
                            <EventRow
                              key={event.id}
                              event={event}
                              isOurs={
                                isHomeGame
                                  ? !event.isOpponent
                                  : event.isOpponent
                              }
                              onEdit={handleEditEvent}
                              onDelete={() => handleDeleteEvent(event)}
                              adminMode={adminMode}
                            />
                          ))}
                        </>
                      )}
                    </>
                  );
                })()
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
                {sortedLineup && sortedLineup.length > 0 ? (
                  <>
                    {/* Titulares */}
                    <Text style={adminStyles.lineupSectionTitle}>
                      Titulares
                    </Text>
                    {sortedLineup
                      .filter((e: any) => e.isStarting)
                      .map((e: any) => {
                        const player = playerById.get(e.playerId);
                        if (!player) return null;
                        return (
                          <View key={e.playerId} style={adminStyles.lineupRow}>
                            {player.photoUrl ? (
                              <Image
                                source={{ uri: player.photoUrl }}
                                style={adminStyles.lineupPhoto}
                              />
                            ) : (
                              <View style={adminStyles.lineupAvatar}>
                                <Text style={adminStyles.lineupAvatarText}>
                                  {player.name
                                    .split(" ")
                                    .map((w: string) => w[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                                </Text>
                              </View>
                            )}
                            <Text style={adminStyles.lineupName}>
                              {player.name}
                            </Text>
                            <Text style={adminStyles.lineupPosition}>
                              {player.Stats?.[0]?.position}
                            </Text>
                          </View>
                        );
                      })}

                    {/* Suplentes */}
                    <Text style={adminStyles.lineupSectionTitle}>
                      Suplentes
                    </Text>
                    {sortedLineup
                      .filter((e: any) => !e.isStarting)
                      .map((e: any) => {
                        const player = playerById.get(e.playerId);
                        if (!player) return null;
                        return (
                          <View key={e.playerId} style={adminStyles.lineupRow}>
                            {player.photoUrl ? (
                              <Image
                                source={{ uri: player.photoUrl }}
                                style={adminStyles.lineupPhoto}
                              />
                            ) : (
                              <View style={adminStyles.lineupAvatar}>
                                <Text style={adminStyles.lineupAvatarText}>
                                  {player.name
                                    .split(" ")
                                    .map((w: string) => w[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                                </Text>
                              </View>
                            )}
                            <Text style={adminStyles.lineupName}>
                              {player.name}
                            </Text>
                            <Text style={adminStyles.lineupPosition}>
                              {player.Stats?.[0]?.position}
                            </Text>
                          </View>
                        );
                      })}
                  </>
                ) : (
                  <View style={styles.emptyState}>
                    <FontAwesome5
                      name="hourglass-half"
                      size={36}
                      color={COLORS.textSecondary}
                    />
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

      <AddEventModal
        visible={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        startingPlayers={startingPlayers}
        substitutePlayers={substitutePlayers}
        eventToEdit={editingEvent || undefined}
        currentPhase={
          match.statusTime === "penalties"
            ? "penalties"
            : match.statusTime === "extra"
              ? "extra"
              : match.statusTime === "2nd"
                ? "2nd"
                : "1st"
        }
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
