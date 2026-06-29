import cron from "node-cron";
import { Op } from "sequelize";
import Match from "../models/Match";
import { pushService } from "../services/push.service";
import deviceService from "../services/device.service";
import { getEnabledCategories } from "../config/teamConfig";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";
import { redis } from "../config/redis";

const REMINDER_HOUR = 10;
const REMINDER_MINUTE = 30;

function lisbonNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

function isReminderDue(now = lisbonNow()) {
  return (
    now.hour > REMINDER_HOUR ||
    (now.hour === REMINDER_HOUR && now.minute >= REMINDER_MINUTE)
  );
}

export const runMatchReminderJob = async () => {
  try {
    const now = lisbonNow();
    if (!isReminderDue(now)) return;
    if (!(await getNotificationsEnabled())) return;

    const enabledCategories = getEnabledCategories();
    const matches = await Match.findAll({
      attributes: ["category"],
      where: {
        date: now.date,
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

      const sentKey = `notifications:matchday:sent:${now.date}:${config.category}`;
      const claimed = await redis.set(sentKey, "1", {
        NX: true,
        EX: 60 * 60 * 36,
      });
      if (claimed === null) continue;

      try {
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
      } catch (error) {
        await redis.del(sentKey);
        throw error;
      }
    }
  } catch (error) {
    console.error("Erro no lembrete de jogo:", error);
  }
};

export const startMatchReminderJob = () => {
  cron.schedule(
    "*/15 10-23 * * *",
    () => void runMatchReminderJob(),
    { timezone: "Europe/Lisbon" },
  );
};
