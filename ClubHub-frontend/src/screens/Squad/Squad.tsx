import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Users, BarChart3, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Squad.styles';
import { usePlayers } from '../../contexts/PlayersContext';
import { PlayerWithStats } from '../../models/Player';
import { TeamCategory } from '../../data/mockData';

type SortField = 'games' | 'minutes' | 'goals';
type SortOrder = 'asc' | 'desc';

export function SquadScreen() {
  const navigation = useNavigation();
  const { players } = usePlayers();

  const [view, setView] = useState<'squad' | 'stats'>('squad');
  const [sortField, setSortField] = useState<SortField>('goals');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Ordem personalizada: Guarda-Redes, Defesa, Médio, Avançado, Treinador, Equipa Técnica
  const positionOrder: { [key: string]: number } = {
    'Guarda Redes': 1,
    'Defesa': 2,
    'Médio': 3,
    'Avançado': 4,
    'Treinador': 5,
    'Outros Técnicos': 6,
  };

  // Função para mapear a posição do jogador para uma das 5 categorias principais
  const mapToMainPosition = (position: string): string => {
    const pos = position?.toLowerCase() || '';
    
    if (pos === 'guarda redes') return 'Guarda Redes';
    if (['rb', 'cb', 'lb', 'defesa'].includes(pos)) return 'Defesa';
    if (['cm', 'cam', 'médio'].includes(pos)) return 'Médio';
    if (['rw', 'lw', 'st', 'avançado'].includes(pos)) return 'Avançado';
    if (pos === 'treinador') return 'Treinador';
    if (pos === 'outros técnicos') return 'Outros Técnicos';
    
    return 'Médio'; // fallback
  };

  // Lista de jogadores ordenada pela ordem das posições e número
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const posA = positionOrder[mapToMainPosition(a.stats?.position || '')] || 99;
      const posB = positionOrder[mapToMainPosition(b.stats?.position || '')] || 99;
      if (posA !== posB) return posA - posB;
      return a.stats.number - b.stats.number;
    });
  }, [players]);

  // Função para lidar com a ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Se já está ordenado por este campo, inverte a ordem
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // Se é um novo campo, ordena por ele em ordem decrescente
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const statsPlayersOnly = useMemo(() => {
    return players.filter(p => p.stats.position.toLowerCase() !== "treinador" && p.stats.position.toLowerCase() !== "outros técnicos");
  }, [players]);

  // Lista de jogadores para stats (ordenada pelo campo selecionado)
  const statsSortedPlayers = useMemo(() => {
    return [...statsPlayersOnly].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'games':
          comparison = a.stats.gamesPlayed - b.stats.gamesPlayed;
          break;
        case 'minutes':
          comparison = a.stats.minutesPlayed - b.stats.minutesPlayed;
          break;
        case 'goals':
          comparison = a.stats.goals - b.stats.goals;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [players, sortField, sortOrder]);

  // Agrupa jogadores por posição principal
  const groupedByPosition = useMemo(() => {
    const groups: { position: string; players: PlayerWithStats[] }[] = [];
    let currentPos: string | null = null;
    let currentGroup: PlayerWithStats[] = [];

    for (const player of sortedPlayers) {
      const pos = mapToMainPosition(player.stats?.position || '');
      if (pos !== currentPos) {
        if (currentGroup.length) groups.push({ position: currentPos!, players: currentGroup });
        currentPos = pos;
        currentGroup = [];
      }
      currentGroup.push(player);
    }
    if (currentGroup.length) groups.push({ position: currentPos!, players: currentGroup });

    return groups;
  }, [sortedPlayers]);

  // Render para Stats
  const renderStatsItem = ({ item }: { item: PlayerWithStats }) => (
    <View style={styles.statsRow}>
      <View style={styles.playerInfo}>
        <Image
          source={item.photoUrl ? { uri: item.photoUrl } : require("../../../assets/player.jpg")}
          style={styles.statsPhoto}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.playerName}>{item.name}</Text>
        </View>
      </View>
      <Text style={styles.statsText}>{item.stats.gamesPlayed}</Text>
      <Text style={styles.statsText}>{item.stats.minutesPlayed}</Text>
      <Text style={styles.statsText}>{item.stats.goals}</Text>
    </View>
  );

  // Render do header com botões clicáveis
  const renderStatsHeader = () => (
    <View style={styles.statsHeader}>
      <Text style={[styles.statsText, styles.statsHeaderText, { flex: 2 }]}>Jogador</Text>
      
      <TouchableOpacity 
        style={[styles.statsHeaderButton]} 
        onPress={() => handleSort('games')}
      >
        <Text style={styles.statsHeaderText}>Jogos</Text>
        {sortField === 'games' && (
          sortOrder === 'desc' ? 
            <ArrowDown width={14} height={14} color="#666" /> : 
            <ArrowUp width={14} height={14} color="#666" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.statsHeaderButton]} 
        onPress={() => handleSort('minutes')}
      >
        <Text style={styles.statsHeaderText}>Mins</Text>
        {sortField === 'minutes' && (
          sortOrder === 'desc' ? 
            <ArrowDown width={14} height={14} color="#666" /> : 
            <ArrowUp width={14} height={14} color="#666" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.statsHeaderButton]} 
        onPress={() => handleSort('goals')}
      >
        <Text style={styles.statsHeaderText}>Golos</Text>
        {sortField === 'goals' && (
          sortOrder === 'desc' ? 
            <ArrowDown width={14} height={14} color="#666" /> : 
            <ArrowUp width={14} height={14} color="#666" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft width={20} height={20} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Team Squad</Text>

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

      {/* Conteúdo */}
      {view === 'squad' ? (
        <FlatList
          data={groupedByPosition}
          keyExtractor={(item, index) => `${item.position}-${index}`}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              {/* Header da posição */}
              <View style={styles.positionHeader}>
                <Text style={styles.positionHeaderText}>{item.position}</Text>
              </View>

              {/* Jogadores em 2 colunas */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {item.players.map((player, idx) => (
                  <View key={`${player.id}-${idx}`} style={{ width: '48%', marginVertical: 4 }}>
                    <View style={styles.card}>
                      <View style={styles.playerPhotoWrapper}>
                        <Image
                          source={player.photoUrl ? { uri: player.photoUrl } : require("../../../assets/player.jpg")}
                          style={styles.statsPhoto}
                          resizeMode="contain"
                        />
                      </View>
                      <Text 
                        style={styles.playerName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {player.name}
                      </Text>
                      <View style={styles.playerInfoRow}>
                        <Text style={styles.position}>{player.stats.position}</Text>
                        {player.age !== null && player.age !== 0 && <Text>{player.age} anos</Text>}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          contentContainerStyle={styles.squadList}
        />
      ) : (
        <FlatList
          data={statsSortedPlayers}
          renderItem={renderStatsItem}
          ListHeaderComponent={renderStatsHeader}
          contentContainerStyle={styles.statsTable}
        />
      )}
    </View>
  );
}