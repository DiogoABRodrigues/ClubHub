jest.mock("../../src/services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
  publicApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

import { api, publicApi } from "../../src/services/api";
import { HelperService } from "../../src/services/HelperService";
import { MatchService } from "../../src/services/MatchService";
import { SeasonService } from "../../src/services/SeasonService";
import { TeamService } from "../../src/services/TeamService";

const mockedApi = api as jest.Mocked<typeof api>;
const mockedPublicApi = publicApi as jest.Mocked<typeof publicApi>;

describe("contratos dos serviços HTTP", () => {
  it("consulta equipas pelo endpoint esperado", async () => {
    mockedPublicApi.get.mockResolvedValueOnce({
      data: [{ id: 1, name: "ADECAS" }],
    });

    await expect(TeamService.getAll()).resolves.toEqual([
      { id: 1, name: "ADECAS" },
    ]);
    expect(mockedPublicApi.get).toHaveBeenCalledWith("/teams");
  });

  it("envia categoria como query ao consultar jogos da época", async () => {
    mockedPublicApi.get.mockResolvedValueOnce({ data: [] });

    await MatchService.getBySeasonId(4, "under17");

    expect(mockedPublicApi.get).toHaveBeenCalledWith(
      "/matches/season/4",
      { params: { category: "under17" } },
    );
  });

  it("envia alterações parciais para o jogo correto", async () => {
    mockedApi.patch.mockResolvedValueOnce({
      data: { id: 8, status: "finished" },
    });

    await expect(
      MatchService.update(8, { status: "finished" }),
    ).resolves.toEqual({ id: 8, status: "finished" });
    expect(mockedApi.patch).toHaveBeenCalledWith("/matches/8", {
      status: "finished",
    });
  });

  it("consulta a época atual e as categorias disponíveis", async () => {
    mockedPublicApi.get
      .mockResolvedValueOnce({ data: { id: 5 } })
      .mockResolvedValueOnce({ data: [{ key: "over19" }] });

    await expect(SeasonService.getByCurrentSeasonId()).resolves.toEqual({
      id: 5,
    });
    await expect(HelperService.getAllCategoriesAvailable()).resolves.toEqual([
      { key: "over19" },
    ]);

    expect(mockedPublicApi.get).toHaveBeenNthCalledWith(1, "/seasons/current");
    expect(mockedPublicApi.get).toHaveBeenNthCalledWith(
      2,
      "/helper/categories",
    );
  });
});
