import Match from "../models/Match";
import SeasonService from "./season.service";

export default class MatchService {
  async getAll() {
    return Match.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Match.findAll({ where: { seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season) return [];
    return this.getBySeasonId(season.id);
  }
}