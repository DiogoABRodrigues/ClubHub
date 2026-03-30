import React from "react";
import { View, Text } from "react-native";
import { styles } from "../screens/MatchDetails/MatchDetail.styles";
import { COLORS } from "../theme/colors";

interface Props {
  event: any;
  isOurs: boolean;
}

const ICON: Record<string, string> = {
  goal:         "⚽",
  substitution: "🔄",
};

const CardIcon = ({ type }: { type: string }) => (
  <View style={[
    styles.cardIcon,
    { backgroundColor: type === "yellow_card" ? "#f5c518" : COLORS.error }
  ]} />
);

export const EventRow = ({ event, isOurs }: Props) => {
  const icon     = ICON[event.type];
  const isCard   = event.type === "yellow_card" || event.type === "red_card";
  const isSub    = event.type === "substitution";

  const minute = event.minute > 90
    ? `90'+`
    : `${event.minute}'`;

  if (isOurs) {
    return (
      <View style={styles.eventRow}>
        <Text style={styles.eventIconText}>{minute}</Text>
        {icon   && <Text style={styles.eventIconText}>{icon}</Text>}
        {isCard && <CardIcon type={event.type} />}
        <Text style={styles.eventPlayer}>{event.player}</Text>
        {isSub && event.playerOut && (
          <Text style={styles.eventAssist}>{event.playerOut}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.eventRow}>
      <View style={{ flex: 1 }} />
      {isSub && event.playerOut && (
        <Text style={styles.eventAssist}>{event.playerOut}</Text>
      )}
      <Text style={styles.eventPlayer}>{event.player}</Text>
      {icon   && <Text style={styles.eventIconText}>{icon}</Text>}
      {isCard && <CardIcon type={event.type} />}
      <Text style={styles.eventMinuteTextRight}>{minute}</Text>
    </View>
  );
};