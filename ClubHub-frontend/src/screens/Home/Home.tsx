import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './Home.styles';

import { mockMatches, mockNews } from '../../data/mockData';
import { MatchCard } from '../../components/MatchCard';

// ICONS (vamos substituir lucide-react)
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export const Home = ({ navigation }: any) => {
  // lógica
  const featuredMatch =
    mockMatches.find((m) => m.status === 'live') ||
    mockMatches.find((m) => m.status === 'upcoming');

  const recentNews = mockNews.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FC Titans</Text>
            <Text style={styles.subtitle}>Official Fan Hub</Text>
          </View>

          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🏆</Text>
          </View>
        </View>

        {/* FEATURED MATCH */}
        {featuredMatch && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="trophy-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.sectionTitle}>
                {featuredMatch.status === 'live' ? 'Live Now' : 'Next Match'}
              </Text>
            </View>

            <MatchCard match={featuredMatch} onPress={() => navigation.navigate('MatchDetail', { id: featuredMatch.id })} />
          </View>
        )}

        {/* RECENT MATCHES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>

          {mockMatches
            .filter((m) => m.status === 'finished')
            .slice(0, 2)
            .map((match) => (
              <MatchCard key={match.id} match={match} onPress={() => navigation.navigate('MatchDetail', { id: match.id })} />
            ))}
        </View>

        {/* NEWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest News</Text>

          {recentNews.map((news) => (
            <TouchableOpacity
              key={news.id}
              style={styles.newsCard}
              onPress={() => navigation.navigate('NewsDetail', { id: news.id })}
              activeOpacity={0.7} // controla a intensidade da animação
            >
              <View style={styles.newsImage}>
                <Text style={styles.newsEmoji}>⚽</Text>
              </View>

              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsExcerpt}>{news.excerpt}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};