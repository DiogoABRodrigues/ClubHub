import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../models/Player";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";

export const usePlayers = () => {
  const queryClient = useQueryClient();
  const { selectedSeasonId: currentSeasonId } = useSelectedSeason();

  const playersQuery = useQuery({
    queryKey: ["players", currentSeasonId],
    queryFn: () => PlayerService.getBySeasonId(currentSeasonId!),
    enabled: !!currentSeasonId,
    select: (players: Player[]) => players,
  });

  const allPlayersQuery = useQuery({
    queryKey: ["players-all", currentSeasonId],
    queryFn: () => PlayerService.getAllBySeasonId(currentSeasonId!),
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

  const updateSquadStatusMutation = useMutation({
    mutationFn: ({
      playerExternalId,
      seasonId,
      status,
    }: {
      playerExternalId: number;
      seasonId: number;
      status: "active" | "left" | "error";
    }) => PlayerService.updateSquadStatus(playerExternalId, seasonId, status),
    onMutate: async ({ playerExternalId, status }) => {
      // Optimistic update em ambas as queries
      await queryClient.cancelQueries({ queryKey: ["players", currentSeasonId] });
      await queryClient.cancelQueries({ queryKey: ["players-all", currentSeasonId] });
      queryClient.setQueryData<Player[]>(["players", currentSeasonId], (old) =>
        old?.map((p) =>
          p.externalId === playerExternalId ? { ...p, squadStatus: status } : p,
        ),
      );
      queryClient.setQueryData<Player[]>(["players-all", currentSeasonId], (old) =>
        old?.map((p) =>
          p.externalId === playerExternalId ? { ...p, squadStatus: status } : p,
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players", currentSeasonId] });
      queryClient.invalidateQueries({ queryKey: ["players-all", currentSeasonId] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["players", currentSeasonId] });
      queryClient.invalidateQueries({ queryKey: ["players-all", currentSeasonId] });
    },
  });

  // Apenas jogadores ativos — para o ecrã público do plantel
  const getActivePlayers = (): Player[] => {
    return (
      playersQuery.data?.filter((p) => (p.squadStatus ?? "active") === "active") ?? []
    );
  };

  // Ativos + quem saiu ("left") — não inclui erros
  const getVisiblePlayers = (): Player[] => {
    return (
      playersQuery.data?.filter(
        (p) => (p.squadStatus ?? "active") !== "error",
      ) ?? []
    );
  };

  return {
    players: playersQuery.data ?? [],
    allPlayers: allPlayersQuery.data ?? [],
    loading: playersQuery.isLoading,
    refreshPlayers: playersQuery.refetch,
    updatePlayer: updatePlayerMutation.mutate,
    updateSquadStatus: updateSquadStatusMutation.mutate,
    getActivePlayers,
    getVisiblePlayers,
  };
};