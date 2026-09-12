import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { SelectedSeasonProvider, useSelectedSeason } from "../../src/contexts/Selectedseasoncontext";
import { Season } from "../../src/models/Season";

let mockCategory = "over19";
let mockSeasons: Season[] = [];
const mockTransition = jest.fn();
jest.mock("../../src/contexts/CategoryContext", () => ({
  useCategory: () => ({ selectedCategory: mockCategory, isReady: true, triggerTransition: mockTransition }),
}));
jest.mock("../../src/hooks/useSeasons", () => ({
  useSeasonsByCategory: () => ({ seasons: mockSeasons }),
}));

const historic = { id: 1, year: "24/25" };
const latest = { id: 2, year: "25/26" };
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SelectedSeasonProvider>{children}</SelectedSeasonProvider>
);

beforeEach(() => {
  mockCategory = "over19";
  mockSeasons = [historic, latest];
});

it("never exposes an unsupported historic season when switching to a cached category", () => {
  const seen: (number | null)[] = [];
  const { result, rerender } = renderHook(() => {
    const value = useSelectedSeason();
    seen.push(value.selectedSeasonId);
    return value;
  }, { wrapper });
  act(() => result.current.setSelectedSeason(historic));
  seen.length = 0;
  mockCategory = "sub17";
  mockSeasons = [latest];
  rerender({});
  expect(result.current.selectedSeasonId).toBe(latest.id);
  expect(seen).not.toContain(historic.id);
});

it("keeps the selected year if it is available in the new category", () => {
  const { result, rerender } = renderHook(useSelectedSeason, { wrapper });
  act(() => result.current.setSelectedSeason(historic));
  mockCategory = "sub19";
  mockSeasons = [historic, latest];
  rerender({});
  expect(result.current.selectedSeasonId).toBe(historic.id);
});

it("clears the selected season when refreshed availability becomes empty", () => {
  const { result, rerender } = renderHook(useSelectedSeason, { wrapper });
  expect(result.current.selectedSeasonId).toBe(latest.id);
  mockSeasons = [];
  rerender({});
  expect(result.current.selectedSeasonId).toBeNull();
  expect(result.current.availableSeasons).toEqual([]);
});

it("waits without an old season for an uncached category, then selects its latest year", () => {
  const { result, rerender } = renderHook(useSelectedSeason, { wrapper });
  act(() => result.current.setSelectedSeason(historic));
  mockCategory = "sub13";
  mockSeasons = [];
  rerender({});
  expect(result.current.selectedSeasonId).toBeNull();
  mockSeasons = [latest];
  rerender({});
  expect(result.current.selectedSeasonId).toBe(latest.id);
});
