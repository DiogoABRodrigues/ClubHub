import React, { createContext, useState, useEffect, useContext } from "react";
import { PlayerWithStats, Player } from "../models/Player";
import { PlayerService } from "../services/PlayerService";
import { useStats } from "./StatsContext";

interface PlayersContextType {
  players: PlayerWithStats[];
  loading: boolean;
  refreshPlayers: () => Promise<void>;
  updatePlayer: (id: number, data: Partial<Player>) => Promise<void>;
  getActivePlayers: () => PlayerWithStats[];
}

const PlayersContext = createContext<PlayersContextType>({
  players: [],
  loading: true,
  refreshPlayers: async () => {},
  updatePlayer: async () => {},
  getActivePlayers: () => [],
});

export const PlayersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const { stats } = useStats(); // stats do StatsContext

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const allPlayers: Player[] = await PlayerService.getByCurrentSeasonId();

      const emptyStats = {
        playerExternalId: -1,
        position: "N/A",
        number: 0,
        age: 0,
        gamesPlayed: 0,
        goals: 0,
        minutesPlayed: 0,
        seasonId: -1,
      };
      // Combinar cada jogador com o seu stats (se houver)
      const playersWithStats: PlayerWithStats[] = allPlayers.map((player) => {
        const playerStats =
          stats.find((s) => s.playerExternalId === player.externalId) ||
          emptyStats;
        return { ...player, stats: playerStats };
      });

      setPlayers(playersWithStats);
    } catch (err) {
      console.error("Erro a buscar players:", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayer = async (id: number, data: Partial<Player>) => {
    try {
      await PlayerService.updatePlayer(id, data);

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...data }
            : p
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar player:", error);
    }
  };

  const getActivePlayers = () => {
    return players.filter((p) => p.stillOnTeam === true);
  };

  useEffect(() => {
    fetchPlayers();
  }, [stats]); // refetch quando os stats mudarem

  return (
    <PlayersContext.Provider
      value={{ players, loading, refreshPlayers: fetchPlayers, updatePlayer, getActivePlayers }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => useContext(PlayersContext);
