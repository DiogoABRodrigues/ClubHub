import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LeagueTableRow } from '../../components/LeagueTableRow';
import { styles } from './Standings.styles';
import { COLORS } from '../../theme/colors';
import { useStandings } from '../../contexts/StandingsContext';

export const Standings: React.FC = () => {
  const navigation = useNavigation();
  const { standings, loading } = useStandings();

  // garante ordenação por posição
  const sorted = useMemo(() => [...standings].sort((a, b) => a.position - b.position), [standings]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Classificação</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 50 }}>A carregar classificação...</Text>
        ) : sorted.length > 0 ? (
          <View style={styles.section}>
            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.col1]}>#</Text>
                <Text style={[styles.tableCell, styles.col5]}>Equipa</Text>
                <Text style={[styles.tableCell, styles.col2, styles.centerText]}>J</Text>
                <Text style={[styles.tableCell, styles.col2, styles.centerText]}>DG</Text>
                <Text style={[styles.tableCell, styles.col2, styles.rightText]}>PTS</Text>
              </View>

              {sorted.map((standing) => (
                <LeagueTableRow
                  key={standing.id}
                  standing={standing}
                  green={2}
                  red={19}
                />
              ))}
            </View>


            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Legenda</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#47d406' }]} />
                  <Text style={styles.legendText}>Campeão - Promoção à 1ª Divisão Sabseg</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#0ee950' }]} />
                  <Text style={styles.legendText}>Promoção à 1ª Divisão Sabseg</Text>
                </View>
                {/*
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.legendText}>Zona de Descida</Text>
                </View>*/}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noMatches}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🏆</Text>
            </View>
            <Text style={styles.noMatchesText}>Não há classificação disponível</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};