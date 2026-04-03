import cron from "node-cron";
import Match from "../models/Match";
import { pushService } from "../services/push.service";
import deviceService from "../services/device.service";
import AppSettings from "../models/AppSettings";

export const startMatchReminderJob = () => {
  // ⏰ Todos os dias às 10:30
  cron.schedule("30 10 * * *", async () => {
    try {
      // 🔒 Ver se notificações estão ativas
      const settings = await AppSettings.findOne({
        where: { key: "notifications_enabled" },
      });
      const rawValue = settings?.dataValues.value;

      const notificationsEnabled =
        rawValue === true ||
        rawValue === "true" ||
        rawValue === 1 ||
        rawValue === "1";

      if (!notificationsEnabled) return;

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

      // 🔔 Enviar notificação para cada jogo
      for (const match of matches) {
        const title = "Jogo hoje!";

        const body =
          "Hoje é dia de jogo! Não te esqueças de apoiar o teu clube!";

        const response = await pushService.sendToDevices(devices, {
          title,
          body,
        });

        await pushService.handleReceipts(response);
      }

      console.log("✅ Notifications sent");
    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });
};
