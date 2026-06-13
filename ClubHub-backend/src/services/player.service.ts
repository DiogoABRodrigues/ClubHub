import { Op } from "sequelize";
import Player from "../models/Player";
import Squad from "../models/Squad";
import Stats from "../models/Stats";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import SeasonService from "./season.service";
import Season from "../models/Season";

export default class PlayerService {
  async getAll() {
    return Player.findAll();
  }

  async getBySeasonId(seasonId: number, category: string = "over19") {
    const key = CacheKeys.players.bySeason(seasonId, category);

    const cached = await cache.get(key);
    if (cached) return cached;

    const squadEntries = await Squad.findAll({
      where: { seasonId, category, status: { [Op.ne]: "error" } },
    });

    const externalIds = squadEntries.map((s) => s.playerExternalId);

    const players = await Player.findAll({
      where: { externalId: externalIds },
      include: [
        { model: Stats, where: { seasonId, category }, required: false },
      ],
    });

    const statusMap: Record<number, string> = {};
    const positionMap: Record<number, string | null> = {};
    const numberMap: Record<number, number | null> = {};
    for (const entry of squadEntries) {
      statusMap[entry.playerExternalId] = entry.status;
      positionMap[entry.playerExternalId] = entry.position;
      numberMap[entry.playerExternalId] = entry.number;
    }

    const enriched = players.map((p: any) => {
      const plain = p.toJSON();
      plain.squadStatus = statusMap[plain.externalId] ?? "active";
      plain.position = positionMap[plain.externalId] ?? null;
      plain.number = numberMap[plain.externalId] ?? null;
      return plain;
    });

    await cache.setPermanent(key, enriched);
    return enriched;
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = (await new SeasonService().getCurrentSeason()) as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id, category);
  }

  /** Admin: devolve TODOS os jogadores (incluindo "error") de um escalão. */
  async getAllBySeasonId(seasonId: number, category: string = "over19") {
    const squadEntries = await Squad.findAll({ where: { seasonId, category } });
    const externalIds = squadEntries.map((s) => s.playerExternalId);

    const players = await Player.findAll({
      where: { externalId: externalIds },
      include: [
        { model: Stats, where: { seasonId, category }, required: false },
      ],
    });

    const statusMap: Record<number, string> = {};
    const positionMap: Record<number, string | null> = {};
    const numberMap: Record<number, number | null> = {};
    for (const entry of squadEntries) {
      statusMap[entry.playerExternalId] = entry.status;
      positionMap[entry.playerExternalId] = entry.position;
      numberMap[entry.playerExternalId] = entry.number;
    }

    return players.map((p: any) => {
      const plain = p.toJSON();
      plain.squadStatus = statusMap[plain.externalId] ?? "active";
      plain.position = positionMap[plain.externalId] ?? null;
      plain.number = numberMap[plain.externalId] ?? null;
      return plain;
    });
  }

  async getAllStatsByPlayerId(playerId: number) {
    const key = CacheKeys.players.allStatsByPlayer(playerId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const player = await Player.findByPk(playerId, {
      include: [{ model: Stats }],
    });

    if (!player) return null;

    const seasons = await Season.findAll();
    const seasonYearMap: Record<number, string> = {};
    for (const s of seasons) {
      seasonYearMap[s.id] = s.year;
    }

    const stats = (player as any).Stats ?? [];
    stats.sort((a: any, b: any) => {
      const yearA = parseInt(seasonYearMap[a.seasonId]?.split("/")?.[0] ?? "0");
      const yearB = parseInt(seasonYearMap[b.seasonId]?.split("/")?.[0] ?? "0");
      return yearB - yearA;
    });
    (player as any).Stats = stats;

    await cache.setPermanent(key, player);
    return player;
  }

  async updatePlayer(playerId: number, updates: Partial<Player>) {
    const player = await Player.findByPk(playerId);
    if (!player) throw new Error("Player not found");
    await player.update(updates);
    return player;
  }

  async updateSquadStatus(
    playerExternalId: number,
    seasonId: number,
    status: "active" | "left" | "error",
    category: string = "over19",
  ) {
    const entry = await Squad.findOne({
      where: { playerExternalId, seasonId, category },
    });
    if (!entry) throw new Error("Squad entry not found");

    await entry.update({ status });

    await cache.del(CacheKeys.players.bySeason(seasonId, category));
    await cache.del(CacheKeys.squad.bySeason(seasonId, category));

    return entry;
  }
}
