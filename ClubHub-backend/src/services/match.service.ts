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
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";
import { teamConfig } from "../config/teamConfig";

export default class MatchService {
  async getAll() {
    return Match.findAll();
  }

  async getBySeasonId(seasonId: number, category: string = "over19") {
    const key = CacheKeys.matches.bySeason(seasonId, category);

    const cached = await cache.get(key);
    if (cached) return cached;

    const matches = await Match.findAll({
      where: { seasonId, category },
      include: [
        {
          model: Lineup,
          include: [{ model: Player, attributes: ["id", "name", "photoUrl"] }],
        },
        {
          model: MatchEvent,
          as: "events",
          separate: true,
          order: [["minute", "ASC"], ["createdAt", "ASC"]],
        },
      ],
    });

    await cache.setPermanent(key, matches);
    return matches;
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = (await new SeasonService().getCurrentSeason()) as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id, category);
  }

  async getByCompetitionId(competitionId: number) {
    const key = CacheKeys.matches.byCompetition(competitionId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const matches = await Match.findAll({
      where: { competitionId },
      include: [
        {
          model: MatchEvent,
          as: "events",
          separate: true,
          order: [["minute", "ASC"], ["createdAt", "ASC"]],
        },
      ],
      order: [["date", "DESC"]],
    });

    // Agrupar por ronda no backend
    const roundMap = new Map<string, typeof matches>();
    for (const match of matches) {
      const round = (match as any).round ?? "Sem ronda";
      if (!roundMap.has(round)) roundMap.set(round, []);
      roundMap.get(round)!.push(match);
    }

    const roundOrder = ["F", "MF", "QF", "1/8", "1/16"];
    const rounds = Array.from(roundMap.entries())
      .map(([round, roundMatches]) => ({ round, matches: roundMatches }))
      .sort((a, b) => {
        const aIdx = roundOrder.indexOf(a.round.trim().toUpperCase());
        const bIdx = roundOrder.indexOf(b.round.trim().toUpperCase());
        return aIdx - bIdx;
      });

    await cache.setPermanent(key, rounds);
    return rounds;
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
          order: [["minute", "ASC"], ["createdAt", "ASC"]],
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

    const category = (match as any).category ?? "over19";

    // Só invalida os matches — standings são geridas pelo scrapper
    await cache.del(
      CacheKeys.matches.bySeason(match.seasonId as number, category),
    );

    if (match.competitionId) {
      await cache.del(CacheKeys.matches.byCompetition(match.competitionId));
    }

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

  async refreshAndBroadcast(id: number) {
    const match = await Match.findByPk(id, {
      include: [
        {
          model: Lineup,
          include: [{ model: Player, attributes: ["id", "name", "photoUrl"] }],
        },
        {
          model: MatchEvent,
          as: "events",
          separate: true,
          order: [["minute", "ASC"], ["createdAt", "ASC"]],
        },
      ],
    });

    if (!match) return null;

    const category = (match as any).category ?? "over19";

    await cache.del(
      CacheKeys.matches.bySeason(match.seasonId as number, category),
    );

    socketService.emitMatchUpdate(match);

    return match;
  }

  private async notifyResult(match: Match) {
    const settings = await getNotificationsEnabled();
    if (!settings) return;

    const category = (match as any).category ?? "over19";
    const categoryLabel = this._getCategoryLabel(category);
    const devices = await deviceService.getDevicesForResults(category);
    if (!devices.length) return;

    const title =
      category === "over19" ? "Fim do jogo!" : `Fim do jogo, ${categoryLabel}!`;
    const body =
      match.homeOrAway === "C"
        ? `${match.teamName} ${match.result} ${match.opponent}`
        : `${match.opponent} ${match.result} ${match.teamName}`;

    const response = await pushService.sendToDevices(devices, { title, body });
    await pushService.handleReceipts(response);
  }

  private _getCategoryLabel(category: string): string {
    if (category === "over19") return "";
    const cfg = (teamConfig.categories as any[]).find(
      (c) => c.category === category,
    );
    return cfg ? cfg.label : category;
  }
}