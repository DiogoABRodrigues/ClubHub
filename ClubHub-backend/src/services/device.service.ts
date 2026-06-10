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
    subscribedCategories?: string[] | null;
  }) {
    await Device.upsert(data);
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
      subscribedCategories?: string[] | null;
    },
  ) {
    const [updatedRows] = await Device.update(preferences, { where: { id } });
    await cacheDelPattern("devices:*");
    return updatedRows;
  }

  /** Devolve dispositivos com goals=true que subscrevem este escalão */
  async getDevicesForGoals(category: string = "over19") {
    const key = `devices:goals:${category}`;
    const cached = await cacheGet(key);
    if (cached) return cached;

    const allDevices = await Device.findAll({ where: { goals: true } });
    const data = allDevices.filter((d) => this._subscribesCategory(d, category));

    await cacheSet(key, data, 600);
    return data;
  }

  async getDevicesForMatchday(category: string = "over19") {
    const key = `devices:matchday:${category}`;
    const cached = await cacheGet(key);
    if (cached) return cached;

    const allDevices = await Device.findAll({ where: { matchday: true } });
    const data = allDevices.filter((d) => this._subscribesCategory(d, category));

    await cacheSet(key, data, 600);
    return data;
  }

  async getDevicesForResults(category: string = "over19") {
    const key = `devices:results:${category}`;
    const cached = await cacheGet(key);
    if (cached) return cached;

    const allDevices = await Device.findAll({ where: { result: true } });
    const data = allDevices.filter((d) => this._subscribesCategory(d, category));

    await cacheSet(key, data, 600);
    return data;
  }

  async getDevicesForNews() {
    const key = "devices:news";
    const cached = await cacheGet(key);
    if (cached) return cached;

    const data = await Device.findAll({ where: { news: true } });
    await cacheSet(key, data, 600);
    return data;
  }

  async deleteByTokens(tokens: string[]) {
    await Device.destroy({ where: { pushToken: tokens } });
    await cacheDelPattern("devices:*");
  }

  async getDeviceById(id: string) {
    return Device.findByPk(id);
  }

  /** null = subscreve todos; array = apenas os escalões listados */
  private _subscribesCategory(device: Device, category: string): boolean {
    if (!device.subscribedCategories) return true;
    return device.subscribedCategories.includes(category);
  }
}

export default new DeviceService();