import { api } from "./api";
import { AppSettings, AppSettingsKey } from "../models/AppSettings";

export const AppSettingsService = {
  getAll: async (): Promise<AppSettings[]> => {
    const { data } = await api.get("/app-settings");
    return data;
  },

  get: async (key: AppSettingsKey): Promise<boolean> => {
    const { data } = await api.get(`/app-settings/settings`);
    return data?.notificationsEnabled === "true";
  },

  toggle: async (key: AppSettingsKey, value: boolean): Promise<void> => {
    await api.post("/app-settings/notifications/toggle", {
      key,
      value,
    });
  },
};