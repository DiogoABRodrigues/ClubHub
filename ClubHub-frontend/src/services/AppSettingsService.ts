import { api } from "./api";
import { AppSettings, AppSettingsKey } from "../models/AppSettings";

export const AppSettingsService = {
  getAll: async (): Promise<AppSettings[]> => {
    const { data } = await api.get("/app-settings");
    return data;
  },

  get: async (key: AppSettingsKey): Promise<boolean> => {
    const { data } = await api.get(`/app-settings/settings`);
    return Boolean(data?.notificationsEnabled);
  },

  toggle: async (value: boolean): Promise<boolean> => {
    const { data } = await api.post("/app-settings/notifications/toggle", {
      value,
    });
    return Boolean(data?.notificationsEnabled);
  },
};