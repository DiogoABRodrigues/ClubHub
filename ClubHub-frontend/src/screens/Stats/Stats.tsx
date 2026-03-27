import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { styles } from './Stats.styles';
import { usePlayers } from '../../contexts/PlayersContext';
import { PlayerWithStats } from '../../models/Player';

type SortField = 'games' | 'minutes' | 'goals';
type SortOrder = 'asc' | 'desc';

export function SquadStats() {
  const { players } = usePlayers();
  const [sortField, setSortField] = useState<SortField>('goals');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filtra apenas jogadores, ignora staff
  const statsPlayersOnly = useMemo(() => {
    return players.filter(
      p =>
        p.stats.position.toLowerCase() !== 'treinador' &&
        p.stats.position.toLowerCase() !== 'outros técnicos'
    );
  }, [players]);

  // Ordena pela coluna selecionada
  const statsSortedPlayers = useMemo(() => {
    return [...statsPlayersOnly].sort((a, b) => {
      let comp = 0;
      switch (sortField) {
        case 'games':
          comp = a.stats.gamesPlayed - b.stats.gamesPlayed;
          break;
        case 'minutes':
          comp = a.stats.minutesPlayed - b.stats.minutesPlayed;
          break;
        case 'goals':
          comp = a.stats.goals - b.stats.goals;
          break;
      }
      return sortOrder === 'desc' ? -comp : comp;
    });
  }, [statsPlayersOnly, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderHeader = () => (
    <View style={styles.statsHeader}>
      <Text style={[styles.statsText, styles.statsHeaderText, { flex: 2 }]}>
        Jogador
      </Text>

      <TouchableOpacity
        style={styles.statsHeaderButton}
        onPress={() => handleSort('games')}
      >
        <Text style={styles.statsHeaderText}>Jogos</Text>
        {sortField === 'games' &&
          (sortOrder === 'desc' ? (
            <ArrowUp width={14} height={14} color="#666" />
          ) : (
            <ArrowDown width={14} height={14} color="#666" />
          ))}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statsHeaderButton}
        onPress={() => handleSort('minutes')}
      >
        <Text style={styles.statsHeaderText}>Mins</Text>
        {sortField === 'minutes' &&
          (sortOrder === 'desc' ? (
            <ArrowDown width={14} height={14} color="#666" />
          ) : (
            <ArrowDown width={14} height={14} color="#666" />
          ))}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statsHeaderButton}
        onPress={() => handleSort('goals')}
      >
        <Text style={styles.statsHeaderText}>Golos</Text>
        {sortField === 'goals' &&
          (sortOrder === 'desc' ? (
            <ArrowUp width={14} height={14} color="#666" />
          ) : (
            <ArrowDown width={14} height={14} color="#666" />
          ))}
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: PlayerWithStats }) => (
    <View style={styles.statsRow}>
      <View style={styles.playerInfo}>
        <Image
          source={
            item.photoUrl
              ? { uri: item.photoUrl }
              : require('../../../assets/player.jpg')
          }
          style={styles.statsPhoto}
          resizeMode="contain"
        />
        <Text style={styles.playerName}>{item.name}</Text>
      </View>
      <Text style={styles.statsText}>{item.stats.gamesPlayed}</Text>
      <Text style={styles.statsText}>{item.stats.minutesPlayed}</Text>
      <Text style={styles.statsText}>{item.stats.goals}</Text>
    </View>
  );

  return (
    <FlatList
      data={statsSortedPlayers}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.statsTable}
    />
  );
}