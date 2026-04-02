import Competition from "../models/Competition";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
export default class CompetitionService {
  async getAll() {
    return Competition.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Competition.findAll({ where: { seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season) return [];
    return this.getBySeasonId((season as { id: number }).id);
  }
}
