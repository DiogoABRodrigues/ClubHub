import React, { createContext, useState, useEffect, useContext } from 'react';
import { Season } from '../models/Season';
import { SeasonService } from '../services/SeasonService';

interface SeasonsContextType {
  seasons: Season[];
  loading: boolean;
  refreshSeasons: () => Promise<void>;
}

const SeasonsContext = createContext<SeasonsContextType>({
  seasons: [],
  loading: true,
  refreshSeasons: async () => {},
});

export const SeasonsProvider = ({ children }: any) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const dbSeasons = await SeasonService.getAll();
      setSeasons(dbSeasons);
    } catch (err) {
      console.error('Erro a buscar seasons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  return (
    <SeasonsContext.Provider value={{ seasons, loading, refreshSeasons: fetchSeasons }}>
      {children}
    </SeasonsContext.Provider>
  );
};

export const useSeasons = () => useContext(SeasonsContext);