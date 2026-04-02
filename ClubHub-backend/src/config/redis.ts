import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL não definido nas variáveis de ambiente");
}

export const redis = createClient({
  url: redisUrl,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("connect", () => {
  console.log("Redis conectado");
});

redis.on("ready", () => {
  console.log("Redis pronto para uso");
});

// inicia a conexão imediatamente
export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};