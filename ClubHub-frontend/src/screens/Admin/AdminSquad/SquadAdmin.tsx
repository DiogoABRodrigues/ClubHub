import React, { useCallback, useMemo } from "react";
import { View, Text, Image, Switch, Alert } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../../hooks/usePlayers";
import { Player } from "../../../models/Player";
import { styles } from "../../Squad/Squad.styles";
import { mapToMainPosition, getPositionOrder } from "../../../utils/playerPositionUtils";

const defaultPlayerImage = require("../../../../assets/player.jpg");

/* ------------------ ROW MEMO ------------------ */
const PlayerCard = React.memo(
  ({
    player,
    onToggle,
  }: {
    player: Player;
    onToggle: (p: Player) => void;
  }) => {
    return (
      <View style={{ width: "48%", marginVertical: 6 }}>
        <View style={[styles.card, !player.stillOnTeam && { opacity: 0.4 }]}>
          <View style={styles.playerPhotoWrapper}>
            <Image
              source={
                player.photoUrl
                  ? { uri: player.photoUrl }
                  : defaultPlayerImage
              }
              style={styles.statsPhoto}
              resizeMode="contain"
            />
          </View>

          {!player.stillOnTeam && (
            <View style={{ position: "absolute", top: 6, right: 6 }}>
              <Text style={{ color: "white", fontSize: 10 }}>INATIVO</Text>
            </View>
          )}

          <Text style={styles.playerName}>{player.name}</Text>

          <Switch
            value={!!player.stillOnTeam}
            onValueChange={() => onToggle(player)}
          />
        </View>
      </View>
    );
  }
);

/* ------------------ SCREEN ------------------ */
export function AdminSquadScreen() {
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

  /* GROUPING (stable reference) */
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

  /* flatten for FlashList (NO UI CHANGE) */
  const flashData = useMemo(() => {
    const result: any[] = [];

    groupedData.forEach((group) => {
      result.push({ type: "header", position: group.position });

      group.players.forEach((player) => {
        result.push({ type: "player", player });
      });
    });

    return result;
  }, [groupedData]);

  /* stable toggle */
  const handleToggle = useCallback(
    (player: Player) => {
      const newValue = !player.stillOnTeam;

      Alert.alert(
        "Alterar estado",
        `${player.name} ${
          newValue ? "volta para a equipa" : "sai da equipa"
        }?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () =>
              updatePlayer({ id: player.id, data: { stillOnTeam: newValue } }),
          },
        ]
      );
    },
    [updatePlayer]
  );

  /* render item (FLASHLIST) */
  const renderItem = useCallback(
    ({ item }: any) => {
      if (item.type === "header") {
        return (
          <Text style={styles.positionHeaderText}>
            {item.position}
          </Text>
        );
      }

      return (
        <PlayerCard player={item.player} onToggle={handleToggle} />
      );
    },
    [handleToggle]
  );

  return (
    <FlashList
      data={flashData}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        item.type === "header"
          ? `h-${item.position}-${index}`
          : item.player.id
      }
      contentContainerStyle={styles.squadList}
    />
  );
}