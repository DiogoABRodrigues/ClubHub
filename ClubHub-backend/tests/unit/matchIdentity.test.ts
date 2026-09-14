import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findOne: vi.fn(), create: vi.fn(), update: vi.fn(),
  lineupUpdate: vi.fn(), eventUpdate: vi.fn(),
  competitionFind: vi.fn(), seasonFind: vi.fn(),
  delMany: vi.fn(), del: vi.fn(), transaction: vi.fn(),
}));
vi.mock("../../src/models/Match", () => ({ default: {
  findOne: mocks.findOne, create: mocks.create,
  sequelize: { transaction: mocks.transaction },
} }));
vi.mock("../../src/models/Competition", () => ({ default: { findOne: mocks.competitionFind } }));
vi.mock("../../src/models/Season", () => ({ default: { findOne: mocks.seasonFind } }));
vi.mock("../../src/models/Lineup", () => ({ default: { update: mocks.lineupUpdate } }));
vi.mock("../../src/models/MatchEvent", () => ({ default: { update: mocks.eventUpdate } }));
vi.mock("../../src/models/Player", () => ({ default: {} }));
vi.mock("../../src/utils/browser", () => ({ getSharedBrowser: vi.fn() }));
vi.mock("../../src/services/cache.service", () => ({ default: {
  delMany: mocks.delMany, del: mocks.del,
} }));

import { saveMatches, ScrapedMatch } from "../../src/scrapers/matchScraper";

const transaction = { LOCK: { UPDATE: "UPDATE" } };
const fixture: ScrapedMatch = {
  externalId: 12676869, date: "2027-01-30", time: "15:00",
  homeOrAway: "F", opponent: "Melgacense", opponentExternalId: 17873,
  result: null, competition: "AF Viana Jun. B 2026/2027",
  competitionExternalId: 223911, competitionUrl: null, seasonId: 156,
  round: "J18", outcome: null, matchUrl: null, location: null, formations: null,
};
let stored: Record<string, any>;

beforeEach(() => {
  vi.resetAllMocks();
  stored = {
    id: 2269, externalId: 12634974, teamName: "Adecas", teamExternalId: 282049,
    opponent: fixture.opponent, opponentExternalId: fixture.opponentExternalId,
    competitionId: 37, competitionExternalId: 223911, seasonId: 10,
    category: "sub17", homeOrAway: "F", date: fixture.date, round: "J18",
    update: mocks.update,
  };
  mocks.findOne.mockImplementation(async ({ where }) =>
    Object.entries(where).every(([key, value]) => stored[key] === value) ? stored : null,
  );
  mocks.update.mockImplementation(async (values) => ({ ...stored, ...values }));
  mocks.create.mockImplementation(async (values) => ({ id: 9999, ...values }));
  mocks.transaction.mockImplementation(async (callback) => callback(transaction));
  mocks.seasonFind.mockResolvedValue({ id: 10 });
  mocks.competitionFind.mockResolvedValue({
    id: 37, seasonId: 10, seasonYear: "2026/2027", update: vi.fn(),
  });
});

const save = (changes: Partial<ScrapedMatch> = {}) =>
  saveMatches("Adecas", 282049, [{ ...fixture, ...changes }], "sub17");

describe("match external identity reconciliation", () => {
  it("replaces a confirmed ID and updates existing relations without formations", async () => {
    await save();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ externalId: 12676869 }), { transaction },
    );
    for (const update of [mocks.lineupUpdate, mocks.eventUpdate]) {
      expect(update).toHaveBeenCalledWith(
        { matchExternalId: 12676869 }, { where: { matchId: 2269 }, transaction },
      );
    }
    expect(mocks.delMany).toHaveBeenCalled();
  });

  it("does not erase a tracked ID when the provider omits it", async () => {
    await save({ externalId: null });
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ externalId: 12634974 }), { transaction },
    );
    expect(mocks.lineupUpdate).not.toHaveBeenCalled();
    expect(mocks.eventUpdate).not.toHaveBeenCalled();
  });

  it("keeps matching by external ID when a fixture is rescheduled", async () => {
    await save({ externalId: stored.externalId, date: "2027-02-01" });
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ date: "2027-02-01" }), { transaction },
    );
  });

  it.each([
    { round: "J19" }, { category: "over19" },
    { seasonId: 9 }, { competitionId: 38 }, { homeOrAway: "C" },
  ])("does not replace a different fixture: %j", async (changes) => {
    Object.assign(stored, changes);
    await save();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.lineupUpdate).not.toHaveBeenCalled();
  });

  it("reconciles a new provider ID when the same round is rescheduled", async () => {
    stored.date = "2026-09-19";
    stored.round = "J1";
    stored.externalId = 12634889;
    stored.opponent = "Atlético dos Arcos";
    stored.opponentExternalId = 394012;
    await save({
      externalId: 12676802, date: "2026-09-20", round: "J1",
      opponent: "Atlético dos Arcos", opponentExternalId: 394012,
    });
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ externalId: 12676802, date: "2026-09-20" }),
      { transaction },
    );
    for (const update of [mocks.lineupUpdate, mocks.eventUpdate]) {
      expect(update).toHaveBeenCalledWith(
        { matchExternalId: 12676802 }, { where: { matchId: 2269 }, transaction },
      );
    }
  });

  it("does not replace an ID without a known round", async () => {
    stored.round = "";
    await expect(save({ round: "" })).rejects.toThrow("Não foi possível confirmar");
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it.each([
    { teamExternalId: 123 }, { opponentExternalId: 123 },
    { competitionExternalId: 123 },
  ])("rejects conflicting provider identity: %j", async (changes) => {
    Object.assign(stored, changes);
    await expect(save()).rejects.toThrow("Não foi possível confirmar");
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("propagates relation failures out of the transaction and skips cache success", async () => {
    mocks.eventUpdate.mockRejectedValue(new Error("relation update failed"));
    await expect(save()).rejects.toThrow("relation update failed");
    expect(mocks.update.mock.calls[0][1].transaction).toBe(transaction);
    expect(mocks.lineupUpdate.mock.calls[0][1].transaction).toBe(transaction);
    expect(mocks.eventUpdate.mock.calls[0][1].transaction).toBe(transaction);
    expect(mocks.delMany).not.toHaveBeenCalled();
  });
});
