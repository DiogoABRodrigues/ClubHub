const redisMock = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  scan: vi.fn(),
}));

vi.mock("../../src/config/redis", () => ({ redis: redisMock }));

import cache from "../../src/services/cache.service";

describe("CacheService", () => {
  beforeEach(() => {
    redisMock.get.mockReset();
    redisMock.set.mockReset();
    redisMock.del.mockReset();
    redisMock.scan.mockReset();
  });

  it("deduplica carregamentos concorrentes para a mesma chave", async () => {
    redisMock.get.mockResolvedValue(null);
    redisMock.set.mockResolvedValue("OK");
    const loader = vi.fn(async () => [{ id: 1 }]);

    const [first, second] = await Promise.all([
      cache.remember("same-key", loader),
      cache.remember("same-key", loader),
    ]);

    expect(loader).toHaveBeenCalledOnce();
    expect(first).toEqual([{ id: 1 }]);
    expect(second).toEqual(first);
  });

  it("não deixa uma falha Redis impedir o acesso à base de dados", async () => {
    redisMock.get.mockRejectedValue(new Error("redis offline"));
    redisMock.set.mockRejectedValue(new Error("redis offline"));
    const loader = vi.fn(async () => "database-value");

    await expect(cache.remember("fallback", loader)).resolves.toBe(
      "database-value",
    );
  });

  it("liberta uma chave in-flight quando o loader fica preso", async () => {
    vi.useFakeTimers();
    vi.resetModules();
    process.env.CACHE_IN_FLIGHT_TIMEOUT_MS = "50";

    try {
      redisMock.get.mockResolvedValue(null);
      redisMock.set.mockResolvedValue("OK");

      const { default: freshCache } = await import(
        "../../src/services/cache.service"
      );
      const stuckLoader = vi.fn(() => new Promise<string>(() => {}));

      const first = freshCache.remember("stuck-key", stuckLoader);
      const firstExpectation = expect(first).rejects.toThrow(
        "Cache loader timed out",
      );
      await vi.advanceTimersByTimeAsync(50);
      await firstExpectation;

      const recoveryLoader = vi.fn(async () => "recovered");
      await expect(
        freshCache.remember("stuck-key", recoveryLoader),
      ).resolves.toBe("recovered");

      expect(stuckLoader).toHaveBeenCalledOnce();
      expect(recoveryLoader).toHaveBeenCalledOnce();
    } finally {
      delete process.env.CACHE_IN_FLIGHT_TIMEOUT_MS;
      vi.useRealTimers();
    }
  });
});
