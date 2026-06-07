import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../models/Player";
import { useCurrentSeason } from "./useCurrentSeason";

export const usePlayers = () => {
  const queryClient = useQueryClient();
  const { currentSeasonId } = useCurrentSeason();

  const playersQuery = useQuery({
    queryKey: ["players", currentSeasonId],
    queryFn: () => PlayerService.getBySeasonId(currentSeasonId!),
    enabled: !!currentSeasonId,
    select: (players: Player[]) => players,
  });

  const updatePlayerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Player> }) =>
      PlayerService.updatePlayer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players", currentSeasonId] });
    },
  });

  const getActivePlayers = (): Player[] => {
    return playersQuery.data?.filter((p) => p.stillOnTeam === true) ?? [];
  };

  return {
    players: playersQuery.data ?? [],
    loading: playersQuery.isLoading,
    refreshPlayers: playersQuery.refetch,
    updatePlayer: updatePlayerMutation.mutate,
    getActivePlayers,
  };
};