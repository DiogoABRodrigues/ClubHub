import { redis } from "../config/redis";

const DEFAULT_TTL = 60 * 60; // 1 hora

export const cacheGet = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const cacheSet = async (
  key: string,
  value: any,
  ttl = DEFAULT_TTL
) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const cacheDel = async (key: string) => {
  await redis.del(key);
};