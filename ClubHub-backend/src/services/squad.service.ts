import Squad from "../models/Squad";
import SeasonService from "./season.service";

export default class SquadService {
  async getAll() {
    return Squad.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Squad.findAll({ where: { seasonId: seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
        if (!season) return [];
    return Squad.findAll({ where: { seasonId: season.dataValues.id } });
  }
}