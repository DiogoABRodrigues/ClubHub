import { Request, Response } from "express";
import deviceService from "../services/device.service";
import { asyncHandler } from "../utils/asyncHandler";

class DeviceController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const {
      id, pushToken, platform,
      news,
      over19_goals, over19_matchday, over19_result,
      sub19_goals, sub19_matchday, sub19_result,
      sub17_goals, sub17_matchday, sub17_result,
      sub15_goals, sub15_matchday, sub15_result,
      sub13_goals, sub13_matchday, sub13_result,
    } = req.body;

    if (!id || !pushToken || !platform) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const device = await deviceService.upsertDevice({
      id, pushToken, platform,
      news,
      over19_goals, over19_matchday, over19_result,
      sub19_goals, sub19_matchday, sub19_result,
      sub17_goals, sub17_matchday, sub17_result,
      sub15_goals, sub15_matchday, sub15_result,
      sub13_goals, sub13_matchday, sub13_result,
    });

    return res.json(device);
  });

  updatePreferences = asyncHandler(async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const {
      news,
      over19_goals, over19_matchday, over19_result,
      sub19_goals, sub19_matchday, sub19_result,
      sub17_goals, sub17_matchday, sub17_result,
      sub15_goals, sub15_matchday, sub15_result,
      sub13_goals, sub13_matchday, sub13_result,
    } = req.body;

    await deviceService.updatePreferences(id, {
      news,
      over19_goals, over19_matchday, over19_result,
      sub19_goals, sub19_matchday, sub19_result,
      sub17_goals, sub17_matchday, sub17_result,
      sub15_goals, sub15_matchday, sub15_result,
      sub13_goals, sub13_matchday, sub13_result,
    });

    return res.json({ success: true });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const device = await deviceService.getDeviceById(id);
    if (!device) return res.status(404).json({ error: "Device not found" });

    return res.json(device);
  });
}

export default new DeviceController();
