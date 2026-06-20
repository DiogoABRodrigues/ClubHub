import Lineup from "../models/Lineup";
import Match from "../models/Match";
import { sequelize } from "../config/database";
import cache from "./cache.service";
import { CacheKeys } from "../cache/keys";
import { AppError } from "../errors/AppError";

type LineupEntry = {
  playerId: number;
  isStarting?: boolean;
};

export default class LineupService {
  async getAll(matchId?: number) {
    return Lineup.findAll({
      where: matchId ? { matchId } : undefined,
      order: [["isStarting", "DESC"], ["id", "ASC"]],
    });
  }

  async create(data: LineupEntry & { matchId: number }) {
    const lineup = await Lineup.create(data);
    const match = await Match.findByPk(data.matchId);
    if (match) await this.invalidateMatch(match);
    return lineup;
  }

  async update(id: number, updates: Partial<Pick<LineupEntry, "isStarting">>) {
    const lineup = await Lineup.findByPk(id);
    if (!lineup) throw new AppError("Lineup not found", 404);

    await lineup.update(updates);
    const match = await Match.findByPk(lineup.matchId);
    if (match) await this.invalidateMatch(match);
    return lineup;
  }

  async deleteByMatch(matchId: number) {
    const match = await Match.findByPk(matchId);
    await Lineup.destroy({ where: { matchId } });
    if (match) await this.invalidateMatch(match);
  }

  async replaceForMatch(matchId: number, entries: LineupEntry[]) {
    const uniquePlayerIds = new Set(entries.map((entry) => entry.playerId));
    if (uniquePlayerIds.size !== entries.length) {
      throw new AppError("A formação contém jogadores duplicados.", 400);
    }

    const result = await sequelize.transaction(async (transaction) => {
      const match = await Match.findByPk(matchId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!match) throw new AppError("Match not found", 404);

      await Lineup.destroy({ where: { matchId }, transaction });
      const lineups = entries.length
        ? await Lineup.bulkCreate(
            entries.map((entry) => ({
              matchId,
              playerId: entry.playerId,
              isStarting: entry.isStarting ?? true,
            })),
            { transaction, returning: true },
          )
        : [];

      return { match, lineups };
    });

    await this.invalidateMatch(result.match);
    return result.lineups;
  }

  private async invalidateMatch(match: Match) {
    const keys = [CacheKeys.matches.byId(match.id)];
    if (match.seasonId != null) {
      keys.push(
        CacheKeys.matches.bySeason(match.seasonId, match.category ?? "over19"),
        CacheKeys.matches.summaryBySeason(
          match.seasonId,
          match.category ?? "over19",
        ),
      );
    }
    if (match.competitionId != null) {
      keys.push(CacheKeys.matches.byCompetition(match.competitionId));
    }
    await cache.delMany(keys);
  }
}
