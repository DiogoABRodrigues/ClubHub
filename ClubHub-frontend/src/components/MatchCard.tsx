import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/MatchCard.styles';
import { COLORS } from '../theme/colors';

import { Match } from '../models/Match';
import { LiveBadge } from './LiveBadge';

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { formatDateWithWeekdayPT } from '../utils/dateUtils';

interface MatchCardProps {
  match: Match;
  homeLogo: string;
  awayLogo: string;
  onPress?: () => void;
}

export const MatchCard = ({ match, homeLogo, awayLogo, onPress }: MatchCardProps) => {
  const formatDate = (dateStr: string) => {
    return formatDateWithWeekdayPT(dateStr);
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
          <Text style={styles.upcoming}>Agendado</Text>
        )}

        {match.status === 'finished' && (
          <Text style={styles.finished}>Terminado</Text>
        )}
      </View>

      {/* TEAMS */}
      <View style={styles.teams}>
        {/* HOME */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogo}>
              {homeLogo ? (
                <Image source={{ uri: homeLogo }} style={{ width: 24, height: 24 }} />
              ) : (
                <Text>🏆</Text>
              )}
            </View>
            <Text style={styles.teamName}>{match.homeOrAway === 'C' ? match.teamName : match.opponent}</Text>
          </View>

          <Text
            style={[
              styles.score,
              match.status === 'live' && { color: COLORS.secondary },
            ]}
          >
            {match.result?.split('-')[0] ?? '-'}
          </Text>
        </View>

        {/* AWAY */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogo}>
              {awayLogo ? (
                <Image source={{ uri: awayLogo }} style={{ width: 24, height: 24 }} />
              ) : (
                <Text>🏆</Text>
              )}
            </View>
            <Text style={styles.teamName}>{match.homeOrAway === 'F' ? match.teamName : match.opponent}</Text>
          </View>

          <Text
            style={[
              styles.score,
              match.status === 'live' && { color: COLORS.secondary },
            ]}
          >
            {match.result?.split('-')[1] ?? '-'}
          </Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.venue}>{match.location}</Text>
      </View>
    </TouchableOpacity>
  );
};