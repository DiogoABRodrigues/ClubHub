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

    socket.on("match:event", ({ matchId, event }) => {
      queryClient.setQueryData(["matches"], (old: any[]) =>
        old?.map((m) =>
          m.id === matchId ? { ...m, events: [...(m.events ?? []), event] } : m,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return children;
};
