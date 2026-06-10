import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StandingService } from "../services/StandingService";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";
import { useCategory } from "../contexts/CategoryContext";

export const useStandings = () => {
  const queryClient = useQueryClient();
  const { selectedSeasonId: currentSeasonId } = useSelectedSeason();
  const { selectedCategory } = useCategory();

  const standingsQuery = useQuery({
    queryKey: ["standings", currentSeasonId, selectedCategory],
    queryFn: () => StandingService.getBySeasonId(currentSeasonId!, selectedCategory),
    enabled: !!currentSeasonId,
    staleTime: 1000 * 60 * 10,
  });

  return {
    standings: standingsQuery.data ?? [],
    loading: standingsQuery.isLoading,
    refreshStandings: () =>
      queryClient.invalidateQueries({ queryKey: ["standings", currentSeasonId, selectedCategory] }),
  };
};