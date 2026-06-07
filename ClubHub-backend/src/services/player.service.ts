import Player from "../models/Player";
import Squad from "../models/Squad";
import Stats from "../models/Stats";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import SeasonService from "./season.service";
import Season from "../models/Season";

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

  /** Devolve um jogador com TODAS as suas Stats (todas as épocas), ordenadas por época mais recente primeiro */
  async getAllStatsByPlayerId(playerId: number) {
    const key = `app:player:${playerId}:allstats`;

    const cached = await cache.get(key);
    if (cached) return cached;

    // Busca o jogador com todas as stats, ordenadas por seasonId DESC
    const player = await Player.findByPk(playerId, {
      include: [{ model: Stats }],
    });

    if (!player) return null;

    // Cruza com as seasons para ordenar pelo year real (ex: "2024/2025")
    const seasons = await Season.findAll();
    const seasonYearMap: Record<number, string> = {};
    for (const s of seasons) {
      seasonYearMap[s.id] = s.year;
    }

    const stats = (player as any).Stats ?? [];
    console.log("Stats antes de ordenar:", stats.map((s: any) => ({
      seasonId: s.seasonId,
      year: seasonYearMap[s.seasonId],
    })));
    stats.sort((a: any, b: any) => {
      const yearA = parseInt(seasonYearMap[a.seasonId]?.split("/")?.[0] ?? "0");
      const yearB = parseInt(seasonYearMap[b.seasonId]?.split("/")?.[0] ?? "0");
      console.log(`  a=${seasonYearMap[a.seasonId]} (${yearA}) vs b=${seasonYearMap[b.seasonId]} (${yearB}) → ${yearB - yearA}`);
      return yearB - yearA;
    });
    console.log("Stats depois de ordenar:", stats.map((s: any) => seasonYearMap[s.seasonId]));
    (player as any).Stats = stats;

    await cache.set(key, player, 60 * 60); // cache 1h

    return player;
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