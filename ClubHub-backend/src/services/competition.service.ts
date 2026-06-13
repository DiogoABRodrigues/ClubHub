import Competition, { LegendItem } from "../models/Competition";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class CompetitionService {
  async getAll() {
    const key = CacheKeys.competitions.all;

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Competition.findAll({
      order: [["id", "ASC"]],
    });
    await cache.setPermanent(key, data);

    return data;
  }

  async getBySeasonId(seasonId: number) {
    const key = CacheKeys.competitions.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Competition.findAll({ where: { seasonId } });
    await cache.setPermanent(key, data);

    return data;
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

    // Invalida ambas as chaves
    await Promise.all([
      cache.del(CacheKeys.competitions.all),
      cache.del(CacheKeys.competitions.bySeason(competition.seasonId)),
    ]);

    return competition;
  }
}
