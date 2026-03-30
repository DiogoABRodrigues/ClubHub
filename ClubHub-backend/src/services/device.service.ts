import Device from "../models/Device";

export const registerDevice = async (
  deviceId: string,
  pushToken: string,
  platform: string,
) => {
  const [device, created] = await Device.upsert(
    { id: deviceId, pushToken, platform },
    { returning: true },
  );
  return device;
};

export const getDeviceById = async (deviceId: string) => {
  return Device.findByPk(deviceId);
};
