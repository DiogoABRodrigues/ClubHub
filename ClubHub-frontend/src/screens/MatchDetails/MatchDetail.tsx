import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PlayerLineup } from '../../components/PlayerLineup';
import { LiveBadge } from '../../components/LiveBadge';
import { COLORS } from '../../theme/colors';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './MatchDetail.styles';
import { useMatches } from '../../contexts/MatchesContext';
import { useTeams } from '../../contexts/TeamsContext';
import { formatDateWithWeekdayPT } from '../../utils/dateUtils';  
import { teamConfig } from '../../config/teamConfig';

export const MatchDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };

  const { matches, loading } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();

  const match = matches.find((m) => m.id === id);

  const [activeTab, setActiveTab] = useState<'timeline' | 'lineup' >('timeline');

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

  const homeTeamName = match.homeOrAway === 'C' ? match.teamName : match.opponent;
  const awayTeamName = match.homeOrAway === 'F' ? match.teamName : match.opponent;

  const homeLogo = teams.find(t => t.name.trim().toLowerCase() === homeTeamName.trim().toLowerCase())?.logoUrl;
  const awayLogo = teams.find(t => t.name.trim().toLowerCase() === awayTeamName.trim().toLowerCase())?.logoUrl;

  let location;

  if( homeTeamName == teamConfig.name) {
    location = teamConfig.team_stadium;
  }
  else {
    location = match.location;
  }

  return (
    <ScrollView style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do jogo</Text>

        <View style={styles.statusContainer}>
          {match.status === 'live' && <LiveBadge />}
          {match.status === 'upcoming' && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.badgeText}>Agendado</Text>
            </View>
          )}
          {match.status === 'finished' && (
            <View style={styles.fulltimeBadge}>
              <Text style={styles.badgeText}>Terminado</Text>
            </View>
          )}
        </View>

        {/* Score */}
        <View style={styles.scoreCard}>
          {/* Home */}
          <View style={styles.teamContainer}>
            <View style={styles.teamLogo}>
              {homeLogo ? (
                <Image source={{ uri: homeLogo }} style={{ width: 50, height: 50 }} />
              ) : (
                <Text>🏆</Text>
              )}
            </View>
            <Text style={styles.teamName}>{homeTeamName}</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, match.status === 'live' && { color: COLORS.textPrimary }]}>
              {match.result?.split('-')[0] ?? match.status === 'live' ? '0' : '-'}
            </Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.scoreText, match.status === 'live' && { color: COLORS.textPrimary }]}>
              {match.result?.split('-')[1] ?? match.status === 'live' ? '0' : '-'}
            </Text>
          </View>

          {/* Away */}
          <View style={styles.teamContainer}>
            <View style={styles.teamLogo}>
              {awayLogo ? (
                <Image source={{ uri: awayLogo }} style={{ width: 50, height: 50 }} />
              ) : (
                <Text>🏆</Text>
              )}
            </View>
            <Text style={styles.teamName}>{awayTeamName}</Text>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.matchInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{formatDateWithWeekdayPT(match.date)} • {match.time}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{match.location}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsList}>
          {['timeline', 'lineup'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)} style={[styles.tabTrigger, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && { color: COLORS.primary }]}>
                {tab === 'timeline' ? 'Sumário' : 'Formação'}
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
                <Text style={styles.mutedText}>Sem informação</Text>
              </View>
            )
          )}

          {activeTab === 'lineup' && (
            <>
              {match.homeLineup && <PlayerLineup players={match.homeLineup} teamName={match.homeTeam} />}
              {match.awayLineup && <PlayerLineup players={match.awayLineup} teamName={match.awayTeam} />}
              {!match.homeLineup && !match.awayLineup && (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="hourglass-half" size={36} color={COLORS.textSecondary} />
                  <Text style={styles.mutedText}>Formação não disponível</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};