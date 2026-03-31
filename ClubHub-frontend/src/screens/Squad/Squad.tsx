import React, { useMemo, useCallback } from "react";
import { View, Text, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePlayers } from "../../contexts/PlayersContext";
import { PlayerWithStats } from "../../models/Player";
import { styles as globalStyles } from "./Squad.styles";
import { getPositionOrder } from "../../utils/playerPositionUtils";

const defaultPlayerImage = require("../../../assets/player.jpg");

/* ---------------- POSITION MAP ---------------- */
const mapToMainPosition = (position: string) => {
  const pos = position?.toLowerCase() || "";
  if (pos === "guarda redes") return "Guarda Redes";
  if (["rb", "cb", "lb", "defesa"].includes(pos)) return "Defesa";
  if (["cm", "cam", "médio"].includes(pos)) return "Médio";
  if (["rw", "lw", "st", "avançado"].includes(pos)) return "Avançado";
  if (pos === "treinador") return "Treinador";
  if (pos === "outros técnicos") return "Outros Técnicos";
  return "Médio";
};

/* ---------------- CARD MEMO ---------------- */
const PlayerCard = React.memo(({ player }: { player: PlayerWithStats }) => {
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
    return [...activePlayers].sort((a, b) => {
      const posA = getPositionOrder(a.stats?.position || "");
      const posB = getPositionOrder(b.stats?.position || "");

      if (posA !== posB) return posA - posB;
      return (a.stats?.number || 0) - (b.stats?.number || 0);
    });
  }, [activePlayers]);

  /* GROUP ONCE */
  const grouped = useMemo(() => {
    const groups: Record<string, PlayerWithStats[]> = {};

    for (const p of sortedPlayers) {
      const key = mapToMainPosition(p.stats?.position || "");
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