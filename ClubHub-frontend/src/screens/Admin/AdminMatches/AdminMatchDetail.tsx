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
import {
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
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
import { mapToMainPosition, isFieldPlayer } from "../../../utils/playerPositionUtils";
import { PlayerWithStats } from "../../../models/Player";
import { EventRow } from "../../../components/EventRow";
import { useCompetitions } from "../../../contexts/CompetitionContext";
import { Competition } from "../../../models/Competition";
import { MatchEventService } from "../../../services/MatchEventService";
import { MatchEvent } from "../../../models/MatchEvent";

export const AdminMatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };
  const { matches, refreshMatches, addMatchEvent, updateMatch, updateLocalMatch, deleteMatchEvent,startMatch, finishMatch } =
    useMatches();
  const { teams, refreshTeams } = useTeams();
  const { getActivePlayers, refreshPlayers } = usePlayers();

  const players = useMemo(() => getActivePlayers().filter(isFieldPlayer), [getActivePlayers]);
  const match = useMemo(
    () => matches.find((m) => m.id === id),
    [matches, id],
  );

  if (!match) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Jogo não encontrado</Text>
      </View>
    );
  };

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
      await refreshMatches();
      await refreshCompetitions();
      await refreshTeams();
      await refreshPlayers();

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
        const updatedEvent = await MatchEventService.update(editingEvent.id, form);
        // Atualiza localmente no match
        const updatedEvents = (match.events || []).map((e: MatchEvent) =>
          e.id === editingEvent.id ? updatedEvent : e
        );
        await updateLocalMatch(match.id, {
          ...match,
          events: updatedEvents,
        });
        setEditingEvent(null);
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
        ]
      );
    },
    [match, deleteMatchEvent]
  );
  
  const [editingEvent, setEditingEvent] = useState<MatchEvent | null>(null);

  const handleEditEvent = (event: MatchEvent) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleSaveDateTime = useCallback(
    async (date: string, time: string) => {
      try {
        await updateMatch(match.id, { date, time });
      } catch (e) {
        console.error("Erro update date:", e);
      }
    },
    [match.id, updateMatch],
  );

  const handleSaveLocation = useCallback(
    async (location: string) => {
      try {
        await updateMatch(match.id, { location });
      } catch (e) {
        console.error("Erro update location:", e);
      }
    },
    [match.id, updateMatch],
  );

  const handleFinishMatch = useCallback(() => {
    if (!match) return;
    Alert.alert("Terminar jogo", "Tens a certeza que queres terminar o jogo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Terminar",
        style: "destructive",
        onPress: () => finishMatch(match.id),
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
  const location =
    homeTeamName === teamConfig.name ? teamConfig.team_stadium : match.location;

  // Formação existente para pré-selecionar no modal
  const existingLineup = match.Lineups;
    const playersMap = useMemo(() => {
    const map = new Map<string, PlayerWithStats>();

    players.forEach((p) => {
      map.set(String(p.id), p);
    });

    return map;
  }, [players]);

  //ordernar por posição (Guarda-Redes, Defesas, Médios, Avançados)
  const sortedLineup = useMemo(() => {
    if (!match.Lineups) return [];

    return [...match.Lineups].sort((a, b) => {
      const aP = playersMap.get(String(a.playerId));
      const bP = playersMap.get(String(b.playerId));

      const aPos = aP?.stats?.position ?? "";
      const bPos = bP?.stats?.position ?? "";

      return aPos.localeCompare(bPos);
    });
  }, [match.Lineups, playersMap]);

  const buildPlayersFromLineup = useCallback(
    (isStarting: boolean) => {
      if (!sortedLineup || sortedLineup.length === 0) {
        return [...players].sort((a, b) => a.name.localeCompare(b.name));
      }

      const result: PlayerWithStats[] = [];

      for (const l of sortedLineup) {
        if (l.isStarting !== isStarting) continue;

        const player = playersMap.get(String(l.playerId));
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
  const canEditDateTime = isLive || isUpcoming;

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

  const competition = useMemo(() => { return competitions.find((c) => c.id === match.competitionId) as Competition; }, [match.competitionId, competitions]);

  const timeline = useMemo(() => {
    if (!match.events?.length) return null;

    const sorted = [...match.events].sort((a, b) => a.minute - b.minute);

    return {
      firstHalf: sorted.filter((e) => e.minute <= 45),
      secondHalf: sorted.filter((e) => e.minute > 45),
    };
  }, [match.events]);

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
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do jogo</Text>
          <View style={styles.statusContainer}>
            {isLive && <LiveBadge interval={match.statusTime === "interval"} />}
            {isHalftime && (
              <View>
                <Text>Intervalo</Text>
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
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.infoText}>{location}</Text>
              {canEditDateTime && (
                <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Controlo — upcoming */}
          {isUpcoming && gameIsToday && (
            <View style={adminStyles.adminActions}>
              <TouchableOpacity
                style={[adminStyles.adminBtn, adminStyles.adminBtn]}
                onPress={() =>
                  updateMatch(match.id, {
                    result: "0-0",
                    status: "live",
                    statusTime: "1st",
                  })
                }
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
                  onPress={() =>
                    updateMatch(match.id, { statusTime: "interval" })
                  }
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
                  onPress={() => updateMatch(match.id, { statusTime: "2nd" })}
                >
                  <Ionicons
                    name="play-circle-outline"
                    size={16}
                    color={COLORS.warning}
                  />
                  <Text
                    style={[
                      adminStyles.adminBtnText,
                      { color: COLORS.warning },
                    ]}
                  >
                    Recomeçar
                  </Text>
                </TouchableOpacity>
              )}

              {match.statusTime === "2nd" && (
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

          {/* Controlo — halftime */}
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
            <View style={styles.tabContent}>
              {activeTab === "timeline" &&
                (match.events && match.events.length > 0 ? (
                  (() => {
                    const firstHalf = timeline?.firstHalf || [];
                    const secondHalf = timeline?.secondHalf || [];
                    return (
                      <>
                        {firstHalf.length > 0 && (
                          <>
                            <View style={styles.halfHeader}>
                              <Text style={styles.halfHeaderText}>
                                1ª Parte
                              </Text>
                            </View>
                            {firstHalf.map((event: MatchEvent) => (
                              <EventRow
                                key={event.id}
                                event={event}
                                isOurs={
                                  isHomeGame ? !event.isOpponent : event.isOpponent
                                }
                                onEdit={handleEditEvent}
                                onDelete={() => handleDeleteEvent(event)}
                              />
                            ))}
                          </>
                        )}
                        {secondHalf.length > 0 && (
                          <>
                            <View style={[styles.halfHeader, { marginTop: 4 }]}>
                              <Text style={styles.halfHeaderText}>
                                2ª Parte
                              </Text>
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
                          const player = players.find(
                            (p) => String(p.id) === String(e.playerId),
                          );
                          if (!player) return null;
                          return (
                            <View
                              key={String(e.playerId)}
                              style={adminStyles.lineupRow}
                            >
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
                                {player.stats?.position}
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
                          const player = players.find(
                            (p) => String(p.id) === String(e.playerId),
                          );
                          if (!player) return null;
                          return (
                            <View
                              key={String(e.playerId)}
                              style={adminStyles.lineupRow}
                            >
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
                                {player.stats?.position}
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
