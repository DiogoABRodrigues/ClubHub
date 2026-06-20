import { Op } from "sequelize";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import Season from "../models/Season";
import Match from "../models/Match";

export default class SeasonService {
  async getAll() {
    const cached = await cache.get<Season[]>(CacheKeys.season.all);
    if (cached) return cached;

    const seasons = await Season.findAll({ order: [["id", "ASC"]] });
    await cache.setPermanent(CacheKeys.season.all, seasons);
    return seasons;
  }

  async getById(id: number) {
    const key = CacheKeys.season.byId(id);
    const cached = await cache.get<Season>(key);
    if (cached) return cached;

    const season = await Season.findByPk(id);
    if (season) await cache.setPermanent(key, season);
    return season;
  }

  async getCurrentSeason() {
    const key = CacheKeys.season.current;

    const cached = await cache.get(key) as Season | null;
    if (cached) return cached;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const currentYear =
      month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;

    let season = await Season.findOne({ where: { year: currentYear } });
    if (!season) {
      season = await Season.findOne({ order: [["id", "DESC"]] });
    }

    // 24h — muda automaticamente com a data, sem trigger manual
    await cache.set(key, season, 60 * 60 * 24);
    return season;
  }

  /** Seasons que têm pelo menos 1 jogo na categoria dada */
  async getByCategory(category: string): Promise<Season[]> {
    const key = CacheKeys.season.byCategory(category);

    const cached = await cache.get(key);
    if (cached) return cached as Season[];

    const rows = (await Match.findAll({
      attributes: ["seasonId"],
      where: { category, seasonId: { [Op.ne]: null } },
      group: ["seasonId"],
      raw: true,
    })) as any[];

    const seasonIds = rows.map((r: any) => r.seasonId).filter(Boolean);
    if (!seasonIds.length) return [];

    const seasons = await Season.findAll({
      where: { id: seasonIds },
      order: [["id", "ASC"]],
    });

    // Persiste sem TTL — só muda quando o scrapper corre e adiciona jogos de nova época
    await cache.setPermanent(key, seasons);
    return seasons;
  }
}
