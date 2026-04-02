import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../models/Player";

export const usePlayers = () => {
  const queryClient = useQueryClient();
  // ─────────────────────────────────────────────
  // GET PLAYERS
  // ─────────────────────────────────────────────
  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.getByCurrentSeasonId,
    select: (players: Player[]) => players,
  });

  // ─────────────────────────────────────────────
  // UPDATE PLAYER
  // ─────────────────────────────────────────────
  const updatePlayerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Player> }) =>
      PlayerService.updatePlayer(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  // ─────────────────────────────────────────────
  // ACTIVE PLAYERS (DERIVED STATE)
  // ─────────────────────────────────────────────
  const getActivePlayers = (): Player[] => {
    return playersQuery.data?.filter((p) => p.stillOnTeam === true) ?? [];
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
