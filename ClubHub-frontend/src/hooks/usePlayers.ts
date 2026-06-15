import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../models/Player";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";
import { useCategory } from "../contexts/CategoryContext";
import { useAuth } from "../contexts/AuthContext";
import { useMemo } from "react";

export const usePlayers = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { selectedSeasonId: currentSeasonId } = useSelectedSeason();
  const { selectedCategory } = useCategory();

  const playersQuery = useQuery({
    queryKey: ["players", currentSeasonId, selectedCategory],
    queryFn: () =>
      PlayerService.getBySeasonId(currentSeasonId!, selectedCategory),
    enabled: !!currentSeasonId,
  });

  const allPlayersQuery = useQuery({
    queryKey: ["players-all", currentSeasonId, selectedCategory],
    queryFn: () =>
      PlayerService.getAllBySeasonId(currentSeasonId!, selectedCategory),
    enabled: !!currentSeasonId && isAdmin,
  });

  const activePlayers = useMemo(() => {
    return (
      playersQuery.data?.filter(
        (p) => (p.squadStatus ?? "active") === "active",
      ) ?? []
    );
  }, [playersQuery.data]);

  const visiblePlayers = useMemo(() => {
    return (
      playersQuery.data?.filter(
        (p) => (p.squadStatus ?? "active") !== "error",
      ) ?? []
    );
  }, [playersQuery.data]);

  const updatePlayerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Player> }) =>
      PlayerService.updatePlayer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["players", currentSeasonId, selectedCategory],
      });
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
    }) =>
      PlayerService.updateSquadStatus(
        playerExternalId,
        seasonId,
        status,
        selectedCategory,
      ),

    onMutate: async ({ playerExternalId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["players", currentSeasonId, selectedCategory],
      });

      await queryClient.cancelQueries({
        queryKey: ["players-all", currentSeasonId, selectedCategory],
      });

      const updateFn = (old?: Player[]) =>
        old?.map((p) =>
          p.externalId === playerExternalId
            ? { ...p, squadStatus: status }
            : p,
        );

      queryClient.setQueryData(
        ["players", currentSeasonId, selectedCategory],
        updateFn,
      );

      queryClient.setQueryData(
        ["players-all", currentSeasonId, selectedCategory],
        updateFn,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["players", currentSeasonId, selectedCategory],
      });

      queryClient.invalidateQueries({
        queryKey: ["players-all", currentSeasonId, selectedCategory],
      });
    },

    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["players", currentSeasonId, selectedCategory],
      });

      queryClient.invalidateQueries({
        queryKey: ["players-all", currentSeasonId, selectedCategory],
      });
    },
  });

  return {
    players: playersQuery.data ?? [],
    allPlayers: allPlayersQuery.data ?? [],

    loading: playersQuery.isLoading,
    refreshPlayers: playersQuery.refetch,

    updatePlayer: updatePlayerMutation.mutate,
    updateSquadStatus: updateSquadStatusMutation.mutate,

    // 🔥 agora está estável + memoizado
    getActivePlayers: () => activePlayers,
    getVisiblePlayers: () => visiblePlayers,
  };
};