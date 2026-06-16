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
      matches.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
  });

  const updateMatch = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Match> }) =>
      MatchService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches", currentSeasonId, selectedCategory],
      });
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
      data: { status: "live", date: new Date().toISOString() },
    });
  };

  const pauseMatch = async (id: number) => {
    await updateMatch.mutateAsync({ id, data: { status: "halftime" } });
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
    const createdEvent = await MatchEventService.create(id, event);

    queryClient.setQueriesData<Match[]>({ queryKey: ["matches"] }, (old) =>
      old?.map((m) => {
        if (m.id !== id) return m;
        return { ...m, events: [...(m.events ?? []), createdEvent] };
      }),
    );
  };

  const deleteMatchEvent = async (id: number, event: MatchEvent) => {
    if (!event.id) return;

    await MatchEventService.delete(event.id);

    queryClient.setQueriesData<Match[]>({ queryKey: ["matches"] }, (old) =>
      old?.map((m) => {
        if (m.id !== id) return m;
        return { ...m, events: m.events?.filter((e) => e.id !== event.id) ?? [] };
      }),
    );
  };

  const saveLineup = async (
    matchId: number,
    entries: { playerId: number | string; isStarting: boolean }[],
  ) => {
    await LineupService.deleteByMatch(matchId);

    const createdLineups: Lineup[] = await Promise.all(
      entries.map((e) =>
        LineupService.create({
          matchId,
          playerId: Number(e.playerId),
          isStarting: e.isStarting,
        }),
      ),
    );

    queryClient.setQueryData<Match[]>(
      ["matches", currentSeasonId, selectedCategory],
      (old) =>
        old?.map((m) =>
          m.id === matchId ? { ...m, Lineups: createdLineups } : m,
        ),
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