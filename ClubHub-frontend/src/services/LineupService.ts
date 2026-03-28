import { api } from "./api";
import { Lineup } from "../models/Lineup";

export const LineupService = {
  getAll: async (matchId?: number): Promise<Lineup[]> => {
    const url = matchId ? `/lineups?matchId=${matchId}` : "/lineups";
    const { data } = await api.get(url);
    return data;
  },

  create: async (lineup: Partial<Lineup>): Promise<Lineup> => {
    const { data } = await api.post("/lineups", lineup);
    return data;
  },

  update: async (id: number, updates: Partial<Lineup>): Promise<Lineup> => {
    const { data } = await api.patch(`/lineups/${id}`, updates);
    return data;
  },
};