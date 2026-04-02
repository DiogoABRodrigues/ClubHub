import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { MatchService } from "../services/MatchService";
import { MatchEventService } from "../services/MatchEventService";
import { LineupService } from "../services/LineupService";

import { Match } from "../models/Match";
import { MatchEvent } from "../models/MatchEvent";
import { Lineup } from "../models/Lineup";

export const useMatches = () => {
  const queryClient = useQueryClient();

  // ─────────────────────────────
  // GET MATCHES
  // ─────────────────────────────
  const matchesQuery = useQuery({
    queryKey: ["matches"],
    queryFn: MatchService.getByCurrentSeasonId,
    select: (matches: Match[]) =>
      matches.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
  });

  // ─────────────────────────────
  // UPDATE MATCH
  // ─────────────────────────────
  const updateMatch = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Match> }) =>
      MatchService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  // ─────────────────────────────
  // START MATCH
  // ─────────────────────────────
  const startMatch = async (id: number) => {
    const matches = queryClient.getQueryData<Match[]>(["matches"]);

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
        date: new Date().toISOString(),
      },
    });
  };

  // ─────────────────────────────
  // PAUSE MATCH
  // ─────────────────────────────
  const pauseMatch = async (id: number) => {
    await updateMatch.mutateAsync({
      id,
      data: { status: "halftime" },
    });
  };

  // ─────────────────────────────
  // FINISH MATCH
  // ─────────────────────────────
  const finishMatch = async (id: number, outcome: "V" | "D" | "E") => {
    await updateMatch.mutateAsync({
      id,
      data: { status: "finished", outcome },
    });
  };

  // ─────────────────────────────
  // ADD MATCH EVENT
  // ─────────────────────────────
  const addMatchEvent = async (id: number, event: MatchEvent) => {
    const match = queryClient
      .getQueryData<Match[]>(["matches"])
      ?.find((m) => m.id === id);

    if (!match) return;

    const createdEvent = await MatchEventService.create(match.id, event);

    const updatedEvents = [...(match.events ?? []), createdEvent];

    queryClient.setQueryData<Match[]>(["matches"], (old) =>
      old?.map((m) => (m.id === id ? { ...m, events: updatedEvents } : m)),
    );

    // update result logic (igual ao teu)
    const houseGame = match.homeOrAway === "C";
    let result = match.result || "0-0";
    let [goalsFor, goalsAgainst] = result.split("-").map(Number);

    if (event.type === "goal") {
      const isForUs = !event.isOpponent;

      if (isForUs && houseGame) goalsFor++;
      else if (isForUs && !houseGame) goalsAgainst++;
      else if (!isForUs && houseGame) goalsAgainst++;
      else goalsFor++;

      await updateMatch.mutateAsync({
        id,
        data: { result: `${goalsFor}-${goalsAgainst}` },
      });
    }
  };

  // ─────────────────────────────
  // DELETE MATCH EVENT
  // ─────────────────────────────
  const deleteMatchEvent = async (id: number, event: MatchEvent) => {
    if (!event.id) return;

    const match = queryClient
      .getQueryData<Match[]>(["matches"])
      ?.find((m) => m.id === id);

    if (!match) return;

    await MatchEventService.delete(event.id);

    const updatedEvents = match.events?.filter((e) => e.id !== event.id) ?? [];

    queryClient.setQueryData<Match[]>(["matches"], (old) =>
      old?.map((m) => (m.id === id ? { ...m, events: updatedEvents } : m)),
    );

    if (event.type === "goal") {
      const houseGame = match.homeOrAway === "C";
      let result = match.result || "0-0";
      let [goalsFor, goalsAgainst] = result.split("-").map(Number);

      const isForUs = !event.isOpponent;

      if (isForUs && houseGame) goalsFor--;
      else if (isForUs && !houseGame) goalsAgainst--;
      else if (!isForUs && houseGame) goalsAgainst--;
      else goalsFor--;

      await updateMatch.mutateAsync({
        id,
        data: { result: `${goalsFor}-${goalsAgainst}` },
      });
    }
  };

  // ─────────────────────────────
  // SAVE LINEUP
  // ─────────────────────────────
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

    queryClient.setQueryData<Match[]>(["matches"], (old) =>
      old?.map((m) =>
        m.id === matchId ? { ...m, Lineups: createdLineups } : m,
      ),
    );
  };

  return {
    matches: matchesQuery.data ?? [],
    loading: matchesQuery.isLoading,
    refreshMatches: () =>
      queryClient.invalidateQueries({ queryKey: ["matches"] }),

    updateMatch: updateMatch.mutate,
    startMatch,
    pauseMatch,
    finishMatch,
    addMatchEvent,
    deleteMatchEvent,
    saveLineup,
  };
};
