import Lineup from "../models/Lineup";
import Match from "../models/Match";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
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
    const match = await Match.findByPk(data.matchId);
    if (match?.seasonId != null) {
      await cache.del(CacheKeys.matches.bySeason(match.seasonId));
    }
    return lineup;
  }

  async update(id: number, updates: Partial<{ isStarting: boolean }>) {
    const lineup = await Lineup.findByPk(id);
    if (!lineup) throw new Error("Lineup not found");
    const match = await Match.findByPk(lineup.matchId);
    if (match?.seasonId != null) {
      await cache.del(CacheKeys.matches.bySeason(match.seasonId));
    }
    await lineup.update(updates);

    return lineup;
  }

  async deleteByMatch(matchId: number) {
    const match = await Match.findByPk(matchId);
    if (match?.seasonId != null) {
      await cache.del(CacheKeys.matches.bySeason(match.seasonId));
    }
    await Lineup.destroy({ where: { matchId } });
  }
}
