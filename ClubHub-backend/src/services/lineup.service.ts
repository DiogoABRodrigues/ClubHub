import Lineup from "../models/Lineup";
import MatchService from "./match.service";

export default class LineupService {
  async getAll() {
    return Lineup.findAll();
  }

  async getBySeasonId(seasonId: number) {
    const matches = await new MatchService().getBySeasonId(seasonId);
    const matchIds = matches.map((m) => m.id);
    return Lineup.findAll({ where: { matchId: matchIds } });
  }

  async getByCurrentSeasonId() {
    const matches = await new MatchService().getByCurrentSeasonId();
    const matchIds = matches.map((m) => m.id);
    return Lineup.findAll({ where: { matchId: matchIds } });
  }
}
