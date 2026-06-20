import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { MatchService } from "../services/MatchService";
import { MatchEventService } from "../services/MatchEventService";
import { LineupService } from "../services/LineupService";
import { Match } from "../models/Match";
import { MatchEvent } from "../models/MatchEvent";
import { Lineup } from "../models/Lineup";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";
import { useCategory } from "../contexts/CategoryContext";
import { matchDetailKey } from "./useMatchDetail";

export const useMatches = () => {
  const queryClient = useQueryClient();
  const { selectedSeasonId: currentSeasonId } = useSelectedSeason();
  const { selectedCategory } = useCategory();

  const matchesQuery = useQuery({
    queryKey: ["matches", currentSeasonId, selectedCategory],
    queryFn: () =>
      MatchService.getBySeasonId(currentSeasonId!, selectedCategory),
    enabled: !!currentSeasonId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    select: (matches: Match[]) =>
      [...matches].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
  });

  const updateMatch = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Match> }) =>
      MatchService.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(matchDetailKey(updated.id), updated);
      queryClient.setQueriesData<Match[]>({ queryKey: ["matches"] }, (old) =>
        old?.map((match) =>
          match.id === updated.id ? { ...match, ...updated } : match,
        ),
      );
    },
  });

  const startMatch = async (id: number) => {
    const matches = queryClient.getQueryData<Match[]>([
      "matches",
      currentSeasonId,
      selectedCategory,
    ]);
    const alreadyLive = matches?.find((m) => m.status === "live");

    if (alreadyLive) {
      Alert.alert(
        "Jogo já em direto",
        `Já existe um jogo a decorrer contra ${alreadyLive.opponent}`,
      );
      return;
    }

    await updateMatch.mutateAsync({
      id,
      data: {
        status: "live",
        date: new Date().toISOString().slice(0, 10),
      },
    });
  };

  const pauseMatch = async (id: number) => {
    await updateMatch.mutateAsync({ id, data: { statusTime: "interval" } });
  };

  const finishMatch = async (
    id: number,
    outcome: "V" | "D" | "E",
    decidedByPenalties = false,
  ) => {
    await updateMatch.mutateAsync({
      id,
      data: {
        status: "finished",
        outcome,
        ...(decidedByPenalties && { decidedByPenalties: true }),
      },
    });
  };

  const addMatchEvent = async (id: number, event: MatchEvent) => {
    await MatchEventService.create(id, event);
    await queryClient.invalidateQueries({ queryKey: matchDetailKey(id) });
  };

  const deleteMatchEvent = async (id: number, event: MatchEvent) => {
    if (!event.id) return;

    await MatchEventService.delete(event.id);

    await queryClient.invalidateQueries({ queryKey: matchDetailKey(id) });
  };

  const saveLineup = async (
    matchId: number,
    entries: { playerId: number | string; isStarting: boolean }[],
  ) => {
    const createdLineups: Lineup[] = await LineupService.replaceForMatch(
      matchId,
      entries.map((entry) => ({
        playerId: Number(entry.playerId),
        isStarting: entry.isStarting,
      })),
    );
    queryClient.setQueryData<Match>(matchDetailKey(matchId), (old) =>
      old ? { ...old, Lineups: createdLineups } : old,
    );
  };

  return {
    matches: matchesQuery.data ?? [],
    loading: matchesQuery.isLoading,
    refreshMatches: () =>
      queryClient.invalidateQueries({
        queryKey: ["matches", currentSeasonId, selectedCategory],
      }),
    updateMatch: updateMatch.mutate,
    startMatch,
    pauseMatch,
    finishMatch,
    addMatchEvent,
    deleteMatchEvent,
    saveLineup,
  };
};
