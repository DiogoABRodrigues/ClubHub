import { api } from "./api";

export interface CategoryPrefs {
  goals: boolean;
  matchday: boolean;
  result: boolean;
}

export interface DevicePayload {
  id: string;
  pushToken: string;
  platform: string;
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

export const DeviceService = {
  register: async (payload: DevicePayload): Promise<void> => {
    await api.post("/device", payload);
  },

  updatePreferences: async (
    id: string,
    payload: Partial<Omit<DevicePayload, "id" | "pushToken" | "platform">>,
  ) => {
    await api.patch(`/device/${id}`, payload);
  },

  getById: async (id: string): Promise<DevicePayload> => {
    const response = await api.get(`/device/${id}`);
    return response.data;
  },
};
