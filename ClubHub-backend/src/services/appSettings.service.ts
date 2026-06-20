import AppSettings from "../models/AppSettings";
import { redis } from "../config/redis";

const SETTINGS_CACHE_PREFIX = "app:settings:key:";

class AppSettingsService {
  private cacheKey(key: string) {
    return `${SETTINGS_CACHE_PREFIX}${key}`;
  }

  async get(key: string): Promise<string | null> {
    const cacheKey = this.cacheKey(key);

    const cached = await redis.get(cacheKey);
    if (cached !== null) return cached === "__null__" ? null : cached;

    const setting = await AppSettings.findOne({ where: { key } });
    const value = setting?.value ?? null;

    await redis.set(cacheKey, value ?? "__null__");

    return value;
  }

  async set(key: string, value: string): Promise<void> {
    await AppSettings.upsert({ key, value });

    await redis.del(this.cacheKey(key));

  }

  async isNotificationsEnabled(): Promise<boolean> {
    const value = await this.get("notifications_enabled");
    return value === "true";
  }
}

export default new AppSettingsService();
