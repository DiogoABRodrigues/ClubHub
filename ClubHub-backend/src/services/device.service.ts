import Device from "../models/Device";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export type NotificationType = "goals" | "matchday" | "result";
export type CategoryKey = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

class DeviceService {
  async upsertDevice(data: {
    id: string;
    pushToken: string;
    platform: "android" | "ios";
    news?: boolean;
    over19_goals?: boolean;
    over19_matchday?: boolean;
    over19_result?: boolean;
    sub19_goals?: boolean;
    sub19_matchday?: boolean;
    sub19_result?: boolean;
    sub17_goals?: boolean;
    sub17_matchday?: boolean;
    sub17_result?: boolean;
    sub15_goals?: boolean;
    sub15_matchday?: boolean;
    sub15_result?: boolean;
    sub13_goals?: boolean;
    sub13_matchday?: boolean;
    sub13_result?: boolean;
  }) {
    const [device] = await Device.upsert(data, { returning: true });
    await cache.clearPattern("devices:*");
    return device;
  }

  async updatePreferences(
    id: string,
    preferences: Partial<Omit<Device, "id" | "pushToken" | "platform">>,
  ) {
    const [updatedRows] = await Device.update(preferences, { where: { id } });
    await cache.clearPattern("devices:*");
    return updatedRows;
  }

  async getDevicesForGoals(category: CategoryKey = "over19") {
    const col = `${category}_goals` as keyof Device;
    const key = CacheKeys.devices.goals(category);
    const cached = await cache.get(key) as Device[] | null;
    if (cached) return cached;
    const data = await Device.findAll({ where: { [col]: true } });
    await cache.set(key, data, 600);
    return data;
  }

  async getDevicesForMatchday(category: CategoryKey = "over19") {
    const col = `${category}_matchday` as keyof Device;
    const key = CacheKeys.devices.matchday(category);
    const cached = await cache.get(key) as Device[] | null;
    if (cached) return cached;
    const data = await Device.findAll({ where: { [col]: true } });
    await cache.set(key, data, 600);
    return data;
  }

  async getDevicesForResults(category: CategoryKey = "over19") {
    const col = `${category}_result` as keyof Device;
    const key = CacheKeys.devices.results(category);
    const cached = await cache.get(key) as Device[] | null;
    if (cached) return cached;
    const data = await Device.findAll({ where: { [col]: true } });
    await cache.set(key, data, 600);
    return data;
  }

  async getDevicesForNews() {
    const key = CacheKeys.devices.news;
    const cached = await cache.get(key) as Device[] | null;
    if (cached) return cached;
    const data = await Device.findAll({ where: { news: true } });
    await cache.set(key, data, 600);
    return data;
  }

  async deleteByTokens(tokens: string[]) {
    await Device.destroy({ where: { pushToken: tokens } });
    await cache.clearPattern("devices:*");
  }

  async getDeviceById(id: string) {
    return Device.findByPk(id);
  }

  async getAllDevices() {
    const cached = await cache.get<Device[]>(CacheKeys.devices.all);
    if (cached) return cached;

    const devices = await Device.findAll();
    await cache.set(CacheKeys.devices.all, devices, 600);
    return devices;
  }
}

export default new DeviceService();
