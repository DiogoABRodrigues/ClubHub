import React, { createContext, useState, useEffect, useContext } from "react";
import { Competition } from "../models/Competition";
import { CompetitionService } from "../services/CompetitionService";

interface CompetitionContextType {
  competitions: Competition[];
  loading: boolean;
  refreshCompetitions: () => Promise<void>;
}

const CompetitionContext = createContext<CompetitionContextType>({
  competitions: [],
  loading: true,
  refreshCompetitions: async () => {},
});

export const CompetitionsProvider = ({ children }: any) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const dbCompetitions = await CompetitionService.getAll();
      setCompetitions(dbCompetitions);
    } catch (err) {
      console.error("Erro a buscar competitions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <CompetitionContext.Provider
      value={{ competitions, loading, refreshCompetitions: fetchCompetitions }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetitions = () => useContext(CompetitionContext);
