import { redis } from "../config/redis";

const DEFAULT_TTL = 60 * 60; // 1 hora

export const cacheGet = async <T = any>(key: string): Promise<T | null> => {
  const data = await redis.get(key);

  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttl = DEFAULT_TTL) => {
  await redis.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};
export const cacheDel = async (key: string) => {
  await redis.del(key);
};

export const cacheDelPattern = async (pattern: string) => {
  let cursor = "0";

  do {
    const { cursor: nextCursor, keys } = await redis.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    cursor = nextCursor;

    if (keys.length) {
      await redis.del(keys);
    }
  } while (cursor !== "0");
};

export const cacheExists = async (key: string) => {
  return (await redis.exists(key)) === 1;
};
