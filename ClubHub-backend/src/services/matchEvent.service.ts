import MatchEvent from "../models/MatchEvent";
import Match from "../models/Match";
import MatchService from "./match.service";
import { pushService } from "./push.service";
import deviceService from "./device.service";
import type { CategoryKey } from "./device.service";
import spamGuard from "../utils/eventSpamGuard";
import { buildEventKey } from "../utils/buildEventKey";
import Player from "../models/Player";
import { teamConfig } from "../config/teamConfig";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";
import { sequelize } from "../config/database";
import { AppError } from "../errors/AppError";

class MatchEventService {
  private matchService = new MatchService();

  async createEvent(matchId: number, data: any) {
    const key = buildEventKey(data, matchId);
    if (await spamGuard.isDuplicate(key)) return null;

    const { event, match } = await sequelize.transaction(async (transaction) => {
      const match = await Match.findByPk(matchId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!match) throw new AppError("Match not found", 404);

      const event = await MatchEvent.create(
        { ...data, matchId },
        { transaction },
      );
      await this.recalculateScore(match, transaction);
      return { event, match };
    });

    await this.matchService.refreshAndBroadcast(matchId);
    await this.notify(event, "create", match);
    return event;
  }

  async updateEvent(eventId: number, data: any) {
    const { event, match } = await sequelize.transaction(async (transaction) => {
      const event = await MatchEvent.findByPk(eventId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!event) throw new AppError("Event not found", 404);

      const match = await Match.findByPk(event.matchId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!match) throw new AppError("Match not found", 404);

      await event.update(data, { transaction });
      await this.recalculateScore(match, transaction);
      return { event, match };
    });

    await this.matchService.refreshAndBroadcast(match.id);
    return event;
  }

  async deleteEvent(eventId: number) {
    const { event, match } = await sequelize.transaction(async (transaction) => {
      const event = await MatchEvent.findByPk(eventId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!event) throw new AppError("Event not found", 404);

      const match = await Match.findByPk(event.matchId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!match) throw new AppError("Match not found", 404);

      await event.destroy({ transaction });
      await this.recalculateScore(match, transaction);
      return { event, match };
    });

    await this.matchService.refreshAndBroadcast(match.id);
    if (match.status !== "finished") {
      await this.notify(event, "delete", match);
    }
    return true;
  }

  private async recalculateScore(match: Match, transaction: any) {
    const goals = await MatchEvent.findAll({
      attributes: ["isOpponent", "isOwnGoal"],
      where: { matchId: match.id, type: "goal" },
      transaction,
    });

    let ourGoals = 0;
    let opponentGoals = 0;
    for (const goal of goals) {
      const goalForUs = goal.isOwnGoal ? goal.isOpponent : !goal.isOpponent;
      if (goalForUs) ourGoals += 1;
      else opponentGoals += 1;
    }

    const result =
      match.homeOrAway === "C"
        ? `${ourGoals}-${opponentGoals}`
        : `${opponentGoals}-${ourGoals}`;
    await match.update({ result }, { transaction });
  }

  private async notify(
    event: MatchEvent,
    action: "create" | "delete",
    match: Match,
  ) {
    if (!(await getNotificationsEnabled())) return;

    const category = (match.category ?? "over19") as CategoryKey;
    const devices = await deviceService.getDevicesForGoals(category);
    if (!devices.length) return;

    const categoryLabel = this.getCategoryLabel(category);
    let title = "";
    let body = "";

    if (action === "delete") {
      title = "Correção!";
      body = `${categoryLabel}Evento de ${event.type} aos ${event.minute}' foi corrigido.`;
    } else {
      let playerName = "Adversário";
      if (!event.isOpponent) {
        const player = event.playerId
          ? await Player.findByPk(event.playerId, { attributes: ["name"] })
          : null;
        playerName = player?.name ?? teamConfig.name;
      }

      if (event.type === "goal") {
        title = category === "over19" ? "Golo!" : `Golo, ${categoryLabel}!`;
        body = `${playerName} - ${event.minute}'\n[${match.result}]`;
      } else if (event.type === "red_card") {
        title =
          category === "over19"
            ? "Vermelho 🟥"
            : `Vermelho 🟥, ${categoryLabel}!`;
        body = `${playerName} - ${event.minute}'`;
      } else {
        return;
      }
    }

    await pushService.sendToDevices(devices, { title, body });
  }

  private getCategoryLabel(category: string): string {
    if (category === "over19") return "";
    const config = teamConfig.categories.find(
      (item) => item.category === category,
    );
    return config ? `${config.label}: ` : `${category}: `;
  }
}

export default new MatchEventService();
