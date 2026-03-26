import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/MatchCard.styles';
import { COLORS } from '../theme/colors';

import { Match } from '../data/mockData';
import { LiveBadge } from './LiveBadge';

import { Ionicons } from '@expo/vector-icons';

interface MatchCardProps {
  match: Match;
  onPress?: () => void; // navigation depois
}

export const MatchCard = ({ match, onPress }: MatchCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.date}>
            {formatDate(match.date)} • {match.time}
          </Text>
        </View>

        {match.status === 'live' && <LiveBadge />}

        {match.status === 'upcoming' && (
          <Text style={styles.upcoming}>Upcoming</Text>
        )}

        {match.status === 'finished' && (
          <Text style={styles.finished}>FT</Text>
        )}
      </View>

      {/* TEAMS */}
      <View style={styles.teams}>
        {/* HOME */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogo}>
              <Text>🏆</Text>
            </View>
            <Text style={styles.teamName}>{match.homeTeam}</Text>
          </View>

          <Text
            style={[
              styles.score,
              match.status === 'live' && { color: COLORS.secondary },
            ]}
          >
            {match.homeScore ?? '-'}
          </Text>
        </View>

        {/* AWAY */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogoAlt}>
              <Text>⚽</Text>
            </View>
            <Text style={styles.teamName}>{match.awayTeam}</Text>
          </View>

          <Text
            style={[
              styles.score,
              match.status === 'live' && { color: COLORS.secondary },
            ]}
          >
            {match.awayScore ?? '-'}
          </Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.venue}>{match.venue}</Text>

        <Text style={styles.category}>{match.category}</Text>
      </View>
    </TouchableOpacity>
  );
};