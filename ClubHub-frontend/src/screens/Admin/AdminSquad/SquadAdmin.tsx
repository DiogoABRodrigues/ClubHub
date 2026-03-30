import React, { useCallback, useMemo } from "react";
import { View, Text, ScrollView, Image, Switch, Alert } from "react-native";
import { usePlayers } from "../../../contexts/PlayersContext";
import { PlayerWithStats } from "../../../models/Player";
import { styles as globalStyles } from "../../Squad/Squad.styles";
import {
  mapToMainPosition,
  getPositionOrder,
} from "../../../utils/playerPositionUtils";

export function AdminSquadScreen() {
  const { players, updatePlayer } = usePlayers();

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const posA = getPositionOrder(a.stats?.position || "");
      const posB = getPositionOrder(b.stats?.position || "");
      if (posA !== posB) return posA - posB;
      return (a.stats.number || 0) - (b.stats.number || 0);
    });
  }, [players]);

  const groupedByPosition = useMemo(() => {
    const groups: { position: string; players: PlayerWithStats[] }[] = [];
    let currentPos: string | null = null;
    let currentGroup: PlayerWithStats[] = [];

    for (const player of sortedPlayers) {
      const pos = mapToMainPosition(player.stats?.position || "");

      if (pos !== currentPos) {
        if (currentGroup.length)
          groups.push({ position: currentPos!, players: currentGroup });

        currentPos = pos;
        currentGroup = [];
      }

      currentGroup.push(player);
    }

    if (currentGroup.length)
      groups.push({ position: currentPos!, players: currentGroup });

    return groups;
  }, [sortedPlayers]);

  const handleToggleStillOnTeam = useCallback((player: PlayerWithStats) => {
    const newValue = !player.stillOnTeam;

    Alert.alert(
      "Alterar estado",
      `${player.name} ${newValue ? "volta para a equipa" : "sai da equipa"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            updatePlayer(player.id, { stillOnTeam: newValue });
          },
        },
      ],
    );
  }, []);

  const defaultPlayerImage = require("../../../../assets/player.jpg");

  return (
    <ScrollView contentContainerStyle={globalStyles.squadList}>
      {groupedByPosition.map((group) => (
        <View key={group.position} style={{ marginBottom: 16 }}>
          <View style={globalStyles.positionHeader}>
            <Text style={globalStyles.positionHeaderText}>
              {group.position}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {group.players.map((player) => (
              <View key={player.id} style={{ width: "48%", marginVertical: 6 }}>
                <View
                  style={[
                    globalStyles.card,
                    !player.stillOnTeam && { opacity: 0.4 },
                  ]}
                >
                  {/* FOTO */}
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

                  {/* BADGE INATIVO */}
                  {!player.stillOnTeam && (
                    <View
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "#e74c3c",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 10 }}>
                        INATIVO
                      </Text>
                    </View>
                  )}

                  {/* NOME */}
                  <Text
                    style={globalStyles.playerName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {player.name}
                  </Text>

                  {/* IDADE */}
                  <View style={globalStyles.playerInfoRow}>
                    {player.age && <Text>{player.age} anos</Text>}
                  </View>

                  {/* SWITCH */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 6,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>Na equipa</Text>

                    <Switch
                      value={!!player.stillOnTeam}
                      onValueChange={() => handleToggleStillOnTeam(player)}
                    />
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
