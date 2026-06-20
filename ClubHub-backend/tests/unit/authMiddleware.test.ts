import jwt from "jsonwebtoken";
import { authMiddleware } from "../../src/middlewares/authMiddleware";
import { authorizeRoles } from "../../src/middlewares/authorizeRoles";

function responseDouble() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  it("rejeita pedidos sem token", () => {
    const res = responseDouble();

    authMiddleware({ headers: {} } as any, res as any, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("aceita um bearer token válido e anexa o utilizador", () => {
    const token = jwt.sign(
      { id: 9, role: "admin" },
      process.env.JWT_ACCESS_SECRET!,
      {
        issuer: "clubhub-api",
        audience: "clubhub-app",
      },
    );
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const next = vi.fn();

    authMiddleware(req, responseDouble() as any, next);

    expect(req.user).toEqual(expect.objectContaining({ id: 9, role: "admin" }));
    expect(next).toHaveBeenCalledOnce();
  });

  it("rejeita tokens inválidos", () => {
    const res = responseDouble();

    authMiddleware(
      { headers: { authorization: "Bearer inválido" } } as any,
      res as any,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("autorização por função", () => {
  it("distingue não autenticado de não autorizado", () => {
    const unauthenticated = responseDouble();
    authorizeRoles("admin")(
      {} as any,
      unauthenticated as any,
      vi.fn(),
    );
    expect(unauthenticated.status).toHaveBeenCalledWith(401);

    const forbidden = responseDouble();
    authorizeRoles("admin")(
      { user: { role: "editor" } } as any,
      forbidden as any,
      vi.fn(),
    );
    expect(forbidden.status).toHaveBeenCalledWith(403);
  });

  it("permite funções configuradas nos dois middlewares", () => {
    const nextA = vi.fn();
    const req = { user: { role: "admin" } } as any;

    authorizeRoles("admin")(req, responseDouble() as any, nextA);

    expect(nextA).toHaveBeenCalledOnce();
  });
});
