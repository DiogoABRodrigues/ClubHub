import React, { createContext, useState, useEffect, useContext } from 'react';
import { Team } from '../models/Team';
import { TeamService } from '../services/TeamService';

interface TeamsContextType {
  teams: Team[];
  loading: boolean;
  refreshTeams: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType>({
  teams: [],
  loading: true,
  refreshTeams: async () => {},
});

export const TeamsProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const allTeams = await TeamService.getAll();
      setTeams(allTeams);
    } catch (err) {
      console.error('Erro a buscar teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, loading, refreshTeams: fetchTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => useContext(TeamsContext);