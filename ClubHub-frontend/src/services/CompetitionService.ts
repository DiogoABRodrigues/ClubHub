// services/CompetitionService.ts
import { api } from "./api";
import { Competition } from "../models/Competition";

export const CompetitionService = {
  getAll: async (): Promise<Competition[]> => {
    const { data } = await api.get("/competitions");
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Competition[]> => {
    const { data } = await api.get(`/competitions/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Competition[]> => {
    const { data } = await api.get("/competitions/current");
    return data;
  },
};
