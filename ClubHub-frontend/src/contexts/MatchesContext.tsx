import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { Alert } from "react-native";
import { Match } from "../models/Match";
import { MatchService } from "../services/MatchService";
import { LineupService } from "../services/LineupService";
import { Lineup } from "../models/Lineup";
import { MatchEvent } from "../models/MatchEvent";
import { MatchEventService } from "../services/MatchEventService";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MatchesContextType {
  matches: Match[];
  loading: boolean;
  refreshMatches: () => Promise<void>;

  updateMatch: (id: number, updates: Partial<Match>) => Promise<void>;
  updateLocalMatch: (id: number, updatedMatch: Match) => void;
  deleteMatchEvent: (id: number, event: MatchEvent) => Promise<void>;
  saveMatch: (id: number, updates: Partial<Match>) => Promise<void>;

  startMatch: (id: number) => Promise<void>;
  pauseMatch: (id: number) => Promise<void>;
  finishMatch: (id: number) => Promise<void>;

  addMatchEvent: (id: number, event: MatchEvent) => Promise<void>;

  saveLineup: (
    matchId: number,
    entries: { playerId: number | string; isStarting: boolean }[],
  ) => Promise<void>;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const MatchesContext = createContext<MatchesContextType>({
  matches: [],
  loading: true,
  refreshMatches: async () => {},
  updateMatch: async () => {},
  updateLocalMatch: () => {},
  saveMatch: async () => {},
  startMatch: async () => {},
  pauseMatch: async () => {},
  finishMatch: async () => {},
  addMatchEvent: async () => {},
  saveLineup: async () => {},
  deleteMatchEvent: async () => {},
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
      dbMatches.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
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
      prev.map((m) =>
        String(m.id) === String(id)
          ? { ...updatedMatch, Lineups: m.Lineups ?? [] } // mantém Lineups
          : m,
      ),
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
    [updateLocalMatch],
  );

  const saveMatch = useCallback(
    async (id: number, updates: Partial<Match>) => {
      await updateMatch(id, updates);
    },
    [updateMatch],
  );

  // ─── Controlo de jogo ────────────────────────────────────────────────────────

  const startMatch = useCallback(
    async (id: number) => {
      const alreadyLive = matches.find((m) => m.status === "live");
      if (alreadyLive) {
        Alert.alert(
          "Jogo já em direto",
          `O jogo contra ${alreadyLive.opponent} já está a decorrer. Termina-o antes de começar outro.`,
        );
        return;
      }
      await updateMatch(id, {
        status: "live",
        date: new Date().toISOString(),
      });
    },
    [matches, updateMatch],
  );

  const pauseMatch = useCallback(
    async (id: number) => {
      await updateMatch(id, { status: "halftime" });
    },
    [updateMatch],
  );

  const finishMatch = useCallback(
    async (id: number) => {
      console.log("A terminar jogo", id);
      await updateMatch(id, { status: "finished" });
    },
    [updateMatch],
  );

  const addMatchEvent = useCallback(
    async (id: number, event: MatchEvent) => {
      const match = matches.find((m) => m.id === id);
      if (!match) return;
      const createdEvent = await MatchEventService.create(match.id, event);
      
      await updateLocalMatch(match.id, {
          ...match,
          events: [...(match.events ?? []), createdEvent],
        });

      const houseGame = match.homeOrAway === "C";

      let result = match.result || "0-0";
      let [goalsFor, goalsAgainst] = result.split("-").map(Number);

      if (event.type === "goal") {
        const isForUs = !event.isOpponent;
        if (isForUs && houseGame) {
          goalsFor += 1;
        } else if (isForUs && !houseGame) {
          goalsAgainst += 1;
        } else if (!isForUs && houseGame) {
          goalsAgainst += 1;
        } else {
          goalsFor += 1;
        }
        await updateMatch(id, { result: `${goalsFor}-${goalsAgainst}` });
      }
    },
    [matches, updateMatch],
  );

  const deleteMatchEvent = useCallback(
    async (id: number, event: MatchEvent) => {
      if (!event.id) {
        console.error("Evento sem ID não pode ser apagado");
        return;
      }
      
      const match = matches.find((m) => m.id === id);
      if (!match) return;

      const updatedEvents = (match.events || []).filter(
        (e) => e.id !== event.id
      );

      await MatchEventService.delete(event.id);

      await updateLocalMatch(match.id, {
        ...match,
        events: updatedEvents,
      });

      // Atualiza resultado se for golo
      if (event.type === "goal") {
        const houseGame = match.homeOrAway === "C";
        let result = match.result || "0-0";
        let [goalsFor, goalsAgainst] = result.split("-").map(Number);

        const isForUs = !event.isOpponent;
        if (isForUs && houseGame) {
          goalsFor -= 1;
        } else if (isForUs && !houseGame) {
          goalsAgainst -= 1;
        } else if (!isForUs && houseGame) {
          goalsAgainst -= 1;
        } else {
          goalsFor -= 1;
        }

        await updateMatch(id, { result: `${goalsFor}-${goalsAgainst}` });
      }
    },
    [matches, updateMatch]
  );

  const saveLineup = useCallback(
    async (
      matchId: number,
      entries: { playerId: number | string; isStarting: boolean }[],
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
            }),
          ),
        );

        // 3. Atualiza o state
        setMatches((prev) =>
          prev.map((match) => {
            if (match.id !== matchId) return match;
            return { ...match, Lineups: createdLineups };
          }),
        );
      } catch (err) {
        console.error("Erro ao guardar lineup:", err);
        throw err;
      }
    },
    [],
  );

  return (
    <MatchesContext.Provider
      value={{
        matches,
        loading,
        refreshMatches: fetchMatches,
        updateMatch,
        updateLocalMatch,
        saveMatch,
        startMatch,
        pauseMatch,
        finishMatch,
        addMatchEvent,
        deleteMatchEvent,
        saveLineup,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);
