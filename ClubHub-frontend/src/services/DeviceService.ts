import { api } from "./api";

export interface DevicePayload {
  id: string;
  pushToken: string;
  platform: string;
  goals: boolean;
  matchday: boolean;
  result: boolean;
  news: boolean;
}

export const DeviceService = {
  register: async (payload: DevicePayload): Promise<void> => {
    await api.post("/device", payload);
  },

  updatePreferences: async (id: string, payload: any) => {
      await api.patch(`/device/${id}`, payload);
    },

  getById: async (id: string): Promise<DevicePayload> => {
    const response = await api.get(`/device/${id}`);
    return response.data;
  }
};