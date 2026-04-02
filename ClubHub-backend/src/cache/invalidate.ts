import cache from "../services/cache.service";
import { CacheKeys } from "./keys";

class CacheInvalidator {
  async invalidate(type: string, params?: any) {
    switch (type) {
      case "season":
        await cache.del(CacheKeys.season.current);
        break;

      case "matches":
        await cache.del(CacheKeys.matches.bySeason(params.seasonId));
        break;

      case "players":
        await cache.del(CacheKeys.players.bySeason(params.seasonId));
        break;

      case "stats":
        await cache.del(CacheKeys.stats.bySeason(params.seasonId));
        break;

      case "standings":
        await cache.del(CacheKeys.standings.bySeason(params.seasonId));
        break;

      case "squad":
        await cache.del(CacheKeys.squad.bySeason(params.seasonId));
        break;

      case "news":
        await cache.del(CacheKeys.news.last10);
        break;

      case "all-season-dependent":
        await Promise.all([
          cache.del(CacheKeys.matches.bySeason(params.seasonId)),
          cache.del(CacheKeys.players.bySeason(params.seasonId)),
          cache.del(CacheKeys.stats.bySeason(params.seasonId)),
          cache.del(CacheKeys.standings.bySeason(params.seasonId)),
          cache.del(CacheKeys.squad.bySeason(params.seasonId)),
        ]);
        break;
    }
  }
}

export default new CacheInvalidator();