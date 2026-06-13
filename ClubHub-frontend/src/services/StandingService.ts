import { api } from "./api";
import { Standing } from "../models/Standing";

export const StandingService = {
  getAll: async (): Promise<Standing[]> => {
    const { data } = await api.get("/standings");
    return data;
  },
  getBySeasonId: async (
    seasonId: number,
    category: string = "over19",
  ): Promise<Standing[]> => {
    const { data } = await api.get(`/standings/season/${seasonId}`, {
      params: { category },
    });
    return data;
  },
  getByCurrentSeasonId: async (
    category: string = "over19",
  ): Promise<Standing[]> => {
    const { data } = await api.get("/standings/current", {
      params: { category },
    });
    return data;
  },
};
