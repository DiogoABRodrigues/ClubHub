import Standing from "../models/Standing";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class StandingService {
  async getAll() {
    return Standing.findAll();
  }

  async getBySeasonId(seasonId: number, category: string = "over19") {
    return Standing.findAll({ where: { seasonId, category } });
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = await new SeasonService().getCurrentSeason();
    if (!season || typeof season !== "object" || !("id" in season)) return [];

    const seasonId = (season as { id: number }).id;
    const key = CacheKeys.standings.bySeason(seasonId, category);

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Standing.findAll({ where: { seasonId, category } });
    await cache.set(key, data);
    return data;
  }
}