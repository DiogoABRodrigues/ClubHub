// services/TeamService.ts
import { api } from "./api";
import { Team } from "../models/Team";

export const TeamService = {
  getAll: async (): Promise<Team[]> => {
    const { data } = await api.get("/teams");
    return data;
  },
  getByName: async (name: string): Promise<Team[]> => {
    const { data } = await api.get(`/teams/name/${name}`);
    return data;
  },
};
