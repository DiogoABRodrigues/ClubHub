import { queryClient } from "../lib/queryClient";
import { socket } from "../services/socket";
import { useEffect } from "react";

export const SocketProvider = ({ children }: any) => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("🔴 socket connect_error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("🟡 socket disconnected:", reason);
    });

    socket.on("match:update", (match) => {
      queryClient.setQueriesData<any[]>(
        { queryKey: ["matches"] },
        (old) =>
          old?.some((m) => m.id === match.id)
            ? old.map((m) => (m.id === match.id ? match : m))
            : old,
      );
    });

    socket.on("match:event", ({ matchId, event }) => {
      queryClient.setQueriesData<any[]>(
        { queryKey: ["matches"] },
        (old) =>
          old?.map((m) => {
            if (m.id !== matchId) return m;

            const exists = m.events?.some((e: any) => e.id === event.id);

            const updatedEvents = exists
              ? m.events.map((e: any) =>
                  e.id === event.id ? event : e,
                )
              : [...(m.events ?? []), event];

            return { ...m, events: updatedEvents };
          }),
      );
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("match:update");
      socket.off("match:event");

      socket.disconnect();
    };
  }, []);

  return children;
};