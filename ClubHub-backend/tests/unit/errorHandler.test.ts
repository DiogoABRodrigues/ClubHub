import { AppError } from "../../src/errors/AppError";
import {
  errorHandler,
  notFoundHandler,
} from "../../src/middlewares/errorHandler";

function responseDouble() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe("tratamento de erros", () => {
  it("cria um erro 404 com método e URL", () => {
    const next = vi.fn();

    notFoundHandler(
      { method: "GET", originalUrl: "/desconhecida" } as any,
      {} as any,
      next,
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Rota nao encontrada: GET /desconhecida",
        statusCode: 404,
      }),
    );
  });

  it("preserva o estado e detalhes de AppError", () => {
    const res = responseDouble();

    errorHandler(
      new AppError("Dados inválidos", 422, { field: "name" }),
      {} as any,
      res as any,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dados inválidos",
      details: { field: "name" },
    });
  });

  it("normaliza erros inesperados sem expor detalhes", () => {
    const res = responseDouble();
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    errorHandler(
      new Error("segredo interno"),
      {} as any,
      res as any,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro interno do servidor.",
    });
  });
});
