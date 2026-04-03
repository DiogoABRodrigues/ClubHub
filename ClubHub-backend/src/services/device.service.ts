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
    await Device.upsert(data);
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

    return updatedRows;
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

  async getDeviceById(id: string) {
    return Device.findByPk(id);
  }
}

export default new DeviceService();
