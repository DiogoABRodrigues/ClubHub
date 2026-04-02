import Device from "../models/Device";

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
    const [device] = await Device.upsert(data);
    return device;
  }

  async updatePreferences(
    id: string,
    preferences: { goals?: boolean; matchday?: boolean; result?: boolean; news?: boolean },
  ) {
    await Device.update(preferences, { where: { id } });
  }

  async getDevicesForGoals() {
    return Device.findAll({
      where: { goals: true },
    });
  }

  async getDevicesForMatchday() {
    return Device.findAll({
      where: { matchday: true },
    });
  }

  async getDevicesForResults() {
    return Device.findAll({
      where: { result: true },
    });
  }

  async getDevicesForNews() {
    return Device.findAll({
      where: { news: true },
    });
  }

  async deleteByTokens(tokens: string[]) {
    await Device.destroy({
      where: {
        pushToken: tokens,
      },
    });
  }
}

export default new DeviceService();