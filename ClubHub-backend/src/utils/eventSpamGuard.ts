class EventSpamGuard {
  private cache = new Map<string, number>();

  private TTL = 30 * 1000; // 30 segundos

  isDuplicate(key: string): boolean {
    const now = Date.now();
    const existing = this.cache.get(key);

    if (existing && now - existing < this.TTL) {
      return true;
    }

    this.cache.set(key, now);
    return false;
  }

  cleanup() {
    const now = Date.now();

    for (const [key, timestamp] of this.cache.entries()) {
      if (now - timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

export default new EventSpamGuard();