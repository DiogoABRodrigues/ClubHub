import Competition from "../models/Competition";
import SeasonService from "./season.service";

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
    return this.getBySeasonId(season.id);
  }
}