import React, { createContext, useState, useEffect, useContext } from 'react';
import { Standing } from '../models/Standing';
import { StandingService } from '../services/StandingService';

interface StandingsContextType {
  standings: Standing[];
  loading: boolean;
  refreshStandings: () => Promise<void>;
}

const StandingsContext = createContext<StandingsContextType>({
  standings: [],
  loading: true,
  refreshStandings: async () => {},
});

export const StandingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = async () => {
    setLoading(true);
    try {
      const allStandings = await StandingService.getByCurrentSeasonId();
      setStandings(allStandings);
    } catch (err) {
      console.error('Erro a buscar classificações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  return (
    <StandingsContext.Provider value={{ standings, loading, refreshStandings: fetchStandings }}>
      {children}
    </StandingsContext.Provider>
  );
};

export const useStandings = () => useContext(StandingsContext);