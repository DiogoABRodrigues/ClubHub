import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from './Squad.styles';
import { usePlayers } from '../../contexts/PlayersContext';
import { PlayerWithStats } from '../../models/Player';

type SortField = 'games' | 'minutes' | 'goals';
type SortOrder = 'asc' | 'desc';

export function SquadScreen() {
  const { players } = usePlayers();

  const [sortField, setSortField] = useState<SortField>('goals');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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


    return (
    <FlatList
      data={groupedByPosition}
      keyExtractor={(item, index) => `${item.position}-${index}`}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 16 }}>
          <View style={styles.positionHeader}>
            <Text style={styles.positionHeaderText}>{item.position}</Text>
          </View>

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
                  <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">{player.name}</Text>
                  <View style={styles.playerInfoRow}>
                    <Text style={styles.position}>{player.stats.position}</Text>
                    {player.age && <Text>{player.age} anos</Text>}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
      contentContainerStyle={styles.squadList}
    />
  );
}