import { useEffect } from "react";
import { Match } from "../models/Match";
import { queryClient } from "../lib/queryClient";
import { socket } from "../services/socket";
import { matchDetailKey } from "../hooks/useMatchDetail";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleMatchUpdate = (match: Match) => {
      queryClient.setQueryData(matchDetailKey(match.id), match);
      queryClient.setQueriesData<Match[]>({ queryKey: ["matches"] }, (old) =>
        old?.map((current) =>
          current.id === match.id ? { ...current, ...match } : current,
        ),
      );
    };

    const handleDataUpdated = () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          ["matches", "players", "players-all", "standings", "stats", "teams"]
            .includes(String(query.queryKey[0])),
      });
    };

    socket.on("match:update", handleMatchUpdate);
    socket.on("data:updated", handleDataUpdated);
    socket.connect();

    return () => {
      socket.off("match:update", handleMatchUpdate);
      socket.off("data:updated", handleDataUpdated);
      socket.disconnect();
    };
  }, []);

  return children;
};
