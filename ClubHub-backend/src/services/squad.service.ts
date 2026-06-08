import { Op } from "sequelize";
import Squad from "../models/Squad";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class SquadService {
  async getAll() {
    return Squad.findAll();
  }

  async getBySeasonId(seasonId: number) {
    return Squad.findAll({ where: { seasonId } });
  }

  async getByCurrentSeasonId() {
    const season = await new SeasonService().getCurrentSeason();
    if (!season || typeof season !== "object" || !("id" in season)) return [];
    const seasonId = (season as { id: number }).id;
    const key = CacheKeys.squad.bySeason(seasonId);

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Squad.findAll({ where: { seasonId } });

    await cache.set(key, data);

    return data;
  }

  /** Atualiza o status de um jogador num squad/época específicos. */
  async updateStatus(
    playerExternalId: number,
    seasonId: number,
    status: "active" | "left" | "error",
  ) {
    const entry = await Squad.findOne({ where: { playerExternalId, seasonId } });
    if (!entry) throw new Error("Squad entry not found");

    await entry.update({ status });

    await cache.del(CacheKeys.squad.bySeason(seasonId));
    await cache.del(CacheKeys.players.bySeason(seasonId));

    return entry;
  }
}
