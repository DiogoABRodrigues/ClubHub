import { queryClient } from "../lib/queryClient";
import { socket } from "../services/socket";
import { useEffect } from "react";

export const SocketProvider = ({ children }: any) => {
  useEffect(() => {
    socket.connect();

    socket.on("match:update", (match) => {
      // A query key real é ["matches", seasonId, category]. setQueriesData
      // com queryKey:["matches"] e exact:false (default) faz partial match,
      // ou seja, atualiza a(s) query(ies) ["matches", seasonId, category]
      // que já estiverem em cache, sem precisarmos de saber o seasonId/category
      // activos.
      queryClient.setQueriesData<any[]>({ queryKey: ["matches"] }, (old) =>
        old?.some((m) => m.id === match.id)
          ? old.map((m) => (m.id === match.id ? match : m))
          : old,
      );
    });

    socket.on("match:event", ({ matchId, event }) => {
      queryClient.setQueriesData<any[]>({ queryKey: ["matches"] }, (old) =>
        old?.map((m) => {
          if (m.id !== matchId) return m;
          const exists = m.events?.some((e: any) => e.id === event.id);
          const updatedEvents = exists
            ? m.events.map((e: any) => (e.id === event.id ? event : e))
            : [...(m.events ?? []), event];
          return { ...m, events: updatedEvents };
        }),
      );
    });

    socket.on("data:updated", () => {
      queryClient.invalidateQueries();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return children;
};