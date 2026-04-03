import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeviceService } from "../services/DeviceService";

const mapFromApi = (data: any) => ({
  matchStart: false,
  gameDayAlerts: data.matchday,
  goals: data.goals,
  finalResult: data.result,
  newsAlerts: data.news,
});

const mapToApi = (prefs: any) => ({
  goals: prefs.goals,
  matchday: prefs.gameDayAlerts,
  result: prefs.finalResult,
  news: prefs.newsAlerts,
});

export const useDevicePreferences = (deviceId: string | null) => {
  const queryClient = useQueryClient();

  // ─────────────────────────────
  // GET
  // ─────────────────────────────
  const query = useQuery({
    queryKey: ["devicePreferences", deviceId],
    queryFn: async () => {
      const data = await DeviceService.getById(deviceId!);
      return mapFromApi(data);
    },
    enabled: !!deviceId,
  });

  // ─────────────────────────────
  // UPDATE
  // ─────────────────────────────
  const mutation = useMutation({
    mutationFn: (prefs: any) =>
      DeviceService.updatePreferences(deviceId!, mapToApi(prefs)),

    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({
        queryKey: ["devicePreferences", deviceId],
      });

      const previous = queryClient.getQueryData([
        "devicePreferences",
        deviceId,
      ]);

      queryClient.setQueryData(["devicePreferences", deviceId], (old: any) => ({
        ...old,
        ...newPrefs,
      }));

      return { previous };
    },

    onError: (_err, _newPrefs, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["devicePreferences", deviceId],
          context.previous,
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["devicePreferences", deviceId],
      });
    },
  });
  return {
    preferences: query.data,
    loading: query.isLoading,
    updatePreferences: mutation.mutate,
  };
};
