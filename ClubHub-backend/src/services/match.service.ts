import Lineup from "../models/Lineup";
import Match from "../models/Match";
import MatchEvent from "../models/MatchEvent";
import Player from "../models/Player";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import Season from "../models/Season";
import socketService from "./socket.service";
import { pushService } from "./push.service";
import deviceService from "./device.service";
import AppSettings from "../models/AppSettings";

export default class MatchService {
  async getAll() {
    return Match.findAll();
  }

  async getBySeasonId(seasonId: number) {
    const key = CacheKeys.matches.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) {
      return cached;
    }

    const matches = await Match.findAll({
      where: { seasonId },
      include: [
        {
          model: Lineup,
          include: [{ model: Player, attributes: ["id", "name", "photoUrl"] }],
        },
        {
          model: MatchEvent,
          as: "events",
          separate: true,
          order: [["minute", "ASC"]],
        },
      ],
    });

    await cache.set(key, matches);

    return matches;
  }

  async getByCurrentSeasonId() {
    const season = (await new SeasonService().getCurrentSeason()) as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id);
  }

  async create(data: any) {
    return Match.create(data);
  }

  async update(id: number, updates: Partial<any>) {
    const match = await Match.findByPk(id, {
      include: [
        {
          model: Lineup,
          include: [
            {
              model: Player,
              attributes: ["id", "name", "photoUrl"],
            },
          ],
        },
        {
          model: MatchEvent,
          as: "events",
          separate: true,
          order: [["minute", "ASC"]],
        },
      ],
    });

    if (!match) {
      throw new Error("Match not found");
    }

    await match.update(updates);
    if (updates.status === "finished") {
      await this.notifyResult(match);
    }
    await cache.del(CacheKeys.matches.bySeason(match.seasonId as number));
    await cache.del(CacheKeys.standings.bySeason(match.seasonId as number));
    socketService.emitMatchUpdate(match);
    return match;
  }

  async updateDateTime(id: number, date: string, time: string) {
    return this.update(id, { date, time });
  }

  async updateScore(id: number, result: string) {
    return this.update(id, { result });
  }

  async updateLocation(id: number, location: string) {
    return this.update(id, { location });
  }

  async updateEvents(id: number, events: any[]) {
    return this.update(id, { events });
  }

  async updateStatus(id: number, status: string) {
    return this.update(id, { status });
  }

  async updateOutcome(id: number, outcome: string) {
    return this.update(id, { outcome });
  }

  private async notifyResult(match: Match) {
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
    const devices = await deviceService.getDevicesForResults();

    if (!devices.length) return;

    const title = "Fim do jogo";
    if (match.homeOrAway === "C") {
      const body = `${match.teamName} ${match.result} ${match.opponent}`;
      const response = await pushService.sendToDevices(devices, {
        title,
        body,
      });

      await pushService.handleReceipts(response);
      return;
    }
    const body = `${match.opponent} ${match.result} ${match.teamName}`;

    const response = await pushService.sendToDevices(devices, {
      title,
      body,
    });

    await pushService.handleReceipts(response);
  }
}
