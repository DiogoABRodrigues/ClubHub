import cron from "node-cron";
import Match from "../models/Match";
import { pushService } from "../services/push.service";
import deviceService from "../services/device.service";
import { teamConfig, getEnabledCategories } from "../config/teamConfig";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";

export const startMatchReminderJob = () => {
  cron.schedule(
    "30 10 * * *",
    async () => {
      try {
        const settings = await getNotificationsEnabled();
        if (!settings) return;

        const today = new Date().toISOString().split("T")[0];
        const enabledCategories = getEnabledCategories();

        // Envia notificação separada por escalão, filtrando por categoria já na BD
        for (const cfg of enabledCategories) {
          const categoryMatches = await Match.findAll({
            where: { date: today, status: "upcoming", category: cfg.category },
          });
          if (!categoryMatches.length) continue;

          const devices = await deviceService.getDevicesForMatchday(
            cfg.category,
          );
          if (!devices.length) continue;

          const title =
            cfg.category === "over19"
              ? "Dia de jogo!"
              : `Dia de jogo, ${cfg.label}!`;
          const body = `Hoje é dia de jogo! Não te esqueças de apoiar o ${cfg.teamName}!`;

          const response = await pushService.sendToDevices(devices, {
            title,
            body,
          });
          await pushService.handleReceipts(response);
          console.log(`✅ Notificação de jogo enviada para ${cfg.label}`);
        }
      } catch (err) {
        console.error("❌ Cron error:", err);
      }
    },
    { timezone: "Europe/Lisbon" },
  );
};