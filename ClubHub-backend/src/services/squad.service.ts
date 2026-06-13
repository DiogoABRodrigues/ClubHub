import Squad from "../models/Squad";
import SeasonService from "./season.service";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class SquadService {
  async getAll() {
    return Squad.findAll();
  }

  async getBySeasonId(seasonId: number, category: string = "over19") {
    return Squad.findAll({ where: { seasonId, category } });
  }

  async getByCurrentSeasonId(category: string = "over19") {
    const season = await new SeasonService().getCurrentSeason();
    if (!season || typeof season !== "object" || !("id" in season)) return [];
    const seasonId = (season as { id: number }).id;
    const key = CacheKeys.squad.bySeason(seasonId, category);

    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await Squad.findAll({ where: { seasonId, category } });
    await cache.set(key, data);
    return data;
  }

  async updateStatus(
    playerExternalId: number,
    seasonId: number,
    status: "active" | "left" | "error",
    category: string = "over19",
  ) {
    const entry = await Squad.findOne({
      where: { playerExternalId, seasonId, category },
    });
    if (!entry) throw new Error("Squad entry not found");

    await entry.update({ status });

    await cache.del(CacheKeys.squad.bySeason(seasonId, category));
    await cache.del(CacheKeys.players.bySeason(seasonId, category));

    return entry;
  }
}
