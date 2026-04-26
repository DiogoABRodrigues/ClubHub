import Device from "../models/Device";
import { cacheGet, cacheSet, cacheDelPattern } from "../utils/cache";

class DeviceService {
  async upsertDevice(data: {
    id: string;
    pushToken: string;
    platform: "android" | "ios";
    goals?: boolean;
    matchday?: boolean;
    result?: boolean;
    news?: boolean;
  }) {
    await Device.upsert(data);

    // invalidar cache global de devices
    await cacheDelPattern("devices:*");

    return await Device.findByPk(data.id);
  }

  async updatePreferences(
    id: string,
    preferences: {
      goals?: boolean;
      matchday?: boolean;
      result?: boolean;
      news?: boolean;
    },
  ) {
    const [updatedRows] = await Device.update(preferences, {
      where: { id },
    });

    if (updatedRows === 0) {
      console.log("❌ No rows updated for device:", id);
    } else {
      console.log("✅ Updated device:", id);
    }

    // 🔥 importantíssimo: invalidar cache
    await cacheDelPattern("devices:*");

    return updatedRows;
  }

  async getDevicesForGoals() {
    const key = "devices:goals";

    const cached = await cacheGet(key);
    if (cached) return cached;

    const data = await Device.findAll({
      where: { goals: true },
    });

    await cacheSet(key, data, 600); // 10 min ok

    return data;
  }

  async getDevicesForMatchday() {
    const key = "devices:matchday";

    const cached = await cacheGet(key);
    if (cached) return cached;

    const data = await Device.findAll({
      where: { matchday: true },
    });

    await cacheSet(key, data, 600);

    return data;
  }

  async getDevicesForResults() {
    const key = "devices:results";

    const cached = await cacheGet(key);
    if (cached) return cached;

    const data = await Device.findAll({
      where: { result: true },
    });

    await cacheSet(key, data, 600);

    return data;
  }

  async getDevicesForNews() {
    const key = "devices:news";

    const cached = await cacheGet(key);
    if (cached) return cached;

    const data = await Device.findAll({
      where: { news: true },
    });

    await cacheSet(key, data, 600);

    return data;
  }

  async deleteByTokens(tokens: string[]) {
    await Device.destroy({
      where: {
        pushToken: tokens,
      },
    });

    await cacheDelPattern("devices:*");
  }

  async getDeviceById(id: string) {
    return Device.findByPk(id);
  }
}

export default new DeviceService();