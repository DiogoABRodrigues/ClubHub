import Team from "../models/Team";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class TeamService {
  async getAll() {
    const key = "app:teams:all";

    const cached = await cache.get(key);
    if (cached) return cached;

    const teams = await Team.findAll();

    await cache.set(key, teams);

    return teams;
  }

  async getByName(name: string) {
    return Team.findAll({ where: { name } });
  }
}
