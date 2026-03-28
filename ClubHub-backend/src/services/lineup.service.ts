import Lineup from "../models/Lineup";

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
    return Lineup.create(data);
  }

  async update(id: number, updates: Partial<{ isStarting: boolean }>) {
    const lineup = await Lineup.findByPk(id);
    if (!lineup) throw new Error("Lineup not found");
    await lineup.update(updates);
    return lineup;
  }
}