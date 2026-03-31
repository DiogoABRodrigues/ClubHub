import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StandingService } from "../services/StandingService";
import { Standing } from "../models/Standing";

export const useStandings = () => {
  const queryClient = useQueryClient();

  const standingsQuery = useQuery({
    queryKey: ["standings"],
    queryFn: StandingService.getByCurrentSeasonId,
  });

  return {
    standings: standingsQuery.data ?? [],
    loading: standingsQuery.isLoading,
    refreshStandings: () =>
      queryClient.invalidateQueries({ queryKey: ["standings"] }),
  };
};