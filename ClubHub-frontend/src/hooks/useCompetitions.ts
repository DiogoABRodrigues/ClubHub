import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CompetitionService } from "../services/CompetitionService";
import { Competition } from "../models/Competition";

export const useCompetitions = () => {
  const queryClient = useQueryClient();

  // ─────────────────────────────
  // GET competitions
  // ─────────────────────────────
  const competitionsQuery = useQuery({
    queryKey: ["competitions"],
    queryFn: CompetitionService.getAll,
  });

  // ─────────────────────────────
  // REFRESH
  // ─────────────────────────────
  const refreshCompetitions = () => {
    queryClient.invalidateQueries({ queryKey: ["competitions"] });
  };

  return {
    competitions: competitionsQuery.data ?? [],
    loading: competitionsQuery.isLoading,
    refreshCompetitions,
  };
};
