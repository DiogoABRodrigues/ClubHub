// services/CompetitionService.ts
import { publicApi } from "./api";
import { Competition } from "../models/Competition";

export const CompetitionService = {
  getAll: async (): Promise<Competition[]> => {
    const { data } = await publicApi.get("/competitions");
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Competition[]> => {
    const { data } = await publicApi.get(`/competitions/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Competition[]> => {
    const { data } = await publicApi.get("/competitions/current");
    return data;
  },
};
