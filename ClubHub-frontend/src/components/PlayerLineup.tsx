import React, { useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import { Player } from "../data/mockData";
import { COLORS } from "../theme/colors";
import { styles } from "./styles/PlayerLineup.styles";

interface PlayerLineupProps {
  players: Player[];
  teamName: string;
}

export const PlayerLineup = React.memo(
  ({ players, teamName }: PlayerLineupProps) => {
    // 🔥 Agrupar jogadores numa única passagem
    const positions = useMemo(() => {
      const grouped = {
        GK: [] as Player[],
        defenders: [] as Player[],
        midfielders: [] as Player[],
        forwards: [] as Player[],
      };

      players.forEach((p) => {
        switch (p.position) {
          case "GK":
            grouped.GK.push(p);
            break;
          case "RB":
          case "CB":
          case "LB":
            grouped.defenders.push(p);
            break;
          case "CM":
          case "CAM":
          case "CDM":
            grouped.midfielders.push(p);
            break;
          case "RW":
          case "LW":
          case "ST":
          case "CF":
            grouped.forwards.push(p);
            break;
        }
      });

      return grouped;
    }, [players]);

    const renderPlayer = useCallback(
      (player: Player, bgColor: string) => (
        <View
          key={player.id}
          style={[
            styles.playerCard,
            { borderColor: COLORS.muted, backgroundColor: bgColor },
          ]}
        >
          <View style={[styles.playerNumber, { backgroundColor: bgColor }]}>
            <Text style={{ color: COLORS.primary }}>{player.number}</Text>
          </View>

          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerPosition}>{player.position}</Text>
          </View>
        </View>
      ),
      [],
    );

    const renderPositionGroup = useCallback(
      (playersGroup: Player[], bgColor: string) => {
        if (playersGroup.length === 0) return null;

        return (
          <View style={styles.positionGroup}>
            {playersGroup.map((p) => renderPlayer(p, bgColor))}
          </View>
        );
      },
      [renderPlayer],
    );

    return (
      <View style={styles.container}>
        <Text style={styles.teamName}>{teamName}</Text>

        {renderPositionGroup(positions.forwards, `${COLORS.primary}33`)}
        {renderPositionGroup(positions.midfielders, `${COLORS.primary}33`)}
        {renderPositionGroup(positions.defenders, `${COLORS.primary}33`)}
        {renderPositionGroup(positions.GK, `${COLORS.chart3}33`)}
      </View>
    );
  },
);
