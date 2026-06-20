import request from "supertest";

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock("../../src/config/database", async () => {
  const { Sequelize } = await import("sequelize-typescript");

  return {
    sequelize: new Sequelize(
      "postgresql://clubhub:clubhub@localhost:5432/clubhub_test",
      { logging: false },
    ),
  };
});

vi.mock("../../src/config/firebase", () => ({
  fcm: { send: vi.fn(), sendEachForMulticast: vi.fn() },
}));

vi.mock("../../src/services/firebase.service", () => ({
  default: {
    messaging: vi.fn(() => ({
      send: vi.fn(),
      sendEachForMulticast: vi.fn(),
    })),
  },
}));

vi.mock("../../src/lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  },
}));

const { default: app } = await import("../../src/app");

describe("API HTTP", () => {
  it("expõe health check sem cache", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
    expect(response.headers["cache-control"]).toBe("no-store");
  });

  it("expõe informação mínima na raiz", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "ClubHub API", status: "ok" });
  });

  it("aplica headers de segurança", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("devolve JSON normalizado para rotas inexistentes", async () => {
    const response = await request(app).get("/rota-inexistente");

    expect(response.status).toBe(404);
    expect(response.body.message).toContain(
      "Rota nao encontrada: GET /rota-inexistente",
    );
  });

  it("protege endpoints autenticados", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("aceita JSON até ao limite configurado e rejeita payloads excessivos", async () => {
    const response = await request(app)
      .post("/api/auth/refresh")
      .send({ value: "x".repeat(1_100_000) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ message: "Payload demasiado grande." });
  });
});
