import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Trophy, ArrowLeft } from 'lucide-react-native';
import { LeagueTableRow } from '../../components/LeagueTableRow';
import { mockStandings, TeamCategory } from '../../data/mockData';
import { styles } from './Standings.styles';

export const Standings: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>('Senior');

  const categories: TeamCategory[] = ['Senior', 'U19', 'U17'];
  const currentStandings = mockStandings.find((s) => s.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => navigation.navigate('Home' as never)}>
            <ArrowLeft width={24} height={24} color="#999" />
          </Pressable>
          <Text style={styles.headerTitle}>League Standings</Text>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category ? styles.categorySelected : styles.categoryUnselected,
              ]}
            >
              <Text
                style={
                  selectedCategory === category
                    ? styles.categoryTextSelected
                    : styles.categoryTextUnselected
                }
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {currentStandings ? (
          <View>
            {/* League Name */}
            <View style={styles.leagueHeader}>
              <Trophy width={20} height={20} color="#0ea5e9" />
              <Text style={styles.leagueTitle}>{currentStandings.league}</Text>
            </View>

            {/* Table Header */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.col1]}>#</Text>
                <Text style={[styles.tableCell, styles.col5]}>Team</Text>
                <Text style={[styles.tableCell, styles.col2, styles.centerText]}>P</Text>
                <Text style={[styles.tableCell, styles.col2, styles.centerText]}>GD</Text>
                <Text style={[styles.tableCell, styles.col2, styles.rightText]}>PTS</Text>
              </View>

              {/* Table Body */}
              {currentStandings.teams.map((team) => (
                <LeagueTableRow
                  key={team.id}
                  team={team}
                  isUserTeam={team.name.includes('FC Titans')}
                />
              ))}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#06b6d4' }]} />
                  <Text style={styles.legendText}>UEFA Champions League</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#0ea5e9' }]} />
                  <Text style={styles.legendText}>UEFA Europa League</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.legendText}>Relegation Zone</Text>
                </View>
              </View>
            </View>

            {/* Stats Explanation */}
            <Text style={styles.statsText}>P - Played | GD - Goal Difference | PTS - Points</Text>
          </View>
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No standings available for this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};