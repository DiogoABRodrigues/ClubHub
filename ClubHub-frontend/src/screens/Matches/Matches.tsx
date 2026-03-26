import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Matches.styles';
import { mockMatches, TeamCategory } from '../../data/mockData';
import { MatchCard } from '../../components/MatchCard';
import { COLORS } from '../../theme/colors';

export const Matches = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory | 'All'>('All');

  const categories: Array<TeamCategory | 'All'> = ['All', 'Senior', 'U19', 'U17', 'U15'];

  const filteredMatches =
    selectedCategory === 'All'
      ? mockMatches
      : mockMatches.filter((m) => m.category === selectedCategory);

  const liveMatches = filteredMatches.filter((m) => m.status === 'live');
  const upcomingMatches = filteredMatches.filter((m) => m.status === 'upcoming');
  const finishedMatches = filteredMatches.filter((m) => m.status === 'finished');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Matches & Results</Text>
        </View>

        {/* CATEGORY FILTER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* LIVE MATCHES */}
        {liveMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: COLORS.destructive }]}>Live Now</Text>
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        )}

        {/* UPCOMING MATCHES */}
        {upcomingMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        )}

        {/* FINISHED MATCHES */}
        {finishedMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Results</Text>
            {finishedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        )}

        {/* NO MATCHES */}
        {filteredMatches.length === 0 && (
          <View style={styles.noMatches}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>⚽</Text>
            </View>
            <Text style={styles.noMatchesText}>No matches found for this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};