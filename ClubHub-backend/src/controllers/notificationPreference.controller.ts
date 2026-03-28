import { Request, Response } from "express";
import * as preferenceService from "../services/notificationPreference.service";

export const addOrUpdatePreference = async (req: Request, res: Response) => {
  const { deviceId, teamId, matchId, events } = req.body;
  if (!deviceId || !teamId || !events) return res.status(400).json({ message: "Missing fields" });

  const pref = await preferenceService.addOrUpdatePreference(deviceId, teamId, matchId ?? null, events);
  res.status(200).json(pref);
};

export const removePreference = async (req: Request, res: Response) => {
  const { deviceId, teamId, matchId } = req.body;
  await preferenceService.removePreference(deviceId, teamId, matchId ?? null);
  res.status(200).json({ message: "Preference removed" });
};