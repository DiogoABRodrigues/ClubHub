const mocks = vi.hoisted(() => ({
  refreshAndBroadcast: vi.fn(),
  eventFindByPk: vi.fn(),
  eventFindAll: vi.fn(),
  matchFindByPk: vi.fn(),
}));

vi.mock("../../src/config/database", () => ({
  sequelize: {
    transaction: vi.fn(async (callback) =>
      callback({ LOCK: { UPDATE: "UPDATE" } }),
    ),
  },
}));
vi.mock("../../src/models/MatchEvent", () => ({
  default: {
    findByPk: mocks.eventFindByPk,
    findAll: mocks.eventFindAll,
    create: vi.fn(),
  },
}));
vi.mock("../../src/models/Match", () => ({
  default: { findByPk: mocks.matchFindByPk },
}));
vi.mock("../../src/services/match.service", () => ({
  default: class {
    refreshAndBroadcast = mocks.refreshAndBroadcast;
  },
}));
vi.mock("../../src/utils/getNotificationsEnabled", () => ({
  getNotificationsEnabled: vi.fn(async () => false),
}));
vi.mock("../../src/utils/eventSpamGuard", () => ({
  default: { isDuplicate: vi.fn(async () => false) },
}));
vi.mock("../../src/services/push.service", () => ({
  pushService: { sendToDevices: vi.fn() },
}));
vi.mock("../../src/services/device.service", () => ({
  default: { getDevicesForGoals: vi.fn(async () => []) },
}));
vi.mock("../../src/models/Player", () => ({
  default: { findByPk: vi.fn() },
}));

import service from "../../src/services/matchEvent.service";

describe("MatchEventService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recalcula o resultado ao eliminar um golo", async () => {
    const event = {
      id: 10,
      matchId: 4,
      type: "goal",
      minute: 20,
      destroy: vi.fn(),
    };
    const match = {
      id: 4,
      homeOrAway: "C",
      category: "over19",
      status: "live",
      update: vi.fn(),
    };
    mocks.eventFindByPk.mockResolvedValue(event);
    mocks.matchFindByPk.mockResolvedValue(match);
    mocks.eventFindAll.mockResolvedValue([
      { isOpponent: false, isOwnGoal: false },
      { isOpponent: true, isOwnGoal: false },
      { isOpponent: true, isOwnGoal: true },
    ]);

    await service.deleteEvent(10);

    expect(event.destroy).toHaveBeenCalledOnce();
    expect(match.update).toHaveBeenCalledWith(
      { result: "2-1" },
      expect.objectContaining({ transaction: expect.anything() }),
    );
    expect(mocks.refreshAndBroadcast).toHaveBeenCalledWith(4);
  });
});
