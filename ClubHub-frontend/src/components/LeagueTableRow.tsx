import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/LeagueTableRow.styles';
import { COLORS } from '../theme/colors';

// icons (substituto do lucide)
import { Ionicons } from '@expo/vector-icons';

interface StandingsTeam {
  position: number;
  name: string;
  played: number;
  goalDifference: number;
  points: number;
}

interface Props {
  team: StandingsTeam;
  isUserTeam?: boolean;
}

export const LeagueTableRow = ({ team, isUserTeam = false }: Props) => {
  
  const getPositionColor = (position: number) => {
    if (position <= 2) return COLORS.secondary; // Champions
    if (position <= 4) return COLORS.primary;   // Europa
    if (position >= 11) return COLORS.error;    // Relegation
    return COLORS.textSecondary;
  };

  return (
    <View style={[
      styles.row,
      isUserTeam && styles.userRow
    ]}>

      {/* POSITION */}
      <View style={styles.position}>
        <Text style={[styles.text, { color: getPositionColor(team.position) }]}>
          {team.position}
        </Text>
      </View>

      {/* TEAM */}
      <View style={styles.team}>
        <Text style={[
          styles.text,
          isUserTeam && styles.bold
        ]} numberOfLines={1}>
          {team.name}
        </Text>
      </View>

      {/* PLAYED */}
      <View style={styles.center}>
        <Text style={styles.mutedText}>{team.played}</Text>
      </View>

      {/* GOAL DIFFERENCE */}
      <View style={styles.centerRow}>
        <Text style={styles.text}>
          {team.goalDifference > 0 ? '+' : ''}
          {team.goalDifference}
        </Text>

        {team.goalDifference > 0 && (
          <Ionicons name="arrow-up" size={12} color={COLORS.secondary} />
        )}

        {team.goalDifference < 0 && (
          <Ionicons name="arrow-down" size={12} color={COLORS.error} />
        )}
      </View>

      {/* POINTS */}
      <View style={styles.points}>
        <Text style={[
          styles.text,
          isUserTeam && { color: COLORS.primary }
        ]}>
          {team.points}
        </Text>
      </View>

    </View>
  );
};