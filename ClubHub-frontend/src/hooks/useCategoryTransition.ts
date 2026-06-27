import { useEffect } from "react";
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

  useEffect(() => {
    if (!isCategoryChanging || !selectedSeasonId) return;

    const matchesKey = ["matches", selectedSeasonId, selectedCategory];
    const standingsKey = ["standings", selectedSeasonId, selectedCategory];
    const seasonMatchesKey = ["matches", selectedSeasonId];
    const seasonStandingsKey = ["standings", selectedSeasonId];

    let settled = false;
    let unsubscribe = () => {};
    let maxTimeout: ReturnType<typeof setTimeout> | null = null;

    const finish = () => {
      if (settled) return;
      settled = true;
      unsubscribe();
      if (maxTimeout) {
        clearTimeout(maxTimeout);
        maxTimeout = null;
      }
      acknowledgeCategoryChange();
    };

    const checkReady = () => {
      if (settled) return;

      const matchState = queryClient.getQueryState(matchesKey);
      const standingsState = queryClient.getQueryState(standingsKey);
      const seasonMatchState = queryClient.getQueryState(seasonMatchesKey);
      const seasonStandingsState = queryClient.getQueryState(seasonStandingsKey);

      const matchesReady =
        matchState?.status === "success" || matchState?.status === "error";
      const standingsReady =
        standingsState?.status === "success" ||
        standingsState?.status === "error";
      const seasonMatchesReady =
        seasonMatchState?.status === "success" || seasonMatchState?.status === "error";
      const seasonStandingsReady =
        seasonStandingsState?.status === "success" || seasonStandingsState?.status === "error";

      if (matchesReady || standingsReady || seasonMatchesReady || seasonStandingsReady) {
        finish();
      }
    };

    // Verifica logo de início - os dados podem já estar em cache (cache hit).
    checkReady();

    // Reage a eventos da query cache em vez de fazer polling.
    if (!settled) {
      unsubscribe = queryClient.getQueryCache().subscribe(() => {
        checkReady();
      });
    }

    // Fallback: esconde sempre depois de 2.5s no máximo
    maxTimeout = setTimeout(finish, 2500);

    return () => {
      settled = true;
      unsubscribe();
      if (maxTimeout) clearTimeout(maxTimeout);
    };
  }, [
    isCategoryChanging,
    selectedSeasonId,
    selectedCategory,
    queryClient,
    acknowledgeCategoryChange,
  ]);
}