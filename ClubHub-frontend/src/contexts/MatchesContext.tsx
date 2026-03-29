import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { Alert } from "react-native";
import { Match } from "../models/Match";
import { MatchService } from "../services/MatchService";
import { LineupService } from "../services/LineupService";
import { Lineup } from "../models/Lineup";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MatchesContextType {
  matches: Match[];
  loading: boolean;
  refreshMatches: () => Promise<void>;

  updateMatch: (id: number, updates: Partial<Match>) => Promise<void>;
  saveMatch: (id: number, updates: Partial<Match>) => Promise<void>;

  startMatch: (id: number) => Promise<void>;
  pauseMatch: (id: number) => Promise<void>;
  finishMatch: (id: number) => Promise<void>;

  addMatchEvent: (id: number, event: any) => Promise<void>;

  saveLineup: (matchId: number, entries: { playerId: number | string; isStarting: boolean }[]) => Promise<void>;
}

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
  addMatchEvent: async () => {},
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
      dbMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  const updateLocalMatch = useCallback((id: number, updatedMatch: Match) => {
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
    async (id: number, updates: Partial<Match>) => {
      await updateMatch(id, updates);
    },
    [updateMatch]
  );

  // ─── Controlo de jogo ────────────────────────────────────────────────────────

  const startMatch = useCallback(
    async (id: number) => {
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
    async (id: number) => {
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

  const addMatchEvent = useCallback(
    async (id: number, event: any) => {
      const match = matches.find((m) => String(m.id) === String(id));
      if (!match) return;
      const updatedEvents = [...(match.events ?? []), event];
      await updateMatch(id, { events: updatedEvents });
    },
    [matches, updateMatch]
  );

  const saveLineup = useCallback(
  async (
    matchId: number,
    entries: { playerId: number | string; isStarting: boolean }[]
  ) => {
    try {
      // 1. Apaga a formação existente
      await LineupService.deleteByMatch(matchId);

      // 2. Cria a nova formação
      const createdLineups: Lineup[] = await Promise.all(
        entries.map((entry) =>
          LineupService.create({
            matchId,
            playerId: Number(entry.playerId),
            isStarting: entry.isStarting,
          })
        )
      );

      // 3. Atualiza o state
      setMatches((prev) =>
        prev.map((match) => {
          if (match.id !== matchId) return match;
          return { ...match, Lineups: createdLineups };
        })
      );
    } catch (err) {
      console.error("Erro ao guardar lineup:", err);
      throw err;
    }
  },
  []
);

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
        addMatchEvent,
        saveLineup,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);