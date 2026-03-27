import Stats from "../models/Stats";
import SeasonService from "./season.service";

export default class StatsService {
  async getAll() {
    return Stats.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Stats.findAll({ where: { seasonId: seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season) return [];
    return Stats.findAll({ where: { seasonId: season.id } });
  }
}
