import Standing from "../models/Standing";
import SeasonService from "./season.service";

export default class StandingService {
  async getAll() {
    return Standing.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Standing.findAll({ where: { seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season) return [];
    return this.getBySeasonId(season.id);
  }
}