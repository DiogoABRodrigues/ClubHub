import { Request, Response } from "express";
import appSettingsService from "../services/appSettings.service";

class AppSettingsController {
  async toggleNotifications(req: Request, res: Response) {
    const { enabled } = req.body;

    await appSettingsService.set(
      "notifications_enabled",
      String(enabled)
    );

    return res.json({
      success: true,
      notificationsEnabled: enabled,
    });
  }

  async getSettings(req: Request, res: Response) {
    const enabled = await appSettingsService.isNotificationsEnabled();

    return res.json({
      notificationsEnabled: enabled,
    });
  }
}

export default new AppSettingsController();