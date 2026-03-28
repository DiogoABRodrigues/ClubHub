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

  async create(data: any) {
    return Match.create(data);
  }

  async update(id: number, updates: Partial<any>) {
    const match = await Match.findByPk(id);

    if (!match) {
      throw new Error("Match not found");
    }

    await match.update(updates);

    return match;
  }

  async updateDateTime(id: number, date: string, time: string) {
    return this.update(id, { date, time });
  }

  async updateScore(id: number, result: string) {
    return this.update(id, { result });
  }

  async updateLocation(id: number, location: string) {
    return this.update(id, { location });
  }

  async updateEvents(id: number, events: any[]) {
    return this.update(id, { events });
  }

  async updateStatus(id: number, status: string) {
    return this.update(id, { status });
  }

  async updateOutcome(id: number, outcome: string) {
    return this.update(id, { outcome });
  }
}