import React, {
  createContext, useContext, useState, useEffect, useMemo,
} from "react";
import { useSeasonsByCategory } from "../hooks/useSeasons";
import { useCategory } from "./CategoryContext";
import { Season } from "../models/Season";

interface SelectedSeasonContextType {
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season) => void;
  selectedSeasonId: number | null;
  /** Seasons disponíveis para a categoria activa */
  availableSeasons: Season[];
}

const SelectedSeasonContext = createContext<SelectedSeasonContextType>({
  selectedSeason: null,
  setSelectedSeason: () => {},
  selectedSeasonId: null,
  availableSeasons: [],
});

export const SelectedSeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCategory } = useCategory();
  const { seasons } = useSeasonsByCategory(selectedCategory);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  // Quando a categoria muda, reseta imediatamente (evita mostrar season errada)
  useEffect(() => {
    setSelectedSeason(null);
  }, [selectedCategory]);

  // Quando as seasons disponíveis carregam/mudam, seleciona a mais recente
  useEffect(() => {
    if (!seasons.length) return;
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
    availableSeasons: seasons,
  }), [selectedSeason, seasons]);

  return (
    <SelectedSeasonContext.Provider value={value}>
      {children}
    </SelectedSeasonContext.Provider>
  );
};

export const useSelectedSeason = () => useContext(SelectedSeasonContext);