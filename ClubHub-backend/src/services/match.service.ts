import Lineup from "../models/Lineup";
import Match from "../models/Match";
import MatchEvent from "../models/MatchEvent";
import Player from "../models/Player";
import Season from "../models/Season";
import SeasonService from "./season.service";
import cache from "./cache.service";
import { CacheKeys } from "../cache/keys";
import socketService from "./socket.service";
import { pushService } from "./push.service";
import deviceService from "./device.service";
import type { CategoryKey } from "./device.service";
import { getNotificationsEnabled } from "../utils/getNotificationsEnabled";
import { teamConfig } from "../config/teamConfig";
import { AppError } from "../errors/AppError";

const MATCH_SUMMARY_ATTRIBUTES = [
  "id",
  "teamName",
  "date",
  "time",
  "homeOrAway",
  "opponent",
  "result",
  "competitionId",
  "seasonId",
  "round",
  "outcome",
  "status",
  "location",
  "statusTime",
  "decidedByPenalties",
  "category",
] as const;

export default class MatchService {
  private detailedInclude = [
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
  ];

  async getAll() {
    return Match.findAll({ attributes: [...MATCH_SUMMARY_ATTRIBUTES] });
  }

  async getBySeasonId(seasonId: number, category = "over19") {
    const key = CacheKeys.matches.bySeason(seasonId, category);
    return cache.remember(key, () =>
      Match.findAll({
        where: { seasonId, category },
        include: this.detailedInclude as any,
        order: [["date", "DESC"], ["time", "DESC"]],
      }),
    );
  }

  async getSummariesBySeasonId(seasonId: number, category = "over19") {
    const key = CacheKeys.matches.summaryBySeason(seasonId, category);
    return cache.remember(key, () =>
      Match.findAll({
        attributes: [...MATCH_SUMMARY_ATTRIBUTES],
        where: { seasonId, category },
        order: [["date", "DESC"], ["time", "DESC"]],
      }),
    );
  }

  async getById(id: number) {
    const key = CacheKeys.matches.byId(id);
    const cached = await cache.get(key);
    if (cached) return cached;

    const match = await Match.findByPk(id, {
      include: this.detailedInclude as any,
    });
    if (match) await cache.setPermanent(key, match);
    return match;
  }

  async getByCurrentSeasonId(category = "over19") {
    const season = (await new SeasonService().getCurrentSeason()) as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id, category);
  }

  async getByCompetitionId(competitionId: number) {
    const key = CacheKeys.matches.byCompetition(competitionId);
    const cached = await cache.get(key);
    if (cached) return cached;

    const matches = await Match.findAll({
      attributes: [...MATCH_SUMMARY_ATTRIBUTES],
      where: { competitionId },
      order: [["date", "DESC"], ["time", "DESC"]],
    });

    const roundMap = new Map<string, Match[]>();
    for (const match of matches) {
      const round = match.round ?? "Sem ronda";
      const roundMatches = roundMap.get(round) ?? [];
      roundMatches.push(match);
      roundMap.set(round, roundMatches);
    }

    const roundOrder = ["F", "MF", "QF", "1/8", "1/16"];
    const rank = (round: string) => {
      const index = roundOrder.indexOf(round.trim().toUpperCase());
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };
    const rounds = Array.from(roundMap.entries())
      .map(([round, roundMatches]) => ({ round, matches: roundMatches }))
      .sort((a, b) => rank(a.round) - rank(b.round));

    await cache.setPermanent(key, rounds);
    return rounds;
  }

  async create(data: any) {
    const match = await Match.create(data);
    await this.invalidateMatchCaches(match);
    await Promise.all([
      cache.del(CacheKeys.season.all),
      cache.del(CacheKeys.season.current),
      cache.del(CacheKeys.season.byCategory(match.category ?? "over19")),
    ]);
    socketService.emitMatchUpdate(match);
    return match;
  }

  async update(id: number, updates: Record<string, unknown>) {
    const match = await Match.findByPk(id);
    if (!match) throw new AppError("Match not found", 404);

    const previousStatus = match.status;
    await match.update(updates);
    await this.invalidateMatchCaches(match);

    const detailedMatch = await this.getById(id);
    if (detailedMatch) socketService.emitMatchUpdate(detailedMatch);

    if (previousStatus !== "finished" && match.status === "finished") {
      await this.notifyResult(match);
    }

    return detailedMatch ?? match;
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

  async updateEvents(_id: number, _events: unknown[]) {
    throw new AppError(
      "Use os endpoints dedicados de eventos do jogo.",
      400,
    );
  }

  async updateStatus(id: number, status: string) {
    return this.update(id, { status });
  }

  async updateOutcome(id: number, outcome: string) {
    return this.update(id, { outcome });
  }

  async refreshAndBroadcast(id: number) {
    const uncached = await Match.findByPk(id, {
      include: this.detailedInclude as any,
    });
    if (!uncached) return null;

    await this.invalidateMatchCaches(uncached);
    await cache.setPermanent(CacheKeys.matches.byId(id), uncached);
    socketService.emitMatchUpdate(uncached);
    return uncached;
  }

  private async invalidateMatchCaches(match: Match) {
    const category = (match.category ?? "over19") as CategoryKey;
    const keys = [CacheKeys.matches.byId(match.id)];

    if (match.seasonId != null) {
      keys.push(
        CacheKeys.matches.bySeason(match.seasonId, category),
        CacheKeys.matches.summaryBySeason(match.seasonId, category),
      );
    }
    if (match.competitionId != null) {
      keys.push(CacheKeys.matches.byCompetition(match.competitionId));
    }
    await cache.delMany(keys);
  }

  private async notifyResult(match: Match) {
    if (!(await getNotificationsEnabled())) return;

    const category = (match.category ?? "over19") as CategoryKey;
    const categoryLabel = this.getCategoryLabel(category);
    const devices = await deviceService.getDevicesForResults(category);
    if (!devices.length) return;

    const title =
      category === "over19" ? "Fim do jogo!" : `Fim do jogo, ${categoryLabel}!`;
    const body =
      match.homeOrAway === "C"
        ? `${match.teamName} ${match.result} ${match.opponent}`
        : `${match.opponent} ${match.result} ${match.teamName}`;

    await pushService.sendToDevices(devices, { title, body });
  }

  private getCategoryLabel(category: string): string {
    if (category === "over19") return "";
    const config = teamConfig.categories.find(
      (item) => item.category === category,
    );
    return config?.label ?? category;
  }
}
