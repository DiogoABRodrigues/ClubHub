import MatchEvent from "../models/MatchEvent";
import Match from "../models/Match";
import pushService from "./push.service";
import deviceService from "./device.service";
import spamGuard from "../utils/eventSpamGuard";
import { buildEventKey } from "../utils/buildEventKey";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import socketService from "./socket.service";

class MatchEventService {
  async createEvent(matchId: number, data: any) {
    // 🧠 1. criar chave única
    const key = buildEventKey(data, matchId);

    // 🚨 2. anti-spam check
    if (spamGuard.isDuplicate(key)) {
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

  async notify(event: any, action: "create" | "delete") {
    let devices: any[] = [];
    let title = "";
    let body = "";

    if (action === "delete") {
      devices = await deviceService.getDevicesForMatchday();
      title = "Correção de Evento 🔁";
      body = `Evento de ${event.type} aos ${event.minute}' foi corrigido`;
    } else {
      switch (event.type) {
        case "goal":
          devices = await deviceService.getDevicesForGoals();
          title = "GOLO ⚽";
          body = `Min ${event.minute}'`;
          break;

        case "yellow_card":
          devices = await deviceService.getDevicesForMatchday();
          title = "Amarelo 🟨";
          body = `Min ${event.minute}'`;
          break;

        case "red_card":
          devices = await deviceService.getDevicesForMatchday();
          title = "Vermelho 🟥";
          body = `Min ${event.minute}'`;
          break;

        case "substitution":
          devices = await deviceService.getDevicesForMatchday();
          title = "Substituição 🔄";
          body = `Min ${event.minute}'`;
          break;
      }
    }

    if (!devices.length) return;

    const tickets = await pushService.sendToDevices(devices, {
      title,
      body,
    });

    await pushService.handleReceipts(tickets);
  }
}

export default new MatchEventService();