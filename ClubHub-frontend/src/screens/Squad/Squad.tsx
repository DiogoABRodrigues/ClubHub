import React, { useMemo, useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../hooks/usePlayers";
import { Player } from "../../models/Player";
import { styles as globalStyles } from "./Squad.styles";
import {
  getPositionOrder,
  mapToMainPosition,
} from "../../utils/playerPositionUtils";
import { PlayerCardModal } from "../../components/PlayerCardModal";
import { EmptyState } from "../../components/EmptyState";
import { COLORS } from "../../theme/colors";

const defaultPlayerImage = require("../../../assets/player.jpg");

const chunkArray = (arr: Player[], size: number) => {
  const chunks: Player[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const PlayerCard = React.memo(
  ({
    player,
    onPress,
  }: {
    player: Player;
    onPress: (player: Player) => void;
  }) => {
    const [firstName, ...rest] = player.name.split(" ");
    const lastName = rest.join(" ");
    const hasLeft = player.squadStatus === "left";

    return (
      <TouchableOpacity
        style={[globalStyles.playerCard, hasLeft && { opacity: 0.45 }]}
        onPress={() => onPress(player)}
        activeOpacity={0.75}
      >
        <Image
          source={
            player.photoUrl ? { uri: player.photoUrl } : defaultPlayerImage
          }
          style={[
            globalStyles.playerImage,
            hasLeft && { tintColor: undefined },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[globalStyles.playerName, hasLeft && { color: COLORS.text.blackWhite }]}
          numberOfLines={1}
        >
          {firstName}
        </Text>

        <Text
          style={[globalStyles.playerName, hasLeft && { color: COLORS.text.blackWhite }]}
          numberOfLines={1}
        >
          {lastName}
        </Text>
      </TouchableOpacity>
    );
  },
);

// ─────────────────────────────────────────────────────────────
//  SCREEN
// ─────────────────────────────────────────────────────────────
export const SquadScreen = React.memo(function SquadScreen() {
  // getVisiblePlayers devolve "active" + "left"; "error" já foi filtrado
  const { getVisiblePlayers } = usePlayers();
  const visiblePlayers = getVisiblePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  /* SORT ONCE */
  const sortedPlayers = useMemo(() => {
    return [...visiblePlayers].sort((a, b) => {
      const posA = getPositionOrder(a.position || "");
      const posB = getPositionOrder(b.position || "");
      if (posA !== posB) return posA - posB;
      return (a.number || 0) - (b.number || 0);
    });
  }, [visiblePlayers]);

  /* GROUP ONCE */
  const grouped = useMemo(() => {
    const groups: Record<string, Player[]> = {};
    for (const p of sortedPlayers) {
      const key = mapToMainPosition(p.position || "");
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
      chunkArray(group.players, 3).forEach((row) => {
        result.push({ type: "row", players: row });
      });
    });
    return result;
  }, [grouped]);

  const handlePlayerPress = useCallback((player: Player) => {
    setSelectedPlayer(player);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPlayer(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: any) => {
      if (item.type === "header") {
        return (
          <View style={globalStyles.positionHeader}>
            <Text style={globalStyles.positionHeaderText}>{item.position}</Text>
          </View>
        );
      }

      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {item.players.map((p: Player) => (
            <PlayerCard key={p.id} player={p} onPress={handlePlayerPress} />
          ))}
        </View>
      );
    },
    [handlePlayerPress],
  );

  const isEmpty = visiblePlayers.length === 0;
  return (
    <>
      {isEmpty && (
        <EmptyState
          title="Não foi possível encontrar informação"
          message="Por favor tenta novamente mais tarde."
        />
      )}
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (item.type === "header") return `h-${item.position}-${index}`;
          if (item.type === "row")
            return `r-${item.players.map((p: Player) => p.id).join("-")}`;
          return `unknown-${index}`;
        }}
        contentContainerStyle={globalStyles.squadList}
      />
      {selectedPlayer?.isFieldPlayer && (
        <PlayerCardModal player={selectedPlayer} onClose={handleCloseModal} />
      )}
    </>
  );
});
