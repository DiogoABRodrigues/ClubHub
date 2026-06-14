import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeviceService, DevicePayload } from "../services/DeviceService";

// Estrutura interna usada no ecrã de settings
export interface DevicePreferences {
  news: boolean;
  over19_goals: boolean;
  over19_matchday: boolean;
  over19_result: boolean;
  sub19_goals: boolean;
  sub19_matchday: boolean;
  sub19_result: boolean;
  sub17_goals: boolean;
  sub17_matchday: boolean;
  sub17_result: boolean;
  sub15_goals: boolean;
  sub15_matchday: boolean;
  sub15_result: boolean;
  sub13_goals: boolean;
  sub13_matchday: boolean;
  sub13_result: boolean;
}

// Tempo de espera antes de enviar as alterações pendentes para a API.
// Vários toggles seguidos dentro desta janela são agrupados num único PATCH.
const SAVE_DEBOUNCE_MS = 800;

const mapFromApi = (data: DevicePayload): DevicePreferences => ({
  news: data.news,
  over19_goals: data.over19_goals,
  over19_matchday: data.over19_matchday,
  over19_result: data.over19_result,
  sub19_goals: data.sub19_goals,
  sub19_matchday: data.sub19_matchday,
  sub19_result: data.sub19_result,
  sub17_goals: data.sub17_goals,
  sub17_matchday: data.sub17_matchday,
  sub17_result: data.sub17_result,
  sub15_goals: data.sub15_goals,
  sub15_matchday: data.sub15_matchday,
  sub15_result: data.sub15_result,
  sub13_goals: data.sub13_goals,
  sub13_matchday: data.sub13_matchday,
  sub13_result: data.sub13_result,
});

export const useDevicePreferences = (deviceId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["devicePreferences", deviceId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await DeviceService.getById(deviceId!);
      return mapFromApi(data);
    },
    enabled: !!deviceId,
  });

  // Alterações ainda não enviadas para a API (agrupadas por debounce).
  const pendingRef = useRef<Partial<DevicePreferences>>({});
  // Snapshot de antes da primeira alteração do lote actual, para rollback em caso de erro.
  const previousRef = useRef<DevicePreferences | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Quantos PATCHes ainda estão em curso - só refetch quando todos terminarem.
  const inFlightRef = useRef(0);

  const mutation = useMutation({
    mutationFn: (prefs: Partial<DevicePreferences>) =>
      DeviceService.updatePreferences(deviceId!, prefs),

    onError: () => {
      // Reverte para o último estado conhecido como correcto.
      if (previousRef.current) {
        queryClient.setQueryData(queryKey, previousRef.current);
      }
    },

    onSettled: () => {
      inFlightRef.current = Math.max(0, inFlightRef.current - 1);
      // Só refetch quando não houver alterações pendentes nem PATCHes em curso,
      // para não sobrescrever um toggle mais recente do utilizador com uma
      // resposta "desactualizada" de um PATCH anterior.
      if (
        inFlightRef.current === 0 &&
        Object.keys(pendingRef.current).length === 0
      ) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  const flush = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (!deviceId || Object.keys(pendingRef.current).length === 0) return;

    const toSend = pendingRef.current;
    pendingRef.current = {};
    inFlightRef.current += 1;
    mutation.mutate(toSend);
  }, [deviceId, mutation]);

  // Garante que alterações pendentes ainda não enviadas vão à API
  // mesmo que o utilizador saia do ecrã antes do debounce disparar.
  useEffect(() => {
    return () => {
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  const updatePreferences = useCallback(
    (newPrefs: Partial<DevicePreferences>) => {
      if (!deviceId) return;

      // Guarda o estado anterior à primeira alteração do lote actual,
      // para podermos repor tudo se o PATCH agrupado falhar.
      if (Object.keys(pendingRef.current).length === 0) {
        previousRef.current = queryClient.getQueryData(queryKey);
      }

      // Actualização optimista imediata - o switch responde de imediato.
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        ...newPrefs,
      }));

      // Agrupa esta alteração com as restantes do mesmo "burst" de toggles.
      pendingRef.current = { ...pendingRef.current, ...newPrefs };

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        flush();
      }, SAVE_DEBOUNCE_MS);
    },
    [deviceId, queryClient, flush],
  );

  return {
    preferences: query.data,
    loading: query.isLoading,
    updatePreferences,
    /** true enquanto há alterações pendentes ou um PATCH em curso */
    saving: mutation.isPending || Object.keys(pendingRef.current).length > 0,
  };
};