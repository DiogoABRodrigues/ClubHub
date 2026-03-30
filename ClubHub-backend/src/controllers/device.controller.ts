import { Request, Response } from "express";
import * as deviceService from "../services/device.service";

export const registerDevice = async (req: Request, res: Response) => {
  const { deviceId, pushToken, platform } = req.body;
  if (!deviceId || !pushToken || !platform)
    return res.status(400).json({ message: "Missing fields" });

  const device = await deviceService.registerDevice(
    deviceId,
    pushToken,
    platform,
  );
  res.status(200).json(device);
};
