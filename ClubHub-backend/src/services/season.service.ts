import { Op } from "sequelize";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import Season from "../models/Season";
import Squad from "../models/Squad";
import appSettingsService from "./appSettings.service";

const ZEROZERO_CURRENT_SEASON_KEY = "zerozero_current_season";

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

  /** A época atual é exclusivamente a última época confirmada pelo ZeroZero. */
  async getCurrentSeason() {
    const key = CacheKeys.season.current;
    const cached = await cache.get(key) as Season | null;
    if (cached) return cached;

    const seasonYear = await appSettingsService.get(ZEROZERO_CURRENT_SEASON_KEY);
    if (!seasonYear) return null;

    const season = await Season.findOne({ where: { year: seasonYear } });
    await cache.set(key, season, 60 * 60 * 24);
    return season;
  }

  /** Atualizado apenas após a descoberta da época selecionada no ZeroZero. */
  async setCurrentSeasonFromZeroZero(seasonYear: string): Promise<Season> {
    const [season] = await Season.findOrCreate({ where: { year: seasonYear } });
    await appSettingsService.set(ZEROZERO_CURRENT_SEASON_KEY, seasonYear);
    await Promise.all([
      cache.del(CacheKeys.season.current),
      cache.del(CacheKeys.season.all),
      cache.del(CacheKeys.season.byId(season.id)),
    ]);
    return season;
  }

  /** Seasons que têm pelo menos um jogador no plantel da categoria dada. */
  async getByCategory(category: string): Promise<Season[]> {
    const key = CacheKeys.season.byCategory(category);
    const cached = await cache.get(key);
    if (cached) return cached as Season[];

    const rows = (await Squad.findAll({
      attributes: ["seasonId"],
      where: { category, seasonId: { [Op.ne]: null } },
      group: ["seasonId"],
      raw: true,
    })) as any[];
    const seasonIds = rows.map((row: any) => row.seasonId).filter(Boolean);
    if (!seasonIds.length) return [];

    const seasons = await Season.findAll({
      where: { id: seasonIds },
      order: [["id", "ASC"]],
    });
    await cache.setPermanent(key, seasons);
    return seasons;
  }
}
