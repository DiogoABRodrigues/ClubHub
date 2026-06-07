import { useQuery } from "@tanstack/react-query";
import { SeasonService } from "../services/SeasonService";
import { Season } from "../models/Season";

/**
 * Devolve a época atual calculada pelo backend (lógica mês >= 8).
 * Todos os outros hooks devem depender deste para filtrar dados.
 */
export const useCurrentSeason = () => {
  const query = useQuery<Season>({
    queryKey: ["season", "current"],
    queryFn: SeasonService.getByCurrentSeasonId,
    staleTime: 1000 * 60 * 60, // 1h — a época não muda durante o dia
  });

  return {
    currentSeason: query.data ?? null,
    currentSeasonId: query.data?.id ?? null,
    loading: query.isLoading,
  };
};