import Team from "../models/Team";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class TeamService {
  async getAll() {
    const key = CacheKeys.teams.all;

    return cache.remember(key, () =>
      Team.findAll({ order: [["name", "ASC"]] }),
    );
  }

  async getByName(name: string) {
    return Team.findAll({ where: { name } });
  }
}
