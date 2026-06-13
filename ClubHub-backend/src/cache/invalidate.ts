import cache from "../services/cache.service";
import { CacheKeys } from "./keys";

class CacheInvalidator {
  async invalidate(type: string, params?: any) {
    const category = params?.category ?? "over19";

    switch (type) {
      case "season":
        await cache.del(CacheKeys.season.current);
        break;

      case "matches":
        await cache.del(CacheKeys.matches.bySeason(params.seasonId, category));
        break;

      case "players":
        await cache.del(CacheKeys.players.bySeason(params.seasonId, category));
        break;

      case "stats":
        await cache.del(CacheKeys.stats.bySeason(params.seasonId, category));
        break;

      case "standings":
        await Promise.all([
          cache.del(CacheKeys.standings.bySeason(params.seasonId, category)),
          cache.del(CacheKeys.standings.all),
        ]);
        break;

      case "squad":
        await cache.del(CacheKeys.squad.bySeason(params.seasonId, category));
        break;

      case "news":
        await cache.del(CacheKeys.news.last10);
        break;

      case "competitions":
        await Promise.all([
          cache.del(CacheKeys.competitions.all),
          cache.del(CacheKeys.competitions.bySeason(params.seasonId)),
        ]);
        break;

      case "teams":
        await cache.del(CacheKeys.teams.all);
        break;

      case "player-stats":
        await cache.del(CacheKeys.players.allStatsByPlayer(params.playerId));
        break;

      case "all-season-dependent":
        await Promise.all([
          cache.del(CacheKeys.matches.bySeason(params.seasonId, category)),
          cache.del(CacheKeys.players.bySeason(params.seasonId, category)),
          cache.del(CacheKeys.stats.bySeason(params.seasonId, category)),
          cache.del(CacheKeys.standings.bySeason(params.seasonId, category)),
          cache.del(CacheKeys.standings.all),
          cache.del(CacheKeys.squad.bySeason(params.seasonId, category)),
          cache.del(CacheKeys.competitions.all),
          cache.del(CacheKeys.competitions.bySeason(params.seasonId)),
          cache.del(CacheKeys.teams.all),
        ]);
        break;
    }
  }
}

export default new CacheInvalidator();
