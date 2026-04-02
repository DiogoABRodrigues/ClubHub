import Stats from "../models/Stats";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
export default class StatsService {
  async getAll() {
    return Stats.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Stats.findAll({ where: { seasonId: seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season || typeof season !== "object" || !("id" in season)) return [];

    const seasonId = (season as { id: number }).id;
    const key = CacheKeys.stats.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Stats.findAll({ where: { seasonId } });

    await cache.set(key, data);

    return data;
  }
}
