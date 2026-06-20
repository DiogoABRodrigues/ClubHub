import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
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

export const SelectedSeasonProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { selectedCategory } = useCategory();
  const { seasons } = useSeasonsByCategory(selectedCategory);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const prevCategory = useRef(selectedCategory);

  // Quando a categoria muda, reseta imediatamente (evita mostrar season errada)
  useEffect(() => {
    if (prevCategory.current !== selectedCategory) {
      prevCategory.current = selectedCategory;
      setSelectedSeason(null);
    }
  }, [selectedCategory]);

  // Quando as seasons disponíveis carregam/mudam, seleciona a mais recente
  useEffect(() => {
    if (!seasons.length) return;
    if (
      selectedSeason &&
      seasons.some((season) => season.id === selectedSeason.id)
    ) {
      return;
    }
    const latest = seasons.reduce((best, s) => {
      const bestYear = parseInt(best.year.split("/")?.[0] ?? "0");
      const sYear = parseInt(s.year.split("/")?.[0] ?? "0");
      return sYear > bestYear ? s : best;
    });
    setSelectedSeason(latest);
    // Avisa o CategoryContext que já temos season - os dados vão começar a carregar
    // O overlay será escondido quando os dados ficarem prontos (ver useCategoryDataReady)
  }, [seasons, selectedSeason]);

  const value = useMemo(
    () => ({
      selectedSeason,
      setSelectedSeason,
      selectedSeasonId: selectedSeason?.id ?? null,
      availableSeasons: seasons,
    }),
    [selectedSeason, seasons],
  );

  return (
    <SelectedSeasonContext.Provider value={value}>
      {children}
    </SelectedSeasonContext.Provider>
  );
};

export const useSelectedSeason = () => useContext(SelectedSeasonContext);
