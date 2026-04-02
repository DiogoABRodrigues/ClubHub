import { redis } from "../config/redis";

class CacheService {
  private defaultTTL = 60 * 60; // 1h

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set(key: string, value: any, ttl = this.defaultTTL) {
    await redis.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  async del(key: string) {
    await redis.del(key);
  }

  async delMany(keys: string[]) {
    if (!keys.length) return;
    await redis.del(keys);
  }

  async clearPattern(pattern: string) {
    const keys = await redis.keys(pattern);
    if (!keys.length) return;

    await redis.del(keys);
  }
}

export default new CacheService();