import React, { useCallback, useMemo } from "react";
import { View, Text, Image, Switch, Alert } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../../hooks/usePlayers";
import { Player } from "../../../models/Player";
import { styles } from "../../Squad/Squad.styles";
import {
  mapToMainPosition,
  getPositionOrder,
} from "../../../utils/playerPositionUtils";
import { useAuth } from "../../../contexts/AuthContext";

const defaultPlayerImage = require("../../../../assets/player.jpg");

/* ---------------- UTILS ---------------- */
const chunkArray = (arr: Player[], size: number) => {
  const chunks: Player[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/* ---------------- CARD MEMO ---------------- */
const PlayerCard = React.memo(
  ({ player, onToggle }: { player: Player; onToggle: (p: Player) => void }) => {
    const [firstName, ...rest] = player.name.split(" ");
    const lastName = rest.join(" ");

    return (
      <View style={styles.playerCard}>
        <Image
          source={
            player.photoUrl ? { uri: player.photoUrl } : defaultPlayerImage
          }
          style={styles.playerImage}
          resizeMode="contain"
        />

        {!player.stillOnTeam && (
          <View style={{ position: "absolute", top: 6, right: 6 }}>
            <Text
              style={{ color: "white", fontSize: 10, backgroundColor: "red" }}
            >
              INATIVO
            </Text>
          </View>
        )}

        <Text style={styles.playerName} numberOfLines={1}>
          {firstName}
        </Text>
        <Text style={styles.playerName} numberOfLines={1}>
          {lastName}
        </Text>

        <Switch
          value={!!player.stillOnTeam}
          onValueChange={() => onToggle(player)}
        />
      </View>
    );
  },
);

/* ---------------- SCREEN ---------------- */
export function AdminSquadScreen() {
    const { isAdmin, adminMode } = useAuth();
    if (!isAdmin) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Acesso negado</Text>
        </View>
      );
    }
  const { players, updatePlayer } = usePlayers();

  /* SORT ONCE */
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const posA = getPositionOrder(a.Stats?.[0]?.position || "");
      const posB = getPositionOrder(b.Stats?.[0]?.position || "");

      if (posA !== posB) return posA - posB;
      return (a.Stats?.[0]?.number || 0) - (b.Stats?.[0]?.number || 0);
    });
  }, [players]);

  /* GROUPING */
  const groupedData = useMemo(() => {
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

  /* FLATTEN (ROWS DE 3) */
  const flashData = useMemo(() => {
    const result: any[] = [];

    groupedData.forEach((group) => {
      result.push({ type: "header", position: group.position });

      const rows = chunkArray(group.players, 3);

      rows.forEach((row) => {
        result.push({ type: "row", players: row });
      });
    });

    return result;
  }, [groupedData]);

  /* TOGGLE */
  const handleToggle = useCallback(
    (player: Player) => {
      const newValue = !player.stillOnTeam;

      Alert.alert(
        "Alterar estado",
        `${player.name} ${newValue ? "volta para a equipa" : "sai da equipa"}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () =>
              updatePlayer({
                id: player.id,
                data: { stillOnTeam: newValue },
              }),
          },
        ],
      );
    },
    [updatePlayer],
  );

  /* RENDER */
  const renderItem = useCallback(
    ({ item }: any) => {
      if (item.type === "header") {
        return (
          <View style={styles.positionHeader}>
            <Text style={styles.positionHeaderText}>{item.position}</Text>
          </View>
        );
      }

      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {item.players.map((p: Player) => (
            <PlayerCard key={p.id} player={p} onToggle={handleToggle} />
          ))}
        </View>
      );
    },
    [handleToggle],
  );

  return (
    <FlashList
      data={flashData}
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
      contentContainerStyle={styles.squadList}
    />
  );
}
