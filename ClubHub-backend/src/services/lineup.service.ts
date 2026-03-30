import Lineup from "../models/Lineup";
import Match from "../models/Match";

export default class LineupService {
  async getAll(matchId?: number) {
    const whereClause = matchId ? { matchId } : undefined;
    return Lineup.findAll({ where: whereClause });
  }

  async create(data: {
    matchId: number;
    playerId: number;
    isStarting?: boolean;
  }) {
    // Cria o lineup
    const lineup = await Lineup.create(data);

    return lineup;
  }

  async update(id: number, updates: Partial<{ isStarting: boolean }>) {
    const lineup = await Lineup.findByPk(id);
    if (!lineup) throw new Error("Lineup not found");

    await lineup.update(updates);

    return lineup;
  }

  async deleteByMatch(matchId: number) {
    await Lineup.destroy({ where: { matchId } });
  }
}
