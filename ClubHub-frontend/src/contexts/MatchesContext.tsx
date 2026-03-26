import React, { createContext, useState, useEffect, useContext } from 'react';
import { Match } from '../models/Match';
import { MatchService } from '../services/MatchService';

interface MatchesContextType {
  matches: Match[];
  loading: boolean;
  refreshMatches: () => Promise<void>;
}

const MatchesContext = createContext<MatchesContextType>({
  matches: [],
  loading: true,
  refreshMatches: async () => {},
});

export const MatchesProvider = ({ children }: any) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const dbMatches = await MatchService.getByCurrentSeasonId();
      setMatches(dbMatches);
    } catch (err) {
      console.error('Erro a buscar matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <MatchesContext.Provider value={{ matches, loading, refreshMatches: fetchMatches }}>
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);