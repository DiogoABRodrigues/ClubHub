import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerService } from "../services/PlayerService";
import { useStats } from "../contexts/StatsContext";
import { Player, PlayerWithStats } from "../models/Player";

export const usePlayers = () => {
  const queryClient = useQueryClient();
  const { stats } = useStats();

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

  // ─────────────────────────────────────────────
  // GET PLAYERS
  // ─────────────────────────────────────────────
  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.getByCurrentSeasonId,
    select: (players: Player[]): PlayerWithStats[] => {
      return players.map((player) => {
        const playerStats =
          stats.find((s) => s.playerExternalId === player.externalId) ||
          emptyStats;

        return {
          ...player,
          stats: playerStats,
        };
      });
    },
  });

  // ─────────────────────────────────────────────
  // UPDATE PLAYER
  // ─────────────────────────────────────────────
  const updatePlayerMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Player>;
    }) => PlayerService.updatePlayer(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  // ─────────────────────────────────────────────
  // ACTIVE PLAYERS (DERIVED STATE)
  // ─────────────────────────────────────────────
  const getActivePlayers = (): PlayerWithStats[] => {
    return (
      playersQuery.data?.filter((p) => p.stillOnTeam === true) ?? []
    );
  };

  // ─────────────────────────────────────────────
  // RETURN (igual ao teu context API)
  // ─────────────────────────────────────────────
  return {
    players: playersQuery.data ?? [],
    loading: playersQuery.isLoading,
    refreshPlayers: playersQuery.refetch,
    updatePlayer: updatePlayerMutation.mutate,
    getActivePlayers,
  };
};