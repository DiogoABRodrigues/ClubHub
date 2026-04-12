import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles/EventRow.syles";
import { COLORS } from "../theme/colors";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { usePlayers } from "../hooks/usePlayers";
import { MatchEvent } from "../models/MatchEvent";
import { useAuth } from "../contexts/AuthContext";
interface Props {
  event: MatchEvent;
  isOurs: boolean;
  onEdit?: (event: MatchEvent) => void;
  onDelete?: (event: MatchEvent) => void;
}

const ICON: Record<string, string> = {
  goal: "⚽",
  substitution: "🔄",
};

const CardIcon = ({ type }: { type: string }) => (
  <View
    style={[
      styles.cardIcon,
      { backgroundColor: type === "yellow_card" ? "#f5c518" : COLORS.error },
    ]}
  />
);

export const EventRow = ({ event, isOurs, onEdit, onDelete }: Props) => {
  const icon = ICON[event.type];
  const isCard = event.type === "yellow_card" || event.type === "red_card";
  const isSub = event.type === "substitution";
  const { players } = usePlayers();
  const player = players.find((p) => p.id === event.playerId);
  const playerOut = players.find((p) => p.id === event.playerOutId);
  const playerIn = players.find((p) => p.id === event.playerInId);

  const playerName = (event: MatchEvent) => {
    if (event.isOwnGoal) return "Auto-golo";
    if (event.isOpponent) {
      if(event.type === "red_card") {
        return "Jogador Adversário";
      }
      return "Golo Adversário";
    }
    const player = players.find((p) => p.id === event.playerId);
    return player ? player.name : "Jogador";
  }

  const eventWithNames = {
    ...event,
    player: playerName(event),
    playerOut: playerOut ? playerOut.name : "Jogador Desconecido",
    playerIn: playerIn ? playerIn.name : "Jogador Desconecido",
  };
  const minute = event.minute > 90 ? `90'+` : `${event.minute}'`;
  const { adminMode } = useAuth();

  if (isOurs) {
    return (
      <View style={styles.eventRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {adminMode && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => onEdit?.(event)}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete?.(event)} style={{}}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.eventIconText}>{minute}</Text>
        {icon && <Text style={styles.eventIconText}>{icon}</Text>}
        {isCard && <CardIcon type={event.type} />}
        {!isSub && (
          <Text style={styles.eventPlayer}>{eventWithNames.player}</Text>
        )}
        {isSub && eventWithNames.playerOut && eventWithNames.playerIn && (
          <View>
            <Text style={styles.eventPlayer}>{eventWithNames.playerIn}</Text>
            <Text style={styles.eventAssist}>{eventWithNames.playerOut}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.eventRow}>
      <View style={{ flex: 1 }} />
      {isSub && eventWithNames.playerOut && eventWithNames.playerIn && (
        <View>
          <Text style={styles.eventPlayer}>{eventWithNames.playerIn}</Text>
          <Text style={styles.eventAssist}>{eventWithNames.playerOut}</Text>
        </View>
      )}
      {!isSub && (
        <Text style={styles.eventPlayer}>{eventWithNames.player}</Text>
      )}
      {icon && <Text style={styles.eventIconText}>{icon}</Text>}
      {isCard && <CardIcon type={event.type} />}
      <Text style={styles.eventIconText}>{minute}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {adminMode && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => onEdit?.(event)}>
              <Ionicons
                name="create-outline"
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete?.(event)} style={{}}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
