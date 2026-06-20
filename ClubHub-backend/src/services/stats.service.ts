import Stats from "../models/Stats";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class StatsService {
  async getAll() {
    return Stats.findAll();
  }

  async getBySeasonId(seasonId: number, category: string = "over19") {
    const key = CacheKeys.stats.bySeason(seasonId, category);

    return cache.remember(key, () =>
      Stats.findAll({ where: { seasonId, category } }),
    );
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = await new SeasonService().getCurrentSeason();
    if (!season || typeof season !== "object" || !("id" in season)) return [];

    const seasonId = (season as { id: number }).id;
    return this.getBySeasonId(seasonId, category);
  }
}
