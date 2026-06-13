import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCategory } from "../contexts/CategoryContext";
import { useSelectedSeason } from "../contexts/Selectedseasoncontext";

/**
 * Observa quando os dados da nova categoria/season ficam prontos
 * e chama acknowledgeCategoryChange() para esconder o overlay.
 *
 * Deve ser montado numa raiz que viva dentro de todos os providers
 * (ex: dentro do AppNavigator ou num wrapper no App.tsx).
 */
export function useCategoryTransition() {
  const { selectedCategory, isCategoryChanging, acknowledgeCategoryChange } =
    useCategory();
  const { selectedSeasonId } = useSelectedSeason();
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isCategoryChanging || !selectedSeasonId) return;

    const clear = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    };

    const checkReady = () => {
      const matchState = queryClient.getQueryState([
        "matches",
        selectedSeasonId,
        selectedCategory,
      ]);
      const standingsState = queryClient.getQueryState([
        "standings",
        selectedSeasonId,
        selectedCategory,
      ]);

      const matchesReady =
        matchState?.status === "success" || matchState?.status === "error";
      const standingsReady =
        standingsState?.status === "success" ||
        standingsState?.status === "error";

      // Basta um dos dois estar pronto para esconder
      if (matchesReady || standingsReady) {
        clear();
        acknowledgeCategoryChange();
      }
    };

    // Polling a cada 80ms
    intervalRef.current = setInterval(checkReady, 80);

    // Fallback: esconde sempre depois de 2.5s no máximo
    maxTimeoutRef.current = setTimeout(() => {
      clear();
      acknowledgeCategoryChange();
    }, 2500);

    return clear;
  }, [isCategoryChanging, selectedSeasonId, selectedCategory]);
}
