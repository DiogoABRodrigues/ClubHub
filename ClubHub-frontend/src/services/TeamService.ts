// services/TeamService.ts
import { publicApi } from "./api";
import { Team } from "../models/Team";

export const TeamService = {
  getAll: async (): Promise<Team[]> => {
    const { data } = await publicApi.get("/teams");
    return data;
  },
  getByName: async (name: string): Promise<Team[]> => {
    const { data } = await publicApi.get(`/teams/name/${name}`);
    return data;
  },
};
