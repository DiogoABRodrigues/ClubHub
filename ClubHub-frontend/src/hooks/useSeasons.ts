import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SeasonService } from "../services/SeasonService";
import { Season } from "../models/Season";

/** Todas as seasons (sem filtro) */
export const useSeasons = () => {
  const queryClient = useQueryClient();

  const seasonsQuery = useQuery({
    queryKey: ["seasons"],
    queryFn: SeasonService.getAll,
    staleTime: Infinity,
  });

  return {
    seasons: seasonsQuery.data ?? [],
    loading: seasonsQuery.isLoading,
    refreshSeasons: () =>
      queryClient.invalidateQueries({ queryKey: ["seasons"] }),
  };
};

/** Seasons disponíveis para uma categoria específica */
export const useSeasonsByCategory = (category: string) => {
  const query = useQuery<Season[]>({
    queryKey: ["seasons", "byCategory", category],
    queryFn: () => SeasonService.getByCategory(category),
    staleTime: Infinity,
  });

  return {
    seasons: query.data ?? [],
    loading: query.isLoading,
  };
};
