import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useSeasons } from "../hooks/useSeasons";
import { Season } from "../models/Season";

interface SelectedSeasonContextType {
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season) => void;
  selectedSeasonId: number | null;
}

const SelectedSeasonContext = createContext<SelectedSeasonContextType>({
  selectedSeason: null,
  setSelectedSeason: () => {},
  selectedSeasonId: null,
});

export const SelectedSeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { seasons } = useSeasons();
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  // Quando as seasons carregam, seleciona automaticamente a mais recente
  useEffect(() => {
    if (!seasons.length || selectedSeason) return;
    const latest = seasons.reduce((best, s) => {
      const bestYear = parseInt(best.year.split("/")?.[0] ?? "0");
      const sYear = parseInt(s.year.split("/")?.[0] ?? "0");
      return sYear > bestYear ? s : best;
    });
    setSelectedSeason(latest);
  }, [seasons]);

  const value = useMemo(() => ({
    selectedSeason,
    setSelectedSeason,
    selectedSeasonId: selectedSeason?.id ?? null,
  }), [selectedSeason]);

  return (
    <SelectedSeasonContext.Provider value={value}>
      {children}
    </SelectedSeasonContext.Provider>
  );
};

export const useSelectedSeason = () => useContext(SelectedSeasonContext);