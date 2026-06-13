import { teamConfig } from "../config/teamConfig";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export default class HelperService {
  async getAllCategoriesAvailble() {
    const cached = await cache.get(CacheKeys.categories.enabled);
    if (cached) return cached;

    const enabledCategories = teamConfig.categories.filter((c) => c.enabled);
    await cache.set(CacheKeys.categories.enabled, enabledCategories);

    return enabledCategories;
  }
}
