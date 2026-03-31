import React, { useMemo, useCallback } from "react";
import { View, Text, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../hooks/usePlayers";
import { Player } from "../../models/Player";
import { styles as globalStyles } from "./Squad.styles";
import { getPositionOrder } from "../../utils/playerPositionUtils";
import { mapToMainPosition } from "../../utils/playerPositionUtils";

const defaultPlayerImage = require("../../../assets/player.jpg");

/* ---------------- CARD MEMO ---------------- */
const PlayerCard = React.memo(({ player }: { player: Player }) => {
  return (
    <View style={{ width: "48%", marginVertical: 4 }}>
      <View style={globalStyles.card}>
        <View style={globalStyles.playerPhotoWrapper}>
          <Image
            source={
              player.photoUrl
                ? { uri: player.photoUrl }
                : defaultPlayerImage
            }
            style={globalStyles.statsPhoto}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.playerName} numberOfLines={1}>
          {player.name}
        </Text>

        <View style={globalStyles.playerInfoRow}>
          {player.age && <Text>{player.age} anos</Text>}
        </View>
      </View>
    </View>
  );
});

/* ---------------- SCREEN ---------------- */
export function SquadScreen() {
  const { getActivePlayers } = usePlayers();
  const activePlayers = getActivePlayers();

  /* SORT ONCE */
  const sortedPlayers = useMemo(() => {
  const sorted = [...activePlayers].sort((a, b) => {
    const posA = getPositionOrder(a.Stats?.[0]?.position || "");
    const posB = getPositionOrder(b.Stats?.[0]?.position || "");

    if (posA !== posB) return posA - posB;
    return (a.Stats?.[0]?.number || 0) - (b.Stats?.[0]?.number || 0);
  });

  return sorted;
}, [activePlayers]);

  /* GROUP ONCE */
  const grouped = useMemo(() => {

for (const p of sortedPlayers) {
  const raw = p.Stats?.[0]?.position || "";
  const mapped = mapToMainPosition(raw);

}
    const groups: Record<string, Player[]> = {};

    for (const p of sortedPlayers) {
      const key = mapToMainPosition(p.Stats?.[0]?.position || "");
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }

    return Object.entries(groups).map(([position, players]) => ({
      position,
      players,
    }));
  }, [sortedPlayers]);

  /* FLATTEN FOR VIRTUAL LIST */
  const data = useMemo(() => {
    const result: any[] = [];

    grouped.forEach((group) => {
      result.push({ type: "header", position: group.position });

      group.players.forEach((p) => {
        result.push({ type: "player", player: p });
      });
    });

    return result;
  }, [grouped]);

  const renderItem = useCallback(({ item }: any) => {
    if (item.type === "header") {
      return (
        <View style={globalStyles.positionHeader}>
          <Text style={globalStyles.positionHeaderText}>
            {item.position}
          </Text>
        </View>
      );
    }

    return <PlayerCard player={item.player} />;
  }, []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        item.type === "header"
          ? `h-${item.position}-${index}`
          : item.player.id
      }
      contentContainerStyle={globalStyles.squadList}
    />
  );
}