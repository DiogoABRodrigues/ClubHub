import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SeasonService } from "../services/SeasonService";

export const useSeasons = () => {
  const queryClient = useQueryClient();

  const seasonsQuery = useQuery({
    queryKey: ["seasons"],
    queryFn: SeasonService.getAll,
  });

  return {
    seasons: seasonsQuery.data ?? [],
    loading: seasonsQuery.isLoading,
    refreshSeasons: () =>
      queryClient.invalidateQueries({ queryKey: ["seasons"] }),
  };
};
