import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { Alert } from "react-native";
import { Match } from "../models/Match";
import { MatchService } from "../services/MatchService";
import { LineupService } from "../services/LineupService";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MatchesContextType {
  matches: Match[];
  loading: boolean;
  refreshMatches: () => Promise<void>;

  updateMatch: (id: number | string, updates: Partial<Match>) => Promise<void>;
  saveMatch: (id: number | string, updates: Partial<Match>) => Promise<void>;

  startMatch: (id: number | string) => Promise<void>;
  pauseMatch: (id: number | string) => Promise<void>;
  finishMatch: (id: number | string) => Promise<void>;

  getLiveMinute: (match: Match) => number;

  addMatchEvent: (id: number | string, event: any) => Promise<void>;
  updateMatchLineup: (id: number | string, side: "home" | "away", players: string[]) => Promise<void>;

  saveLineup: (matchId: number | string, entries: { player: string; side: "home" | "away" }[]) => Promise<void>;
}

// ─── Helper: calcula minuto a partir do startedAt ─────────────────────────────

export const computeLiveMinute = (match: Match): number => {
  if (match.status !== "live" || !match.interval) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(match.date).getTime()) / 60000));
};

// ─── Contexto ─────────────────────────────────────────────────────────────────

const MatchesContext = createContext<MatchesContextType>({
  matches: [],
  loading: true,
  refreshMatches: async () => {},
  updateMatch: async () => {},
  saveMatch: async () => {},
  startMatch: async () => {},
  pauseMatch: async () => {},
  finishMatch: async () => {},
  getLiveMinute: () => 0,
  addMatchEvent: async () => {},
  updateMatchLineup: async () => {},
  saveLineup: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export const MatchesProvider = ({ children }: any) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Tick a cada 30s para re-render quando há jogo live (atualiza o minuto)
  const [, setTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const dbMatches = await MatchService.getByCurrentSeasonId();
      setMatches(dbMatches);
    } catch (err) {
      console.error("Erro a buscar matches:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // ─── Timer local (só ativo quando há jogo live) ──────────────────────────────

  useEffect(() => {
    const hasLive = matches.some((m) => m.status === "live");

    if (hasLive && !tickRef.current) {
      tickRef.current = setInterval(() => setTick((t) => t + 1), 30_000);
    } else if (!hasLive && tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [matches]);

  const updateLocalMatch = useCallback((id: number | string, updatedMatch: Match) => {
    setMatches((prev) =>
      prev.map((m) => (String(m.id) === String(id) ? updatedMatch : m))
    );
  }, []);

  const updateMatch = useCallback(
    async (id: number, updates: Partial<Match>) => {
      try {
        const updatedMatch = await MatchService.update(id, updates);
        updateLocalMatch(id, updatedMatch);
      } catch (err) {
        console.error("Erro ao atualizar jogo:", err);
        throw err;
      }
    },
    [updateLocalMatch]
  );

  const saveMatch = useCallback(
    async (id: number | string, updates: Partial<Match>) => {
      await updateMatch(id, updates);
    },
    [updateMatch]
  );

  // ─── Controlo de jogo ────────────────────────────────────────────────────────

  const startMatch = useCallback(
    async (id: number | string) => {
      const alreadyLive = matches.find((m) => m.status === "live");
      if (alreadyLive) {
        Alert.alert(
          "Jogo já em direto",
          `O jogo contra ${alreadyLive.opponent} já está a decorrer. Termina-o antes de começar outro.`
        );
        return;
      }
      await updateMatch(id, {
        status: "live",
        date: new Date().toISOString(),
      });
    },
    [matches, updateMatch]
  );

  const pauseMatch = useCallback(
    async (id: number | string) => {
      await updateMatch(id, { status: "halftime" });
    },
    [updateMatch]
  );

  const finishMatch = useCallback(
    async (id: number) => {
      console.log("A terminar jogo", id);
      await updateMatch(id, { status: "finished" });
    },
    [updateMatch]
  );

  // ─── Minuto calculado ─────────────────────────────────────────────────────────

  const getLiveMinute = useCallback((match: Match) => computeLiveMinute(match), []);

  // ─── Eventos e formações ──────────────────────────────────────────────────────

  const addMatchEvent = useCallback(
    async (id: number | string, event: any) => {
      const match = matches.find((m) => String(m.id) === String(id));
      if (!match) return;
      const updatedEvents = [...(match.events ?? []), event];
      await updateMatch(id, { events: updatedEvents });
    },
    [matches, updateMatch]
  );

  const updateMatchLineup = useCallback(
    async (id: number | string, side: "home" | "away", players: string[]) => {
      await updateMatch(id, side === "home" ? { homeLineup: players } : { awayLineup: players });
    },
    [updateMatch]
  );

  const saveLineup = useCallback(async (matchId, entries) => {
    await LineupService.replaceForMatch(matchId, entries);
    // Depois faz refresh do match para buscar a lineup atualizada
    await fetchMatches();
  }, [fetchMatches]);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <MatchesContext.Provider
      value={{
        matches,
        loading,
        refreshMatches: fetchMatches,
        updateMatch,
        saveMatch,
        startMatch,
        pauseMatch,
        finishMatch,
        getLiveMinute,
        addMatchEvent,
        updateMatchLineup,
        saveLineup,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);