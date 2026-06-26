import { redis } from "../config/redis";

class CacheService {
  private defaultTTL = 60 * 60 * 24;
  private stableTTL = 60 * 60 * 24;
  private inFlightTimeoutMs = Number(process.env.CACHE_IN_FLIGHT_TIMEOUT_MS) || 25_000;
  private inFlight = new Map<string, Promise<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data !== null ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`Redis GET falhou para ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl = this.defaultTTL) {
    try {
      await redis.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
      console.error(`Redis SET falhou para ${key}:`, error);
    }
  }

  /** Cache estável com TTL de segurança para recuperar de invalidações falhadas. */
  async setPermanent(key: string, value: unknown) {
    await this.set(key, value, this.stableTTL);
  }

  async remember<T>(
    key: string,
    loader: () => Promise<T>,
    ttl = this.stableTTL,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const existing = this.inFlight.get(key) as Promise<T> | undefined;
    if (existing) return existing;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        this.inFlight.delete(key);
        reject(new Error(`Cache loader timed out for ${key}`));
      }, this.inFlightTimeoutMs);
    });

    const loading = Promise.race([
      loader().then(async (value) => {
        await this.set(key, value, ttl);
        return value;
      }),
      timeoutPromise,
    ]).finally(() => {
      if (timeout) clearTimeout(timeout);
      this.inFlight.delete(key);
    });

    this.inFlight.set(key, loading);
    return loading;
  }

  async del(key: string) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Redis DEL falhou para ${key}:`, error);
    }
  }

  async delMany(keys: string[]) {
    if (!keys.length) return;
    try {
      await redis.del(keys);
    } catch (error) {
      console.error("Redis DEL múltiplo falhou:", error);
    }
  }

  async clearPattern(pattern: string) {
    try {
      let cursor = "0";
      do {
        const result = await redis.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        cursor = result.cursor;
        if (result.keys.length) await redis.del(result.keys);
      } while (cursor !== "0");
    } catch (error) {
      console.error(`Redis SCAN falhou para ${pattern}:`, error);
    }
  }
}

export default new CacheService();
