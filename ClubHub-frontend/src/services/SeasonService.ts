import { api } from "./api";
import { Season } from "../models/Season";

export const SeasonService = {
  getAll: async (): Promise<Season[]> => {
    const { data } = await api.get("/seasons");
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Season> => {
    const { data } = await api.get(`/seasons/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Season> => {
    const { data } = await api.get("/seasons/current");
    return data;
  },
  getByCategory: async (category: string): Promise<Season[]> => {
    const { data } = await api.get(`/seasons/by-category/${category}`);
    return data;
  },
};