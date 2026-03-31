import React, { useMemo } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { usePlayers } from "../../contexts/PlayersContext";
import { PlayerWithStats } from "../../models/Player";
import { styles as globalStyles } from "./Squad.styles";
import { getPositionOrder } from "../../utils/playerPositionUtils";

const defaultPlayerImage = require("../../../assets/player.jpg");

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

export function SquadScreen() {
  const { getActivePlayers } = usePlayers();
  const activePlayers = getActivePlayers();

  const sortedPlayers = useMemo(() => {
    return [...activePlayers].sort((a, b) => {
      const posA = getPositionOrder(a.stats?.position || "");
      const posB = getPositionOrder(b.stats?.position || "");
      if (posA !== posB) return posA - posB;
      return (a.stats.number || 0) - (b.stats.number || 0);
    });
  }, [activePlayers]);

  const groupedByPosition = useMemo(() => {
    const groups: Record<string, PlayerWithStats[]> = {};

    for (const player of sortedPlayers) {
      const pos = mapToMainPosition(player.stats?.position || "");
      if (!groups[pos]) groups[pos] = [];
      groups[pos].push(player);
    }

    return Object.entries(groups).map(([position, players]) => ({
      position,
      players,
    }));
  }, [sortedPlayers]);

  return (
    <ScrollView contentContainerStyle={globalStyles.squadList}>
      {groupedByPosition.map((group) => (
        <View key={group.position} style={{ marginBottom: 16 }}>
          <View style={globalStyles.positionHeader}>
            <Text style={globalStyles.positionHeaderText}>
              {group.position}
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {group.players.map((player) => (
              <View key={player.id} style={{ width: "48%", marginVertical: 4 }}>
                <View style={globalStyles.card}>
                  <View style={globalStyles.playerPhotoWrapper}>
                    <Image
                      source={player.photoUrl ? { uri: player.photoUrl } : defaultPlayerImage}
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
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}