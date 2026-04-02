import Player from "../models/Player";
import Squad from "../models/Squad";
import Stats from "../models/Stats";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
export default class PlayerService {
  async getAll() {
    return Player.findAll();
  }

  async getBySeasonId(seasonId: number) {
    const squad = await Squad.findAll({ where: { seasonId } });
    const externalIds = squad.map((s) => s.playerExternalId);
    const key = CacheKeys.players.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const players = await Player.findAll({
      where: { externalId: externalIds },
      include: [{ model: Stats, where: { seasonId }, required: false }],
    });

    await cache.set(key, players);

    return players;
  }

  async getByCurrentSeasonId() {
    const squad = await Squad.findAll({ order: [["seasonId", "DESC"]] });
    if (!squad.length) return [];
    const seasonId = squad[0].seasonId;
    const externalIds = squad.map((s) => s.playerExternalId);

    const players = await Player.findAll({
      where: { externalId: externalIds }, include: [
        {
          model: Stats,
          where: { seasonId },
          required: false,
        },
      ] });
    return players;
  }

  async updatePlayer(playerId: number, updates: Partial<Player>) {
    const player = await Player.findByPk(playerId);
    if (!player) throw new Error("Player not found");

    await player.update(updates);
    await cache.del(CacheKeys.players.bySeason(player.seasonId as number));
    await cache.del(CacheKeys.stats.bySeason(player.seasonId as number));
    return player;
  }
}
