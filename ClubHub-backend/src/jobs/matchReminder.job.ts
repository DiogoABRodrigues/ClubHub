import cron from "node-cron";
import { Op } from "sequelize";
import Match from "../models/Match";
import { pushService } from "../services/push.service";
import deviceService from "../services/device.service";
import { getEnabledCategories } from "../config/teamConfig";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";

export const startMatchReminderJob = () => {
  cron.schedule(
    "30 10 * * *",
    async () => {
      try {
        if (!(await getNotificationsEnabled())) return;

        const today = new Date().toISOString().split("T")[0];
        const enabledCategories = getEnabledCategories();
        const matches = await Match.findAll({
          attributes: ["category"],
          where: {
            date: today,
            status: "upcoming",
            category: {
              [Op.in]: enabledCategories.map((category) => category.category),
            },
          },
          raw: true,
        });
        const categoriesWithMatches = new Set(
          matches.map((match) => match.category),
        );

        for (const config of enabledCategories) {
          if (!categoriesWithMatches.has(config.category)) continue;

          const devices = await deviceService.getDevicesForMatchday(
            config.category,
          );
          if (!devices.length) continue;

          const title =
            config.category === "over19"
              ? "Dia de jogo!"
              : `Dia de jogo, ${config.label}!`;
          const body = `Hoje é dia de jogo! Não te esqueças de apoiar o ${config.teamName}!`;

          await pushService.sendToDevices(devices, { title, body });
        }
      } catch (error) {
        console.error("Erro no lembrete de jogo:", error);
      }
    },
    { timezone: "Europe/Lisbon" },
  );
};
