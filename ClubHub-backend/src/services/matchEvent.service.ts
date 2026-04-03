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

class MatchEventService {
  async createEvent(matchId: number, data: any) {
    // 🧠 1. criar chave única
    const key = buildEventKey(data, matchId);

    // 🚨 2. anti-spam check
    if (await spamGuard.isDuplicate(key)) {
      console.log("🚫 Duplicate event blocked:", key);
      return null;
    }

    // 💾 3. criar evento
    const event = await MatchEvent.create({
      ...data,
      matchId,
    });
    socketService.emitMatchEvent(matchId, event);

    const match = await Match.findByPk(matchId);
    if (match?.seasonId != null) {
      await cache.del(CacheKeys.matches.bySeason(match.seasonId));
    }

    // 📢 4. notificar
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

    await this.notify(event, "delete");
    socketService.emitMatchEvent(event.matchId, event);

    return true;
  }

  async notify(event: MatchEvent, action: "create" | "delete") {
    let devices: any[] = [];
    let title = "";
    let body = "";
    devices = await deviceService.getDevicesForGoals();
    if (action === "delete") {
      title = "Correção!";
      body = `Evento de ${event.type} aos ${event.minute}' foi apagado.`;
    } else {
      let playerName;
      if(event.isOpponent) {
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
console.log("DEVICES:", devices.map(d => d.pushToken));
const response = await pushService.sendToDevices(devices, {
  title,
  body,
});

await pushService.handleReceipts(response);
  }
}

export default new MatchEventService();