import React, { useMemo, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { PlayerLineup } from "../../../components/PlayerLineup";
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
import { AddLineupModal, LineupEntry } from "./Components/AddLineupModal";
import { AddEventModal } from "./Components/AddEventModal";

type EventType = "goal" | "yellow_card" | "red_card" | "substitution";

interface EventForm {
  type: EventType;
  minute: string;
  player: string;
  description: string;
}

// ─── AdminMatchDetail ─────────────────────────────────────────────────────────

export const AdminMatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };
  const {
    matches,
    addMatchEvent,
    saveLineup,
    updateMatch,
    startMatch,
    pauseMatch,
    finishMatch,
    getLiveMinute,
  } = useMatches();
  const { teams } = useTeams();

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
    async (eventForm: EventForm) => {
      if (!match) return;
      await addMatchEvent(match.id, {
        ...eventForm,
        minute: Number(eventForm.minute),
        id: Date.now().toString(),
      });
    },
    [match, addMatchEvent],
  );

  // onSave agora recebe (matchId, LineupEntry[]) — delega no contexto/serviço
  const handleSaveLineup = useCallback(
    async (matchId: number | string, entries: LineupEntry[]) => {
      await saveLineup(matchId, entries);
    },
    [saveLineup],
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
  const existingLineup: LineupEntry[] = useMemo(
    () => match.lineup?.map((e: any) => ({
      playerId: e.playerId,
      isStarting: e.isStarting,
    })) ?? [],
    [match.lineup]
  );

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
              <View style={adminStyles.halftimeBadge}>
                <Text style={adminStyles.halftimeBadgeText}>Intervalo</Text>
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
                <TouchableOpacity style={adminStyles.inlineEditButton} onPress={() => setShowDateModal(true)}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{location}</Text>
              {canEditDateTime && (
                <TouchableOpacity style={adminStyles.inlineEditButton} onPress={() => setShowLocationModal(true)}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Controlo — upcoming */}
          {isUpcoming && gameIsToday && (
          <View style={adminStyles.adminActions}>
            <TouchableOpacity
              style={[adminStyles.adminBtn, adminStyles.adminBtnPrimary]}
              onPress={() => updateMatch(match.id, { result: "0-0", status: "live", statusTime: "1st" })}
            >
              <Ionicons name="play-circle-outline" size={16} color="#fff" />
              <Text style={[adminStyles.adminBtnText, { color: "#fff" }]}>Começar jogo</Text>
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
                style={[adminStyles.adminBtn, adminStyles.adminBtnPrimary]}
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
                {match.homeLineup && <PlayerLineup players={match.homeLineup} teamName={homeTeamName} />}
                {match.awayLineup && <PlayerLineup players={match.awayLineup} teamName={awayTeamName} />}
                {!match.homeLineup && !match.awayLineup && (
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

      <AddEventModal
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        players={[]}
      />
      <AddLineupModal
        visible={showLineupModal}
        matchId={match.id}
        onClose={() => setShowLineupModal(false)}
        onSave={handleSaveLineup}
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