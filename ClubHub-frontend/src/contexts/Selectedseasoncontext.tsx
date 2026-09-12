import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { useSeasonsByCategory } from "../hooks/useSeasons";
import { useCategory } from "./CategoryContext";
import { Season } from "../models/Season";

interface SelectedSeasonContextType {
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season) => void;
  selectedSeasonId: number | null;
  availableSeasons: Season[];
}

const SelectedSeasonContext = createContext<SelectedSeasonContextType>({
  selectedSeason: null,
  setSelectedSeason: () => {},
  selectedSeasonId: null,
  availableSeasons: [],
});

export const SelectedSeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCategory, triggerTransition, isReady } = useCategory();
  const { seasons } = useSeasonsByCategory(selectedCategory, isReady);
  const [preferredSeason, setPreferredSeason] = useState<Season | null>(null);

  // Derive from THIS category's data in the same render. Effects previously
  // exposed the old category/season pair before resetting and selecting again.
  const selectedSeason = useMemo(() => {
    if (!isReady || !seasons.length) return null;
    const preferred = seasons.find((season) => season.id === preferredSeason?.id);
    if (preferred) return preferred;
    return seasons.reduce((latest, season) =>
      parseInt(season.year, 10) > parseInt(latest.year, 10) ? season : latest,
    );
  }, [seasons, preferredSeason, isReady]);

  const handleSetSelectedSeason = useCallback((season: Season) => {
    if (!seasons.some((available) => available.id === season.id)) return;
    if (season.id !== selectedSeason?.id) triggerTransition();
    setPreferredSeason(season);
  }, [seasons, selectedSeason?.id, triggerTransition]);

  const value = useMemo(() => ({
    selectedSeason,
    setSelectedSeason: handleSetSelectedSeason,
    selectedSeasonId: selectedSeason?.id ?? null,
    availableSeasons: seasons,
  }), [selectedSeason, handleSetSelectedSeason, seasons]);

  return <SelectedSeasonContext.Provider value={value}>{children}</SelectedSeasonContext.Provider>;
};

export const useSelectedSeason = () => useContext(SelectedSeasonContext);
