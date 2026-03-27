import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Matches.styles';
import { MatchCard } from '../../components/MatchCard';
import { COLORS } from '../../theme/colors';
import { useMatches } from '../../contexts/MatchesContext';
import { useTeams } from '../../contexts/TeamsContext';

export const Matches = ({ navigation }: any) => {
  const { matches, loading } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').toReversed();
  const finishedMatches = matches.filter((m) => m.status === 'finished');

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllFinished, setShowAllFinished] = useState(false);

  const limitMatches = (list: any[], showAll: boolean) =>
    showAll ? list : list.slice(0, 3);

  const getTeamLogo = (teamName: string) => {
    const normalized = teamName.trim().toLowerCase();

    const team = teams.find(
      t => t.name.trim().toLowerCase() === normalized
    );

    return team?.logoUrl;
  };

  const getHomeTeam = (match: any) =>
    match.homeOrAway === 'C' ? match.teamName : match.opponent;

  const getAwayTeam = (match: any) =>
    match.homeOrAway === 'F' ? match.teamName : match.opponent;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jogos e Resultados</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading matches...</Text>
        ) : (
          <>
            {/* LIVE MATCHES */}
            {liveMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: COLORS.destructive }]}>A Decorrer</Text>
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} homeLogo={getTeamLogo(getHomeTeam(match)) || ''} awayLogo={getTeamLogo(getAwayTeam(match)) || ''} onPress={() => navigation.navigate('MatchDetail', { id: match.id }) }/>
                ))}
              </View>
            )}

            {/* UPCOMING MATCHES */}
            {upcomingMatches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Próximos jogos</Text>

                  {upcomingMatches.length > 3 && (
                    <TouchableOpacity onPress={() => setShowAllUpcoming(!showAllUpcoming)}>
                      <Text style={styles.showMoreInline}>
                        {showAllUpcoming ? 'Ver menos' : 'Ver todos'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {limitMatches(upcomingMatches, showAllUpcoming).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    homeLogo={getTeamLogo(getHomeTeam(match)) || ''}
                    awayLogo={getTeamLogo(getAwayTeam(match)) || ''}
                    onPress={() => navigation.navigate('MatchDetail', { id: match.id })}
                  />
                ))}
              </View>
            )}

            {/* FINISHED MATCHES */}
            {finishedMatches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Últimos Resultados</Text>

                  {finishedMatches.length > 3 && (
                    <TouchableOpacity onPress={() => setShowAllFinished(!showAllFinished)}>
                      <Text style={styles.showMoreInline}>
                        {showAllFinished ? 'Ver menos' : 'Ver todos'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {limitMatches(finishedMatches, showAllFinished).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    homeLogo={getTeamLogo(getHomeTeam(match)) || ''}
                    awayLogo={getTeamLogo(getAwayTeam(match)) || ''}
                    onPress={() => navigation.navigate('MatchDetail', { id: match.id })}
                  />
                ))}
              </View>
            )}

            {/* NO MATCHES */}
            {matches.length === 0 && (
              <View style={styles.noMatches}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoEmoji}>⚽</Text>
                </View>
                <Text style={styles.noMatchesText}>Não foram encontrados jogos para estes filtros</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};