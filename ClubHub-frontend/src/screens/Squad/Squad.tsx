import React, { useMemo, useCallback, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../hooks/usePlayers";
import { Player } from "../../models/Player";
import { styles as globalStyles } from "./Squad.styles";
import { getPositionOrder } from "../../utils/playerPositionUtils";
import { mapToMainPosition } from "../../utils/playerPositionUtils";
import { COLORS } from "../../theme/colors";
const defaultPlayerImage = require("../../../assets/player.jpg");

const chunkArray = (arr: Player[], size: number) => {
  const chunks: Player[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/* ---------------- CARD MEMO ---------------- */
const PlayerCard = React.memo(({ player }: { player: Player }) => {
  return (
    <View style={globalStyles.playerCard}>
      <Image
        source={
          player.photoUrl
            ? { uri: player.photoUrl }
            : defaultPlayerImage
        }
        style={globalStyles.playerImage}
        resizeMode="contain"
      />

      <Text style={globalStyles.playerName} numberOfLines={1}>
        {player.name}
      </Text>

      {!!player.age && (
        <Text style={globalStyles.playerAge}>
          {player.age} anos
        </Text>
      )}
    </View>
  );
});

/* ---------------- SCREEN ---------------- */
export const SquadScreen = React.memo(function SquadScreen() {
  useEffect(() => {
  console.log("MOUNT");
}, []);
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

      const rows = chunkArray(group.players, 3);

      rows.forEach((row) => {
        result.push({ type: "row", players: row });
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

    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {item.players.map((p: Player) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </View>
    );
  }, []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        if (item.type === "header") {
          return `h-${item.position}-${index}`;
        }

        if (item.type === "row") {
          return `r-${item.players.map((p: Player) => p.id).join("-")}`;
        }

        return `unknown-${index}`;
      }}
      contentContainerStyle={globalStyles.squadList}
    />
  );
});