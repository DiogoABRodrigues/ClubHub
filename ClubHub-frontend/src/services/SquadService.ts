// services/SquadService.ts
import { api } from "./api";
import { Squad } from "../models/Squad";

export const SquadService = {
  getAll: async (): Promise<Squad[]> => {
    const { data } = await api.get("/squad");
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Squad[]> => {
    const { data } = await api.get(`/squad/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Squad[]> => {
    const { data } = await api.get("/squad/current");
    return data;
  },
};
