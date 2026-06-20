import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../../src/storage/auth";

describe("armazenamento de autenticação", () => {
  beforeEach(async () => {
    await clearTokens();
  });

  it("guarda e recupera ambos os tokens", async () => {
    await saveTokens("access", "refresh");

    await expect(getAccessToken()).resolves.toBe("access");
    await expect(getRefreshToken()).resolves.toBe("refresh");
  });

  it("remove ambos os tokens no logout", async () => {
    await saveTokens("access", "refresh");
    await clearTokens();

    await expect(getAccessToken()).resolves.toBeNull();
    await expect(getRefreshToken()).resolves.toBeNull();
  });
});
