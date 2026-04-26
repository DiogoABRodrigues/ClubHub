import Player from "../models/Player";
import Squad from "../models/Squad";
import Stats from "../models/Stats";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import SeasonService from "./season.service";
import Season from "../models/Season";

const seasonService = new SeasonService();
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
    const season = await new SeasonService().getCurrentSeason() as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id); 
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
