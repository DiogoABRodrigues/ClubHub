import { api } from "./api";
import {
  getDeviceAccessToken,
  saveDeviceAccessToken,
} from "../storage/auth";

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
    const currentToken = await getDeviceAccessToken();
    const response = await api.post("/device", payload, {
      headers: currentToken ? { "X-Device-Token": currentToken } : undefined,
    });
    if (response.data?.deviceAccessToken) {
      await saveDeviceAccessToken(response.data.deviceAccessToken);
    }
  },

  updatePreferences: async (
    id: string,
    payload: Partial<Omit<DevicePayload, "id" | "pushToken" | "platform">>,
  ) => {
    const token = await getDeviceAccessToken();
    await api.patch(`/device/${id}`, payload, {
      headers: token ? { "X-Device-Token": token } : undefined,
    });
  },

  getById: async (id: string): Promise<DevicePayload> => {
    const token = await getDeviceAccessToken();
    const response = await api.get(`/device/${id}`, {
      headers: token ? { "X-Device-Token": token } : undefined,
    });
    return response.data;
  },
};
