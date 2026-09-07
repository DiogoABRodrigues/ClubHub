import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles/EventRow.syles";
import { COLORS } from "../theme/colors";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { usePlayers } from "../hooks/usePlayers";
import { MatchEvent } from "../models/MatchEvent";
import { formatMinute } from "../screens/Admin/AdminMatches/Components/AddEventModal";

interface Props {
  event: MatchEvent;
  isOurs: boolean;
  onEdit?: (event: MatchEvent) => void;
  onDelete?: (event: MatchEvent) => void;
  adminMode?: boolean;
}

const ICON: Record<string, string> = {
  goal: "⚽",
  substitution: "🔄",
  penalty_shootout: "",
};

const CardIcon = ({
  type,
  isSecondYellow,
  isOurs,
}: {
  type: string;
  isSecondYellow?: boolean;
  isOurs: boolean;
}) => (
  <View
    style={[
      styles.cardIconSlot,
      isSecondYellow && styles.cardIconPair,
      isSecondYellow &&
        (isOurs ? styles.cardIconPairLeft : styles.cardIconPairRight),
    ]}
  >
    {isSecondYellow && (
      <View
        style={[styles.cardIcon, { backgroundColor: COLORS.status.yellowCard }]}
      />
    )}
    <View
      style={[
        styles.cardIcon,
        { backgroundColor: type === "yellow_card" ? COLORS.status.yellowCard : COLORS.error },
      ]}
    />
  </View>
);

const SubstitutionLabel = ({
  playerIn,
  playerOut,
}: {
  playerIn: string;
  playerOut: string;
}) => (
  <Text style={styles.eventPlayer} numberOfLines={1}>
    {playerIn} <Text style={styles.eventAssist}>({playerOut})</Text>
  </Text>
);

export const EventRow = ({
  event,
  isOurs,
  onEdit,
  onDelete,
  adminMode,
}: Props) => {
  const icon = ICON[event.type];
  const isCard = event.type === "yellow_card" || event.type === "red_card";
  const isSub = event.type === "substitution";
  const isPenaltyShootout = event.type === "penalty_shootout";
  const isPenaltyGoal = event.type === "goal" && event.penaltyScored === true;
  const { players } = usePlayers();
  const playerOut = players.find((p) => p.id === event.playerOutId);
  const playerIn = players.find((p) => p.id === event.playerInId);

  const playerName = (event: MatchEvent) => {
    if (event.isOwnGoal) return "Auto-golo";
    if (event.isOpponent) {
      if (event.type === "red_card") return "Jogador Adversário";
      if (isPenaltyShootout) return "Adversário";
      return "Adversário";
    }
    const player = players.find((p) => p.id === event.playerId);
    return player ? player.name : "Jogador";
  };

  const eventWithNames = {
    ...event,
    player: playerName(event),
    playerOut: playerOut
      ? playerOut.name
      : event.isOpponent
        ? "Adversário"
        : "Jogador Desconhecido",
    playerIn: playerIn
      ? playerIn.name
      : event.isOpponent
        ? "Adversário"
        : "Jogador Desconhecido",
  };

  // Penaltis da série: mostrar ✓ ou ✗ em vez do minuto
  const minuteLabel = isPenaltyShootout
    ? event.penaltyScored
      ? "⚽"
      : "✗"
    : formatMinute(
        event.minute,
        event.phase ??
          (event.minute > 90 ? "2nd" : event.minute > 45 ? "2nd" : "1st"),
      );

  if (isOurs) {
    return (
      <View style={styles.eventRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {adminMode && (
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
              <TouchableOpacity onPress={() => onEdit?.(event)}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete?.(event)}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.eventIconText,
            isPenaltyShootout && {
              color: event.penaltyScored ? COLORS.success : COLORS.error,
              fontWeight: "600",
            },
          ]}
        >
          {minuteLabel}
        </Text>
        {icon && <Text style={styles.eventIconText}>{icon}</Text>}
        {isCard && (
          <CardIcon
            type={event.type}
            isSecondYellow={event.isSecondYellow}
            isOurs={isOurs}
          />
        )}
        {!isSub && (
          <Text style={styles.eventPlayer}>
            {eventWithNames.player}{isPenaltyGoal ? " (g.p.)" : ""}
          </Text>
        )}
        {isSub && eventWithNames.playerOut && eventWithNames.playerIn && (
          <SubstitutionLabel
            playerIn={eventWithNames.playerIn}
            playerOut={eventWithNames.playerOut}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.eventRow}>
      <View style={{ flex: 1 }} />
      {isSub && eventWithNames.playerOut && eventWithNames.playerIn && (
        <SubstitutionLabel
          playerIn={eventWithNames.playerIn}
          playerOut={eventWithNames.playerOut}
        />
      )}
      {!isSub && (
        <Text style={styles.eventPlayer}>
          {eventWithNames.player}{isPenaltyGoal ? " (g.p.)" : ""}
        </Text>
      )}
      {icon && <Text style={styles.eventIconText}>{icon}</Text>}
      {isCard && (
        <CardIcon
          type={event.type}
          isSecondYellow={event.isSecondYellow}
          isOurs={isOurs}
        />
      )}
      <Text
        style={[
          styles.eventIconText,
          isPenaltyShootout && {
            color: event.penaltyScored ? COLORS.success : COLORS.error,
            fontWeight: "600",
          },
        ]}
      >
        {minuteLabel}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
        {adminMode && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => onEdit?.(event)}>
              <Ionicons
                name="create-outline"
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete?.(event)}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
