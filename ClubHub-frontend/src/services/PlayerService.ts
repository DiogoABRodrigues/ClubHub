// services/PlayerService.ts
import { api } from "./api";
import { Player } from "../models/Player";

export const PlayerService = {
  getAll: async (): Promise<Player[]> => {
    const { data } = await api.get("/players");
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Player[]> => {
    const { data } = await api.get(`/players/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Player[]> => {
    const { data } = await api.get("/players/current");
    return data;
  },
};
