import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import Season from "../models/Season";

export default class SeasonService {
  async getAll() {
    return Season.findAll({ order: [["id", "ASC"]] });
  }

  async getById(id: number) {
    return Season.findByPk(id);
  }

  async getCurrentSeason() {
    const key = CacheKeys.season.current;

    const cached = await cache.get(key);
    if (cached) return cached;

    // Determina o ano da época atual pela data (mês >= 8 → nova época)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1–12
    const currentYear =
      month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;

    // Procura a época pelo year calculado
    let season = await Season.findOne({ where: { year: currentYear } });

    // Fallback: se ainda não existir na BD, pega na mais recente por id
    if (!season) {
      season = await Season.findOne({ order: [["id", "DESC"]] });
    }

    await cache.set(key, season, 60 * 60 * 24);

    return season;
  }
}