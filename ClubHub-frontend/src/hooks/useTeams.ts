import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "../services/TeamService";

export const useTeams = () => {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: TeamService.getAll,
    staleTime: Infinity,
  });

  return {
    teams: teamsQuery.data ?? [],
    loading: teamsQuery.isLoading,
    refreshTeams: () => queryClient.invalidateQueries({ queryKey: ["teams"] }),
  };
};
