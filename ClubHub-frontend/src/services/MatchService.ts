import { api } from "./api";
import { Match } from "../models/Match";

export const MatchService = {
  getAll: async (): Promise<Match[]> => {
    const { data } = await api.get("/matches");
    return data;
  },
  getBySeasonId: async (seasonId: number, category: string = "over19"): Promise<Match[]> => {
    const { data } = await api.get(`/matches/season/${seasonId}`, { params: { category } });
    return data;
  },
  getByCurrentSeasonId: async (category: string = "over19"): Promise<Match[]> => {
    const { data } = await api.get("/matches/current", { params: { category } });
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