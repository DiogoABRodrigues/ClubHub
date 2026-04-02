import Standing from "../models/Standing";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class StandingService {
  async getAll() {
    return Standing.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Standing.findAll({ where: { seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season || typeof season !== "object" || !("id" in season)) return [];

    const seasonId = (season as { id: number }).id;
    const key = CacheKeys.standings.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Standing.findAll({ where: { seasonId } });

    await cache.set(key, data);

    return data;
  }
}
