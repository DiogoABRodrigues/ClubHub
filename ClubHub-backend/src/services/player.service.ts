import { Op } from "sequelize";
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
    const key = CacheKeys.players.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) return cached;

    // Busca todos os registos de squad para esta época EXCEPTO os que
    // estão marcados como "error" (entraram por erro da API).
    const squadEntries = await Squad.findAll({
      where: { seasonId, status: { [Op.ne]: "error" } },
    });

    const externalIds = squadEntries.map((s) => s.playerExternalId);

    const players = await Player.findAll({
      where: { externalId: externalIds },
      include: [{ model: Stats, where: { seasonId }, required: false }],
    });

    // Injeta o status do squad em cada jogador para o frontend poder
    // distinguir "active" de "left" sem chamada extra.
    const statusMap: Record<number, string> = {};
    for (const entry of squadEntries) {
      statusMap[entry.playerExternalId] = entry.status;
    }

    const enriched = players.map((p: any) => {
      const plain = p.toJSON();
      plain.squadStatus = statusMap[plain.externalId] ?? "active";
      return plain;
    });

    await cache.set(key, enriched);

    return enriched;
  }

  async getByCurrentSeasonId() {
    const season = (await new SeasonService().getCurrentSeason()) as Season;
    if (!season) return [];
    return this.getBySeasonId(season.id);
  }

  /** Admin: devolve TODOS os jogadores da época, incluindo os marcados como "error". */
  async getAllBySeasonId(seasonId: number) {
    const squadEntries = await Squad.findAll({ where: { seasonId } });
    const externalIds = squadEntries.map((s) => s.playerExternalId);

    const players = await Player.findAll({
      where: { externalId: externalIds },
      include: [{ model: Stats, where: { seasonId }, required: false }],
    });

    const statusMap: Record<number, string> = {};
    for (const entry of squadEntries) {
      statusMap[entry.playerExternalId] = entry.status;
    }

    return players.map((p: any) => {
      const plain = p.toJSON();
      plain.squadStatus = statusMap[plain.externalId] ?? "active";
      return plain;
    });
  }

  /** Devolve um jogador com TODAS as suas Stats (todas as épocas), ordenadas por época mais recente primeiro */
  async getAllStatsByPlayerId(playerId: number) {
    const key = `app:player:${playerId}:allstats`;

    const cached = await cache.get(key);
    if (cached) return cached;

    const player = await Player.findByPk(playerId, {
      include: [{ model: Stats }],
    });

    if (!player) return null;

    const seasons = await Season.findAll();
    const seasonYearMap: Record<number, string> = {};
    for (const s of seasons) {
      seasonYearMap[s.id] = s.year;
    }

    const stats = (player as any).Stats ?? [];
    stats.sort((a: any, b: any) => {
      const yearA = parseInt(seasonYearMap[a.seasonId]?.split("/")?.[0] ?? "0");
      const yearB = parseInt(seasonYearMap[b.seasonId]?.split("/")?.[0] ?? "0");
      return yearB - yearA;
    });
    (player as any).Stats = stats;

    await cache.set(key, player, 60 * 60);

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

  /** Atualiza o status de um jogador num squad específico (por época). */
  async updateSquadStatus(
    playerExternalId: number,
    seasonId: number,
    status: "active" | "left" | "error",
  ) {
    const entry = await Squad.findOne({ where: { playerExternalId, seasonId } });
    if (!entry) throw new Error("Squad entry not found");

    await entry.update({ status });

    // Invalida cache desta época
    await cache.del(CacheKeys.players.bySeason(seasonId));
    await cache.del(CacheKeys.squad.bySeason(seasonId));

    return entry;
  }
}