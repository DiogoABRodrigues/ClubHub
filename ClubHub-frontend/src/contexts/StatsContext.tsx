import React, { createContext, useState, useEffect, useContext } from "react";
import { Stats } from "../models/Stats";
import { StatsService } from "../services/StatsService";

interface StatsContextType {
  stats: Stats[];
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType>({
  stats: [],
  loading: true,
  refreshStats: async () => {},
});

export const StatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const allStats = await StatsService.getAll();
      setStats(allStats);
    } catch (err) {
      console.error("Erro a buscar stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats: fetchStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
