import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { mockMatches } from '../../data/mockData';
import { PlayerLineup } from '../../components/PlayerLineup';
import { LiveBadge } from '../../components/LiveBadge';
import { COLORS } from '../../theme/colors';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './MatchDetail.styles';

export const MatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  const match = mockMatches.find((m) => m.id === id);

  const [activeTab, setActiveTab] = useState<'timeline' | 'lineup' | 'stats'>('timeline');

  if (!match) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.mutedText}>Match not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.primaryText, { marginTop: 8 }]}>Back to Matches</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Match Details</Text>

        <View style={styles.statusContainer}>
          {match.status === 'live' && <LiveBadge />}
          {match.status === 'upcoming' && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.badgeText}>Upcoming</Text>
            </View>
          )}
          {match.status === 'finished' && (
            <View style={styles.fulltimeBadge}>
              <Text style={styles.badgeText}>Full Time</Text>
            </View>
          )}
        </View>

        {/* Score */}
        <View style={styles.scoreCard}>
          {/* Home */}
          <View style={styles.teamContainer}>
            <View style={styles.teamCircle}>
              <Text style={styles.teamEmoji}>🏆</Text>
            </View>
            <Text style={styles.teamName}>{match.homeTeam}</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, match.status === 'live' && { color: COLORS.primary }]}>
              {match.homeScore ?? '-'}
            </Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.scoreText, match.status === 'live' && { color: COLORS.primary }]}>
              {match.awayScore ?? '-'}
            </Text>
          </View>

          {/* Away */}
          <View style={styles.teamContainer}>
            <View style={[styles.teamCircle, { backgroundColor: COLORS.surface }]}>
              <Text style={styles.teamEmoji}>⚽</Text>
            </View>
            <Text style={styles.teamName}>{match.awayTeam}</Text>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.matchInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{formatDate(match.date)} • {match.time}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{match.venue}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsList}>
          {['timeline', 'lineup', 'stats'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)} style={[styles.tabTrigger, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && { color: COLORS.primary }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.tabContent}>
          {activeTab === 'timeline' && (
            match.events && match.events.length > 0 ? (
              match.events.slice().reverse().map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventMinute}>
                    <Text style={styles.eventMinuteText}>{event.minute}'</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <View style={styles.eventTypeRow}>
                      {event.type === 'goal' && <MaterialCommunityIcons name="target" size={16} color={COLORS.success} />}
                      {event.type === 'yellow_card' && <View style={[styles.cardIcon, { backgroundColor: '#FFD700' }]} />}
                      {event.type === 'red_card' && <View style={[styles.cardIcon, { backgroundColor: COLORS.error }]} />}
                      <Text style={styles.eventTypeText}>{event.type.replace('_', ' ')}</Text>
                    </View>
                    <Text style={styles.eventPlayer}>{event.player}</Text>
                    {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome5 name="hourglass-half" size={36} color={COLORS.textSecondary} />
                <Text style={styles.mutedText}>No events yet</Text>
              </View>
            )
          )}

          {activeTab === 'lineup' && (
            <>
              {match.homeLineup && <PlayerLineup players={match.homeLineup} teamName={match.homeTeam} />}
              {match.awayLineup && <PlayerLineup players={match.awayLineup} teamName={match.awayTeam} />}
              {!match.homeLineup && !match.awayLineup && (
                <View style={styles.emptyState}>
                  <Text style={styles.mutedText}>Lineups not available yet</Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'stats' && (
            match.stats ? (
              <View style={styles.statsCard}>
                {/* Possession */}
                <View>
                  <View style={styles.statsRow}>
                    <Text style={styles.statsValue}>{match.stats.possession.home}%</Text>
                    <Text style={styles.statsLabel}>Possession</Text>
                    <Text style={styles.statsValue}>{match.stats.possession.away}%</Text>
                  </View>
                  <View style={styles.possessionBar}>
                    <View style={[styles.possessionHome, { width: `${match.stats.possession.home}%` }]} />
                    <View style={[styles.possessionAway, { width: `${match.stats.possession.away}%` }]} />
                  </View>
                </View>

                {/* Shots, Shots on Target, Corners, Fouls}
                {['shots', 'shotsOnTarget', 'corners', 'fouls'].map((stat) => (
                  <View key={stat} style={styles.statsRow}>
                    <Text style={styles.statsValue}>{match.stats && match.stats[stat as keyof typeof match.stats] ? match.stats[stat as keyof typeof match.stats].home : 0}</Text>
                    <Text style={styles.statsLabel}>{stat}</Text>
                    <Text style={styles.statsValue}>{match.stats && match.stats[stat as keyof typeof match.stats] ? match.stats[stat as keyof typeof match.stats].away : 0}</Text>
                  </View>
                ))}{*/}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome5 name="hourglass-half" size={36} color={COLORS.textSecondary} />
                <Text style={styles.mutedText}>Stats not available yet</Text>
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
};