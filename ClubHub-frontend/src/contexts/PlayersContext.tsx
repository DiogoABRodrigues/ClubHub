import React, { createContext, useState, useEffect, useContext } from 'react';
import { PlayerWithStats, Player } from '../models/Player';
import { PlayerService } from '../services/PlayerService';
import { useStats } from './StatsContext';

interface PlayersContextType {
  players: PlayerWithStats[];
  loading: boolean;
  refreshPlayers: () => Promise<void>;
}

const PlayersContext = createContext<PlayersContextType>({
  players: [],
  loading: true,
  refreshPlayers: async () => {},
});

export const PlayersProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const { stats } = useStats(); // stats do StatsContext

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const allPlayers: Player[] = await PlayerService.getAll();

      const emptyStats = {
        playerExternalId: -1,
        position: 'N/A',
        number: 0,
        age: 0,
        gamesPlayed: 0,
        goals: 0,
        minutesPlayed: 0,
        seasonId: -1
      }
      // Combinar cada jogador com o seu stats (se houver)
      const playersWithStats: PlayerWithStats[] = allPlayers.map((player) => {
        const playerStats = stats.find(s => s.playerExternalId === player.externalId) || emptyStats;
        return { ...player, stats: playerStats };
      });

      setPlayers(playersWithStats);
    } catch (err) {
      console.error('Erro a buscar players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [stats]); // refetch quando os stats mudarem

  return (
    <PlayersContext.Provider value={{ players, loading, refreshPlayers: fetchPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => useContext(PlayersContext);