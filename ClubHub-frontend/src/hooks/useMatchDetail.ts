import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MatchService } from "../services/MatchService";
import { Match } from "../models/Match";

export const matchDetailKey = (id: number) => ["match", id] as const;

export function useMatchDetail(id: number) {
  const queryClient = useQueryClient();
  const query = useQuery<Match>({
    queryKey: matchDetailKey(id),
    queryFn: () => MatchService.getById(id),
    enabled: Number.isInteger(id),
    initialData: () => {
      const seasonCaches = queryClient.getQueriesData<Match[]>({
        queryKey: ["matches"],
      });

      for (const [, matches] of seasonCaches) {
        const cachedMatch = matches?.find((match) => match.id === id);
        if (cachedMatch) return cachedMatch;
      }

      return undefined;
    },
    staleTime: Infinity,
  });

  return {
    match: query.data ?? null,
    loading: query.isLoading,
    refreshMatch: () =>
      queryClient.invalidateQueries({ queryKey: matchDetailKey(id) }),
  };
}
