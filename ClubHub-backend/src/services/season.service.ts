import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import Season from "../models/Season";

export default class SeasonService {
  async getAll() {
    return Season.findAll({ order: [["id", "ASC"]] });
  }

  async getById(id: number) {
    return Season.findByPk(id);
  }

  async getCurrentSeason() {
    const key = CacheKeys.season.current;

    const cached = await cache.get(key);
    if (cached) return cached;

    const season = await Season.findOne({ order: [["id", "DESC"]] });

    await cache.set(key, season, 60 * 60 * 24);

    return season;
  }
}
