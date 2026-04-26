import cron from "node-cron";
import Match from "../models/Match";
import { pushService } from "../services/push.service";
import deviceService from "../services/device.service";
import AppSettings from "../models/AppSettings";
import { teamConfig } from "../config/teamConfig";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";

export const startMatchReminderJob = () => {
  
  cron.schedule("30 10 * * *", async () => {
    try {
      
      const settings = await getNotificationsEnabled();

      if (!settings) return;

      const today = new Date().toISOString().split("T")[0];

      const matches = await Match.findAll({
        where: { date: today },
      });

      if (!matches.length) {
        console.log("No matches today");
        return;
      }

      const devices = await deviceService.getDevicesForMatchday();

      if (!devices.length) return;

      
        const title = "Dia de jogo!";

        const body =
          "Hoje é dia de jogo! Não te esqueças de apoiar o " + teamConfig.name + "!";

        const response = await pushService.sendToDevices(devices, {
          title,
          body,
        });

        await pushService.handleReceipts(response);

      console.log("✅ Notifications sent");
    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  },
  {
    timezone: "Europe/Lisbon",
  }
);
};
