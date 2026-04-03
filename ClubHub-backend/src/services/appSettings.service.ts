import AppSettings from "../models/AppSettings";
import { redis } from "../config/redis";

class AppSettingsService {
  private CACHE_KEY = "app:settings:notifications";

  async get(key: string): Promise<string | null> {
    const cached = await redis.get(key);
    if (cached !== null) return cached;

    const setting = await AppSettings.findOne({ where: { key } });

    if (!setting) return null;

    await redis.set(key, setting.value);

    return setting.value;
  }

  async set(key: string, value: string): Promise<void> {
    await AppSettings.upsert({ key, value });

    await redis.set(key, value);
  }

  async isNotificationsEnabled(): Promise<boolean> {
    const value = await this.get("notifications_enabled");
    return value !== "false";
  }
}

export default new AppSettingsService();