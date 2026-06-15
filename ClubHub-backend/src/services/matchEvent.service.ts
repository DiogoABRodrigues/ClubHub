import MatchEvent from "../models/MatchEvent";
import Match from "../models/Match";
import MatchService from "./match.service";
import { pushService } from "./push.service";
import deviceService from "./device.service";
import spamGuard from "../utils/eventSpamGuard";
import { buildEventKey } from "../utils/buildEventKey";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import socketService from "./socket.service";
import Player from "../models/Player";
import { teamConfig } from "../config/teamConfig";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";

class MatchEventService {
  private matchService = new MatchService();

  async createEvent(matchId: number, data: any) {
    const key = buildEventKey(data, matchId);

    if (await spamGuard.isDuplicate(key)) {
      return null;
    }

    const event = await MatchEvent.create({ ...data, matchId });

    socketService.emitMatchEvent(matchId, event);

    const match = await Match.findByPk(matchId);

    if (match?.seasonId != null) {
      await cache.del(
        CacheKeys.matches.bySeason(match.seasonId, match.category ?? "over19"),
      );
    }

    const scoreChanged = await this.updateMatchScore(match, event);

    // Se o resultado foi alterado (golo), reenvia o jogo completo e
    // atualizado via socket, para todos os clientes terem feedback imediato
    // sem dependerem de um segundo PATCH manual do admin.
    if (scoreChanged) {
      await this.matchService.refreshAndBroadcast(matchId);
    }

    await this.notify(event, "create", match ?? undefined);

    return event;
  }

  private async updateMatchScore(match: Match | null, event: any): Promise<boolean> {
    if (event.type !== "goal") return false;

    if (!match) return false;

    let [home, away] = (match.result ?? "0-0").split("-").map(Number);

    const isHome = match.homeOrAway === "C";
    const isForUs = !event.isOpponent;

    if (isForUs && isHome) home++;
    else if (isForUs && !isHome) away++;
    else if (!isForUs && isHome) away++;
    else home++;

    const newResult = `${home}-${away}`;

    await match.update({ result: newResult });

    return true;
  }

  async updateEvent(eventId: number, data: any) {
    const event = await MatchEvent.findByPk(eventId);
    if (!event) return null;

    await event.update(data);

    const match = await Match.findByPk(event.matchId);

    if (match?.seasonId != null) {
      await cache.del(
        CacheKeys.matches.bySeason(match.seasonId, match.category ?? "over19"),
      );
    }

    socketService.emitMatchEvent(event.matchId, event);

    return event;
  }

  async deleteEvent(eventId: number) {
    const event = await MatchEvent.findByPk(eventId);
    if (!event) return null;

    await MatchEvent.destroy({ where: { id: eventId } });

    const match = await Match.findByPk(event.matchId);

    if (match?.seasonId != null) {
      await cache.del(
        CacheKeys.matches.bySeason(match.seasonId, match.category ?? "over19"),
      );
    }

    if (match?.status !== "finished") {
      await this.notify(event, "delete", match ?? undefined);
    }

    socketService.emitMatchEvent(event.matchId, event);

    return true;
  }

  async notify(event: MatchEvent, action: "create" | "delete", match?: Match) {

    const settings = await getNotificationsEnabled();
    if (!settings) return;

    const category = (match as any)?.category ?? "over19";
    const categoryLabel = this._getCategoryLabel(category);

    const devices = await deviceService.getDevicesForGoals(category);

    let title = "";
    let body = "";

    if (action === "delete") {
      title = "Correção!";
      body = `${categoryLabel}Evento de ${event.type} aos ${event.minute}' foi corrigido.`;
    } else {
      let playerName: string;

      if (event.isOpponent) {
        playerName = "Adversário";
      } else {
        const player = await Player.findByPk(event.playerId || -1);
        playerName = player ? player.name : teamConfig.name;
      }

      switch (event.type) {
        case "goal":
          title = category === "over19" ? "Golo!" : `Golo, ${categoryLabel}!`;

          const freshMatch = await Match.findByPk(match!.id);

          const result = freshMatch?.result ? `\n[${freshMatch.result}]` : "";

          body = `${playerName} - ${event.minute}'${result}`;
          break;

        case "red_card":
          title =
            category === "over19"
              ? "Vermelho 🟥"
              : `Vermelho 🟥, ${categoryLabel}!`;

          body = `${playerName} - ${event.minute}'`;
          break;

        default:
          return;
      }
    }

    if (!devices.length) return;

    const response = await pushService.sendToDevices(devices, {
      title,
      body,
    });

    await pushService.handleReceipts(response);
  }

  private _getCategoryLabel(category: string): string {
    if (category === "over19") return "";

    const cfg = teamConfig.categories.find((c) => c.category === category);

    return cfg ? cfg.label : category;
  }
}

export default new MatchEventService();