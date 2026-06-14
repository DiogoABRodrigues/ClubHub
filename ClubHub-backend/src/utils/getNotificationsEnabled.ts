import { redis } from "../config/redis";
import AppSettings from "../models/AppSettings";

const CACHE_KEY = "app:settings:notifications_enabled";

export async function getNotificationsEnabled(): Promise<boolean> {
  const cached = await redis.get(CACHE_KEY);
  if (cached !== null) {
    return cached === "true";
  }

  const setting = await AppSettings.findOne({
    where: { key: "notifications_enabled" },
  });
  const v = setting?.dataValues.value;
  const enabled = v === true || v === "true" || v === 1 || v === "1";

  await redis.set(CACHE_KEY, enabled ? "true" : "false");

  return enabled;
}

export async function invalidateNotificationsCache() {
  await redis.del(CACHE_KEY);
}