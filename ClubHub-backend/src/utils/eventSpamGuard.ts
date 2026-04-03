import { redis } from "../config/redis";

class EventSpamGuard {
  private TTL = 10; // segundos (melhor que 30)

  async isDuplicate(key: string): Promise<boolean> {
    const result = await redis.set(key, "1", {
      NX: true,
      EX: this.TTL,
    });

    return result === null;
  }
}

export default new EventSpamGuard();
