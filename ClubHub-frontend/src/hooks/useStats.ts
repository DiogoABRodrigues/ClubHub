import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StatsService } from "../services/StatsService";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";
import { useCategory } from "../contexts/CategoryContext";

export const useStats = () => {
  const queryClient = useQueryClient();
  const { selectedSeasonId: currentSeasonId } = useSelectedSeason();
  const { selectedCategory } = useCategory();

  const statsQuery = useQuery({
    queryKey: ["stats", currentSeasonId, selectedCategory],
    queryFn: () =>
      StatsService.getBySeasonId(currentSeasonId!, selectedCategory),
    enabled: !!currentSeasonId,
    staleTime: 1000 * 60 * 10,
  });

  return {
    stats: statsQuery.data ?? [],
    loading: statsQuery.isLoading,
    refreshStats: () =>
      queryClient.invalidateQueries({
        queryKey: ["stats", currentSeasonId, selectedCategory],
      }),
  };
};