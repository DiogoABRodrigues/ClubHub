import { api } from "./api";
import { Notification } from "../models/Notification";

export const NotificationService = {
  create: async (notification: Notification): Promise<Notification> => {
    const { data } = await api.post("/notifications", notification);
    return data;
  },
};
