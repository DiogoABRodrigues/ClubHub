import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SeasonService } from "../services/SeasonService";
import { Season } from "../models/Season";

const EMPTY_SEASONS: Season[] = [];

/** Todas as seasons (sem filtro) */
export const useSeasons = () => {
  const queryClient = useQueryClient();

  const seasonsQuery = useQuery({
    queryKey: ["seasons"],
    queryFn: SeasonService.getAll,
    staleTime: Infinity,
  });

  return {
    seasons: seasonsQuery.data ?? EMPTY_SEASONS,
    loading: seasonsQuery.isLoading,
    refreshSeasons: () =>
      queryClient.invalidateQueries({ queryKey: ["seasons"] }),
  };
};

/** Seasons disponíveis para uma categoria específica */
export const useSeasonsByCategory = (category: string, enabled = true) => {
  const query = useQuery<Season[]>({
    queryKey: ["seasons", "byCategory", category],
    queryFn: () => SeasonService.getByCategory(category),
    staleTime: Infinity,
    enabled,
  });

  return {
    seasons: query.data ?? EMPTY_SEASONS,
    loading: query.isLoading,
  };
};
