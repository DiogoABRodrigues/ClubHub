import { Request, Response } from "express";
import deviceService from "../services/device.service";

class DeviceController {
  async register(req: Request, res: Response) {
    try {
      const { id, pushToken, platform, goals, matchday } = req.body;

      if (!id || !pushToken || !platform) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const device = await deviceService.upsertDevice({
        id,
        pushToken,
        platform,
        goals,
        matchday,

      });

      return res.json(device);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  async updatePreferences(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      const { goals, matchday, result, news } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing id" });
      }

      await deviceService.updatePreferences(id, { goals, matchday, result, news });

      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        return res.status(400).json({ error: "Missing id" });
      }

      const device = await deviceService.getDeviceById(id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      return res.json(device);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }
}

export default new DeviceController();