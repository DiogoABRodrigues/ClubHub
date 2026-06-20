import Standing from "../models/Standing";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class StandingService {
  async getAll() {
    const key = CacheKeys.standings.all;

    return cache.remember(key, () => Standing.findAll());
  }

  async getBySeasonId(seasonId: number, category: string = "over19") {
    const key = CacheKeys.standings.bySeason(seasonId, category);

    return cache.remember(key, () =>
      Standing.findAll({
        where: { seasonId, category },
        order: [["competitionId", "ASC"], ["position", "ASC"]],
      }),
    );
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = await new SeasonService().getCurrentSeason();

    if (!season || typeof season !== "object" || !("id" in season)) {
      return [];
    }

    return this.getBySeasonId(season.id, category);
  }
}
