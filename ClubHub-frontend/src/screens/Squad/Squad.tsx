import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { squadPlayers, TeamCategory, SquadPlayer } from '../../data/mockData';
import { Users, BarChart3, ArrowLeft } from 'lucide-react-native'; // usar versão RN
import { useNavigation } from '@react-navigation/native';
import { styles } from './Squad.styles';

export function SquadScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>('Senior');
  const [view, setView] = useState<'squad' | 'stats'>('squad');

  const categories: TeamCategory[] = ['Senior', 'U19', 'U17', 'U15'];
  const players = squadPlayers[selectedCategory];

  // Ordem das posições
  const positionOrder: { [key: string]: number } = {
    GK: 1, RB: 2, CB: 3, LB: 4, CM: 5, CAM: 6, RW: 7, LW: 8, ST: 9,
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const posA = positionOrder[a.position] || 99;
    const posB = positionOrder[b.position] || 99;
    if (posA !== posB) return posA - posB;
    return a.number - b.number;
  });

  const statsSortedPlayers = [...players].sort((a, b) => b.stats.goalsScored - a.stats.goalsScored);

  const renderSquadItem = ({ item }: { item: SquadPlayer }) => (
    <View style={styles.card}>
      <View style={styles.playerPhotoWrapper}>
        <Image source={{ uri: item.photo }} style={styles.playerPhoto} />
        <View style={styles.numberBadge}>
          <Text style={styles.numberBadgeText}>{item.number}</Text>
        </View>
      </View>
      <Text style={styles.playerName}>{item.name}</Text>
      <View style={styles.playerInfoRow}>
        <Text style={styles.position}>{item.position}</Text>
        <Text>{item.age} yrs</Text>
      </View>
    </View>
  );

  const renderStatsItem = ({ item }: { item: SquadPlayer }) => (
    <View style={styles.statsRow}>
      <View style={styles.playerInfo}>
        <Image source={{ uri: item.photo }} style={styles.statsPhoto} />
        <View>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerName}>{item.position} · #{item.number}</Text>
        </View>
      </View>
      <Text style={styles.statsText}>{item.stats.matchesPlayed}</Text>
      <Text style={styles.statsText}>{item.stats.minutesPlayed}</Text>
      <Text style={[styles.statsText, item.stats.goalsScored > 0 && styles.goalsText]}>
        {item.stats.goalsScored}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft width={20} height={20} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Team Squad</Text>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
            >
              <Text style={selectedCategory === cat ? styles.categoryTextActive : styles.categoryText}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setView('squad')}
            style={[styles.toggleButton, view === 'squad' && styles.toggleButtonActive]}
          >
            <Users width={16} height={16} />
            <Text style={view === 'squad' ? styles.toggleTextActive : styles.toggleText}>Squad</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setView('stats')}
            style={[styles.toggleButton, view === 'stats' && styles.toggleButtonActive]}
          >
            <BarChart3 width={16} height={16} />
            <Text style={view === 'stats' ? styles.toggleTextActive : styles.toggleText}>Stats</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {view === 'squad' ? (
        <FlatList
          data={sortedPlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderSquadItem}
          numColumns={2}
          contentContainerStyle={styles.squadList}
        />
      ) : (
        <View style={styles.statsTable}>
          {/* Header */}
          <View style={styles.statsHeader}>
            <Text style={[styles.statsText, styles.statsHeaderText, { flex: 2 }]}>Player</Text>
            <Text style={[styles.statsText, styles.statsHeaderText]}>MP</Text>
            <Text style={[styles.statsText, styles.statsHeaderText]}>Mins</Text>
            <Text style={[styles.statsText, styles.statsHeaderText]}>Goals</Text>
          </View>
          {statsSortedPlayers.map((player) => (
            <View key={player.id}>{renderStatsItem({ item: player })}</View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

