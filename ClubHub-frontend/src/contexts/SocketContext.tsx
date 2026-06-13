import { queryClient } from "../lib/queryClient";
import { socket } from "../services/socket";
import { useEffect } from "react";

export const SocketProvider = ({ children }: any) => {
  useEffect(() => {
    socket.connect();

    socket.on("match:update", (match) => {
      queryClient.setQueryData(["matches"], (old: any[]) =>
        old?.map((m) => (m.id === match.id ? match : m)),
      );
    });

    /*socket.on("match:event", ({ matchId, event }) => {
      queryClient.setQueryData(["matches"], (old: any[]) =>
        old?.map((m) =>
          m.id === matchId ? { ...m, events: [...(m.events ?? []), event] } : m,
        ),
      );
    });*/
    socket.on("match:event", ({ matchId, event }) => {
      queryClient.setQueryData(["matches"], (old: any[]) =>
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

    return () => {
      socket.disconnect();
    };
  }, []);

  return children;
};
