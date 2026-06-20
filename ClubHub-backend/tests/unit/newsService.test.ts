const mocks = vi.hoisted(() => ({
  findAndCountAll: vi.fn(),
  remember: vi.fn(
    async (_key: string, loader: () => Promise<unknown>) => loader(),
  ),
}));

vi.mock("../../src/models/News", () => ({
  default: {
    findAndCountAll: mocks.findAndCountAll,
  },
}));
vi.mock("../../src/services/cache.service", () => ({
  default: {
    remember: mocks.remember,
    del: vi.fn(),
    clearPattern: vi.fn(),
  },
}));
vi.mock("../../src/services/push.service", () => ({
  pushService: { sendToDevices: vi.fn() },
}));
vi.mock("../../src/services/device.service", () => ({
  default: { getDevicesForNews: vi.fn(async () => []) },
}));
vi.mock("../../src/utils/getNotificationsEnabled", () => ({
  getNotificationsEnabled: vi.fn(async () => false),
}));

import newsService from "../../src/services/news.service";

describe("NewsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pagina notícias e indica quando existe página seguinte", async () => {
    mocks.findAndCountAll.mockResolvedValue({
      rows: [{ id: 11 }, { id: 10 }],
      count: 12,
    });

    await expect(newsService.getAll(2, 5)).resolves.toEqual({
      items: [{ id: 11 }, { id: 10 }],
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
      hasNextPage: true,
    });
    expect(mocks.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 5, offset: 5 }),
    );
  });

  it("normaliza página inválida e limita o tamanho máximo", async () => {
    mocks.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    await newsService.getAll(Number.NaN, 100);

    expect(mocks.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 30, offset: 0 }),
    );
  });
});
