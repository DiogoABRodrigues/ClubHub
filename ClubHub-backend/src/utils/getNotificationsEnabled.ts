import AppSettings from "../models/AppSettings";

let cached: boolean | null = null;

export async function getNotificationsEnabled(): Promise<boolean> {
  if (cached !== null) return cached;
  const setting = await AppSettings.findOne({
    where: { key: "notifications_enabled" },
  });
  const v = setting?.dataValues.value;
  cached = v === true || v === "true" || v === 1 || v === "1";

  return cached;
}

export function invalidateNotificationsCache() {
  cached = null;
}
