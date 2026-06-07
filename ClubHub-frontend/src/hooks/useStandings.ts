import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StandingService } from "../services/StandingService";
import { useCurrentSeason } from "./useCurrentSeason";

export const useStandings = () => {
  const queryClient = useQueryClient();
  const { currentSeasonId } = useCurrentSeason();

  const standingsQuery = useQuery({
    queryKey: ["standings", currentSeasonId],
    queryFn: () => StandingService.getBySeasonId(currentSeasonId!),
    enabled: !!currentSeasonId,
    staleTime: 1000 * 60 * 10,
  });

  return {
    standings: standingsQuery.data ?? [],
    loading: standingsQuery.isLoading,
    refreshStandings: () =>
      queryClient.invalidateQueries({ queryKey: ["standings", currentSeasonId] }),
  };
};