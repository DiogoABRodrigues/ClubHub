import { publicApi } from "./api";
import { Stats } from "../models/Stats";

export const StatsService = {
  getAll: async (): Promise<Stats[]> => {
    const { data } = await publicApi.get("/stats");
    return data;
  },
  getBySeasonId: async (
    seasonId: number,
    category: string = "over19",
  ): Promise<Stats[]> => {
    const { data } = await publicApi.get(`/stats/season/${seasonId}`, {
      params: { category },
    });
    return data;
  },
  getByCurrentSeasonId: async (
    category: string = "over19",
  ): Promise<Stats[]> => {
    const { data } = await publicApi.get("/stats/current", { params: { category } });
    return data;
  },
};
