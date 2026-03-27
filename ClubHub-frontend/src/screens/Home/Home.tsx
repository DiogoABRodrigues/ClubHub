import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './Home.styles';

import { MatchCard } from '../../components/MatchCard';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

import { useMatches } from '../../contexts/MatchesContext';
import { useTeams } from '../../contexts/TeamsContext';
import { Image } from 'react-native';

import { useNews } from '../../contexts/NewsContext';
import { formatDatePT } from '../../utils/dateUtils';

export const Home = ({ navigation }: any) => {
  const { news } = useNews();

  const recentNews = news.slice(0, 3);

  const { matches, loading } = useMatches();

  const liveMatches = matches.filter((m) => m.status === 'live');

  const { teams } = useTeams();

  // próximo jogo (primeiro upcoming)
  const nextMatch = matches
    .filter((m) => m.status === 'upcoming')
    .toReversed()[0];

  // último jogo (mais recente finished)
  const recentMatch = matches
    .filter((m) => m.status === 'finished')[0];

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

  const appTeamLogo = require("../../../assets/icon.png");
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{"Início"}</Text>
          </View>

          <View style={styles.logoCircle}>
          {appTeamLogo ? (
            <Image source={appTeamLogo} style={styles.logoCircle} />
          ) : (
            <Text>🏆</Text>
          )}
        </View>
      </View>

            {/* LIVE MATCHES */}
            {liveMatches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Text style={[styles.sectionTitle, { color: COLORS.destructive }]}>A Decorrer</Text>
                </View>
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} homeLogo={getTeamLogo(getHomeTeam(match)) || ''} awayLogo={getTeamLogo(getAwayTeam(match)) || ''} onPress={() => navigation.navigate('MatchDetail', { id: match.id }) }/>
                ))}
              </View>
            )}

        {/* Next Match */}
        {nextMatch && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.sectionTitle}>Próximo Jogo</Text>
            </View>

            <MatchCard
              match={nextMatch}
              homeLogo={getTeamLogo(getHomeTeam(nextMatch)) || ''}
              awayLogo={getTeamLogo(getAwayTeam(nextMatch)) || ''}
              onPress={() => navigation.navigate('MatchDetail', { id: nextMatch.id })}
            />
          </View>
        )}

        {/* RECENT MATCHE */}
        <View style={styles.section}>
          {recentMatch && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="time-outline" size={20} color={COLORS.secondary} />
                <Text style={styles.sectionTitle}>Último Jogo</Text>
              </View>

              <MatchCard
                match={recentMatch}
                homeLogo={getTeamLogo(getHomeTeam(recentMatch)) || ''}
                awayLogo={getTeamLogo(getAwayTeam(recentMatch)) || ''}
                onPress={() => navigation.navigate('MatchDetail', { id: recentMatch.id })}
              />
            </View>
          )}
        </View>

        {/* NEWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Notícias</Text>

          {recentNews.map((news) => (
            <TouchableOpacity
              key={news.id}
              style={styles.newsCard}
              onPress={() => navigation.navigate('NewsDetail', { id: news.id })}
              activeOpacity={0.7}
            >
              <View style={styles.relatedImage}>
                {news.image ? (
                  <Image source={{ uri: news.image }} style={styles.relatedImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.relatedImage, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.logoEmoji}>⚽</Text>
                  </View>
                )}
              </View>

              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsExcerpt}>{news.excerpt}</Text>
                <Text style={styles.relatedDate}>{formatDatePT(news.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};