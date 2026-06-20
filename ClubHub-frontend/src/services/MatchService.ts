import { api, publicApi } from "./api";
import { Match } from "../models/Match";

export type CupRound = {
  round: string;
  matches: Match[];
};

export const MatchService = {
  getAll: async (): Promise<Match[]> => {
    const { data } = await publicApi.get("/matches");
    return data;
  },
  getBySeasonId: async (
    seasonId: number,
    category: string = "over19",
  ): Promise<Match[]> => {
    const { data } = await publicApi.get(`/matches/season/${seasonId}`, {
      params: { category },
    });
    return data;
  },
  getById: async (id: number): Promise<Match> => {
    const { data } = await publicApi.get(`/matches/${id}`);
    return data;
  },
  getByCurrentSeasonId: async (
    category: string = "over19",
  ): Promise<Match[]> => {
    const { data } = await publicApi.get("/matches/current", {
      params: { category },
    });
    return data;
  },
  getByCompetitionId: async (competitionId: number): Promise<CupRound[]> => {
    const { data } = await publicApi.get(`/matches/by-competition/${competitionId}`);
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
