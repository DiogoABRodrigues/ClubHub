import AppSettings from "../models/AppSettings";
import { redis } from "../config/redis";

class AppSettingsService {

  async get(key: string): Promise<string | null> {

    const setting = await AppSettings.findOne({ where: { key } });

    if (!setting) return null;

    return setting.value;
  }

  async set(key: string, value: string): Promise<void> {
    await AppSettings.upsert({ key, value });

  }

  async isNotificationsEnabled(): Promise<boolean> {
    const value = await this.get("notifications_enabled");
    return value === "true";
  }
}

export default new AppSettingsService();