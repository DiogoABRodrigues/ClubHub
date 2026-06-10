import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeviceService } from "../services/DeviceService";
import { Category } from "../config/teamConfig";

const mapFromApi = (data: any) => ({
  gameDayAlerts: data.matchday,
  goals: data.goals,
  finalResult: data.result,
  newsAlerts: data.news,
  subscribedCategories: data.subscribedCategories as Category[] | null,
});

const mapToApi = (prefs: any) => ({
  goals: prefs.goals,
  matchday: prefs.gameDayAlerts,
  result: prefs.finalResult,
  news: prefs.newsAlerts,
  subscribedCategories: prefs.subscribedCategories,
});

export const useDevicePreferences = (deviceId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["devicePreferences", deviceId],
    queryFn: async () => {
      const data = await DeviceService.getById(deviceId!);
      return mapFromApi(data);
    },
    enabled: !!deviceId,
  });

  const mutation = useMutation({
    mutationFn: (prefs: any) =>
      DeviceService.updatePreferences(deviceId!, mapToApi(prefs)),

    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({ queryKey: ["devicePreferences", deviceId] });
      const previous = queryClient.getQueryData(["devicePreferences", deviceId]);
      queryClient.setQueryData(["devicePreferences", deviceId], (old: any) => ({
        ...old,
        ...newPrefs,
      }));
      return { previous };
    },

    onError: (_err, _newPrefs, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["devicePreferences", deviceId], context.previous);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devicePreferences", deviceId] });
    },
  });

  return {
    preferences: query.data,
    loading: query.isLoading,
    updatePreferences: mutation.mutate,
  };
};