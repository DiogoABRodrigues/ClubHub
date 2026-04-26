import MatchEvent from "../models/MatchEvent";
import Match from "../models/Match";
import { pushService } from "./push.service";
import deviceService from "./device.service";
import spamGuard from "../utils/eventSpamGuard";
import { buildEventKey } from "../utils/buildEventKey";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import socketService from "./socket.service";
import Player from "../models/Player";
import { teamConfig } from "../config/teamConfig";
import AppSettings from "../models/AppSettings";
import cacheService from "../services/cache.service";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";
class MatchEventService {
  async createEvent(matchId: number, data: any) {
    const key = buildEventKey(data, matchId);

    if (await spamGuard.isDuplicate(key)) {
      console.log("🚫 Duplicate event blocked:", key);
      return null;
    }

    const event = await MatchEvent.create({
      ...data,
      matchId,
    });
    socketService.emitMatchEvent(matchId, event);

    const match = await Match.findByPk(matchId);
    if (match?.seasonId != null) {
      await cache.del(CacheKeys.matches.bySeason(match.seasonId));
    }
    await this.notify(event, "create");

    return event;
  }

  async updateEvent(eventId: number, data: any) {
    await MatchEvent.update(data, { where: { id: eventId } });
    const event = await MatchEvent.findByPk(eventId);
    if (event) {
      socketService.emitMatchEvent(event.matchId, event);
    }
    return event;
  }

  async deleteEvent(eventId: number) {
    const event = await MatchEvent.findByPk(eventId);

    if (!event) return null;

    await MatchEvent.destroy({ where: { id: eventId } });

    const match = await Match.findByPk(event.matchId);
    if (match?.seasonId != null) {
      await cache.del(CacheKeys.matches.bySeason(match.seasonId));
    }
    await this.notify(event, "delete");
    socketService.emitMatchEvent(event.matchId, event);

    return true;
  }

  async notify(event: MatchEvent, action: "create" | "delete") {
    const settings = await getNotificationsEnabled();

    if (!settings) return;

    let devices: any[] = [];
    let title = "";
    let body = "";
    devices = await deviceService.getDevicesForGoals();
    if (action === "delete") {
      title = "Correção!";
      body = `Evento de ${event.type} aos ${event.minute}' foi apagado.`;
    } else {
      let playerName;
      if (event.isOpponent) {
        playerName = "Adversário";
      } else {
        const player = await Player.findByPk(event.playerId || -1);
        playerName = player ? player.name : teamConfig.name;
      }
      switch (event.type) {
        case "goal":
          title = "Golo!";
          body = `${playerName} - ${event.minute}'`;
          break;

        case "red_card":
          title = "Vermelho 🟥";
          body = `${playerName} - ${event.minute}'`;
          break;
      }
    }

    if (!devices.length) return;
    const response = await pushService.sendToDevices(devices, {
      title,
      body,
    });

    await pushService.handleReceipts(response);
  }
}

export default new MatchEventService();
