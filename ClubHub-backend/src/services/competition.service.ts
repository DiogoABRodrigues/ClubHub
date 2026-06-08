import Competition, { LegendItem } from "../models/Competition";
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
    return this.getBySeasonId((season as { id: number }).id);
  }

  async updateLegend(competitionId: number, legend: LegendItem[]) {
    const competition = await Competition.findByPk(competitionId);
    if (!competition) throw new Error("Competição não encontrada");
    await competition.update({ legend });
    return competition;
  }
}