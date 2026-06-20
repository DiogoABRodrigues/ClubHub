import { asyncHandler } from "../../src/utils/asyncHandler";

describe("asyncHandler", () => {
  it("encaminha rejeições para o middleware de erro", async () => {
    const error = new Error("falhou");
    const next = vi.fn();
    const handler = asyncHandler(async () => {
      throw error;
    });

    handler({} as any, {} as any, next);
    await vi.waitFor(() => expect(next).toHaveBeenCalledWith(error));
  });

  it("não chama next quando a promise resolve", async () => {
    const next = vi.fn();
    const handler = asyncHandler(async () => "ok");

    handler({} as any, {} as any, next);
    await Promise.resolve();

    expect(next).not.toHaveBeenCalled();
  });
});
