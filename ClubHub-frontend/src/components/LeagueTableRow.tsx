import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, Image } from 'react-native';
import { styles } from './styles/LeagueTableRow.styles';
import { COLORS } from '../theme/colors';
import { Standing } from '../models/Standing';
import { useTeams } from '../contexts/TeamsContext';
import { teamConfig } from '../config/teamConfig';

interface Props {
  standing: Standing;
  isUserTeam?: boolean;
  green: number; // número de posições verdes (promoção)
  red: number;   // número de posições vermelhas (descida)
}

export const LeagueTableRow = ({ standing, isUserTeam = false, green, red}: Props) => {
  const { teams } = useTeams();
  const [expanded, setExpanded] = useState(false);

  // Enable LayoutAnimation on Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Buscar logo da equipa pelo nome
  const teamLogo = teams.find(
    (team) => team.name.trim().toLowerCase() === standing.teamName.trim().toLowerCase()
  )?.logoUrl;

  const AppTeam = teams.find(t => t.name.trim().toLowerCase() === teamConfig.name.trim().toLowerCase());

  const getRowBackgroundColor = (standingPosition: number, teamName: string) => {
    // Linha da equipa da app
    if (teamName.trim().toLowerCase() === AppTeam?.name.trim().toLowerCase()) {
      return COLORS.primaryLight; // cor especial da equipa
    }

    // Subida / promoção
    if (standingPosition <= green) return COLORS.successLight;

    // Descida / relegação
    if (standingPosition >= red) return COLORS.errorLight;

    // Normal
    return COLORS.background; // ou transparente
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={toggleExpand}>
      <View
  style={[
    styles.row,
    { backgroundColor: getRowBackgroundColor(standing.position, standing.teamName) },
    isUserTeam && styles.userRow
  ]}
>
        {/* POSITION */}
        <View style={styles.position}>
          <Text style={[styles.text, { color: COLORS.textSecondary }]}>
            {standing.position}
          </Text>
        </View>

        {/* TEAM NAME + LOGO */}
        <View style={styles.teamRow}>
          {teamLogo && (
            <Image source={{ uri: teamLogo }} style={styles.teamLogo} resizeMode="contain" />
          )}
          <Text style={[styles.text, isUserTeam && styles.bold]} numberOfLines={1}>
            {standing.teamName}
          </Text>
        </View>

        {/* PLAYED */}
        <View style={styles.center}>
          <Text style={styles.mutedText}>{standing.played}</Text>
        </View>

        {/* GOAL DIFFERENCE */}
        <View style={styles.centerRow}>
          <Text style={styles.text}>
            {standing.goalDiff > 0 ? '+' : ''}
            {standing.goalDiff}
          </Text>
        </View>

        {/* POINTS */}
        <View style={styles.points}>
          <Text style={[styles.text, isUserTeam && { color: COLORS.primary }]}>
            {standing.points}
          </Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>V:</Text>
            <Text style={styles.statValue}>{standing.wins}</Text>
            <Text style={styles.statLabel}>E:</Text>
            <Text style={styles.statValue}>{standing.draws}</Text>
            <Text style={styles.statLabel}>D:</Text>
            <Text style={styles.statValue}>{standing.losses}</Text>
            <Text style={styles.statLabel}>GM:</Text>
            <Text style={styles.statValue}>{standing.goalsFor}</Text>
            <Text style={styles.statLabel}>GS:</Text>
            <Text style={styles.statValue}>{standing.goalsAgainst}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};