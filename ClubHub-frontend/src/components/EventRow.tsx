import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path, Defs, ClipPath, Polygon } from "react-native-svg";
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
  substitution: "⇄",
  penalty_shootout: "",
};

// Cartão inclinado, mesmo desenho usado pelo Flashscore.
const CARD_PATH = "M5.97 0 3.5 2.47v15.06L16.6 2.47 14.13 0H5.97Z";
const CARD_SIZE = 12;

const CardShape = ({
  color,
  size = CARD_SIZE,
  style,
}: {
  color: string;
  size?: number;
  style?: any;
}) => (
  <Svg width={size} height={(size * 18) / 20} viewBox="0 0 20 18" style={style}>
    <Path fillRule="evenodd" d={CARD_PATH} fill={color} />
  </Svg>
);

// 2º amarelo = vermelho: o MESMO cartão, mas metade amarela e metade
// vermelha (clip a meio, em vez de dois cartões sobrepostos).
const SplitCardShape = ({
  size = CARD_SIZE,
  style,
}: {
  size?: number;
  style?: any;
}) => {
  const uid = useMemo(() => Math.random().toString(36).slice(2), []);
  const leftId = `cardHalfLeft-${uid}`;
  const rightId = `cardHalfRight-${uid}`;

  return (
    <Svg width={size} height={(size * 18) / 20} viewBox="0 0 20 18" style={style}>
      <Defs>
        <ClipPath id={leftId}>
          {/* Metade amarela: triângulo superior-esquerdo */}
          <Polygon points="0,0 20,0 0,18" />
        </ClipPath>
        <ClipPath id={rightId}>
          {/* Metade vermelha: triângulo inferior-direito */}
          <Polygon points="20,0 20,18 0,18" />
        </ClipPath>
      </Defs>
      <Path
        fillRule="evenodd"
        d={CARD_PATH}
        fill={COLORS.status.yellowCard}
        clipPath={`url(#${leftId})`}
      />
      <Path
        fillRule="evenodd"
        d={CARD_PATH}
        fill={COLORS.error}
        clipPath={`url(#${rightId})`}
      />
    </Svg>
  );
};

const CardIcon = ({
  type,
  isSecondYellow,
}: {
  type: string;
  isSecondYellow?: boolean;
  isOurs: boolean;
}) => (
  <View style={styles.cardIconSlot}>
    {isSecondYellow ? (
      <SplitCardShape />
    ) : (
      <CardShape
        color={type === "yellow_card" ? COLORS.status.yellowCard : COLORS.error}
      />
    )}
  </View>
);

const SubstitutionLabel = ({
  playerIn,
  playerOut,
  outFirst,
}: {
  playerIn: string;
  playerOut: string;
  outFirst?: boolean;
}) => {
  // Quem sai tem sempre uma cor mais clara, independentemente da posição.
  const inName = <Text style={styles.eventPlayer}>{playerIn}</Text>;
  const outName = (
    <Text style={[styles.eventAssist, { color: COLORS.textSecondary }]}>
      {playerOut}
    </Text>
  );

  return (
    <Text numberOfLines={1}>
      {outFirst ? (
        <>
          {outName} <Text style={styles.eventAssist}>({inName})</Text>
        </>
      ) : (
        <>
          {inName} <Text style={styles.eventAssist}>({outName})</Text>
        </>
      )}
    </Text>
  );
};

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
          outFirst
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