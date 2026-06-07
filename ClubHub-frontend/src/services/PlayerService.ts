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
  /** Todas as stats de todas as épocas — usado no PlayerCardModal */
  getAllStats: async (playerId: number): Promise<Player> => {
    const { data } = await api.get(`/players/${playerId}/allstats`);
    return data;
  },
  updatePlayer: async (
    playerId: number,
    updates: Partial<Player>,
  ): Promise<Player> => {
    const { data } = await api.put(`/players/${playerId}`, updates);
    return data;
  },
};