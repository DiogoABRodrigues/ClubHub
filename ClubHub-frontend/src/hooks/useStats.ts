import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StatsService } from "../services/StatsService";

export const useStats = () => {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ["stats"],
    queryFn: StatsService.getAll,
  });

  return {
    stats: statsQuery.data ?? [],
    loading: statsQuery.isLoading,
    refreshStats: () =>
      queryClient.invalidateQueries({ queryKey: ["stats"] }),
  };
};