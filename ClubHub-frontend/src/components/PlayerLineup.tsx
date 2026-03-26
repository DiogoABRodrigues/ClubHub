// PlayerLineup.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Player } from '../data/mockData';
import { COLORS } from '../theme/colors';
import { styles } from './styles/PlayerLineup.styles';

interface PlayerLineupProps {
  players: Player[];
  teamName: string;
}

export const PlayerLineup = ({ players, teamName }: PlayerLineupProps) => {
  const getPositionPlayers = (position: string) =>
    players.filter((p) => p.position === position);

  const positions = {
    GK: getPositionPlayers('GK'),
    defenders: players.filter((p) => ['RB', 'CB', 'LB'].includes(p.position)),
    midfielders: players.filter((p) => ['CM', 'CAM', 'CDM'].includes(p.position)),
    forwards: players.filter((p) => ['RW', 'LW', 'ST', 'CF'].includes(p.position)),
  };

  const renderPlayer = (player: Player, bgColor: string) => (
    <View key={player.id} style={[styles.playerCard, { borderColor: COLORS.muted, backgroundColor: bgColor }]}>
      <View style={[styles.playerNumber, { backgroundColor: bgColor }]}>
        <Text style={{ color: COLORS.primary }}>{player.number}</Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerPosition}>{player.position}</Text>
      </View>
    </View>
  );

  const renderPositionGroup = (playersGroup: Player[], bgColor: string) => {
    if (playersGroup.length === 0) return null;
    return (
      <View style={styles.positionGroup}>
        {playersGroup.map((p) => renderPlayer(p, bgColor))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.teamName}>{teamName}</Text>

      {renderPositionGroup(positions.forwards, `${COLORS.primary}33`)}
      {renderPositionGroup(positions.midfielders, `${COLORS.primary}33`)}
      {renderPositionGroup(positions.defenders, `${COLORS.primary}33`)}
      {renderPositionGroup(positions.GK, `${COLORS.chart3}33`)}
    </View>
  );
};