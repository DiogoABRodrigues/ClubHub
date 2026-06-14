import { queryClient } from "../lib/queryClient";
import { socket } from "../services/socket";
import { useEffect } from "react";

export const SocketProvider = ({ children }: any) => {
  useEffect(() => {
    socket.connect();

    socket.on("match:update", (match) => {
      // A query key real é ["matches", seasonId, category]. Em vez de
      // adivinhar qual, atualizamos todas as queries de "matches" em
      // cache que já contenham este jogo.
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["matches"] });

      for (const query of queries) {
        queryClient.setQueryData<any[]>(query.queryKey, (old) =>
          old?.some((m) => m.id === match.id)
            ? old.map((m) => (m.id === match.id ? match : m))
            : old,
        );
      }
    });

    socket.on("match:event", ({ matchId, event }) => {
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["matches"] });

      for (const query of queries) {
        queryClient.setQueryData<any[]>(query.queryKey, (old) =>
          old?.map((m) => {
            if (m.id !== matchId) return m;
            const exists = m.events?.some((e: any) => e.id === event.id);
            const updatedEvents = exists
              ? m.events.map((e: any) => (e.id === event.id ? event : e))
              : [...(m.events ?? []), event];
            return { ...m, events: updatedEvents };
          }),
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return children;
};