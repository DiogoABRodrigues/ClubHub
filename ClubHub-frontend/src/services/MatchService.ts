import { api } from "./api";
import { Match } from "../models/Match";

export const MatchService = {
  getAll: async (): Promise<Match[]> => {
    const { data } = await api.get("/matches");
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Match[]> => {
    const { data } = await api.get(`/matches/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Match[]> => {
    const { data } = await api.get("/matches/current");
    return data;
  },
  create: async (match: Partial<Match>): Promise<Match> => {
    const { data } = await api.post("/matches", match);
    return data;
  },
  update: async (id: number, updates: Partial<Match>): Promise<Match> => {
    const { data } = await api.patch(`/matches/${id}`, updates);
    return data;
  },
};