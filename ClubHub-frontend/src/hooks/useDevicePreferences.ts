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

  const query = useQuery({
    queryKey: ["devicePreferences", deviceId],
    queryFn: async () => {
      const data = await DeviceService.getById(deviceId!);
      return mapFromApi(data);
    },
    enabled: !!deviceId,
  });

  const mutation = useMutation({
    mutationFn: (prefs: Partial<DevicePreferences>) =>
      DeviceService.updatePreferences(deviceId!, prefs),

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
