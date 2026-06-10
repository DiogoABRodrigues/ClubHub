import { api } from "./api";
import { Player } from "../models/Player";

export const PlayerService = {
  getAll: async (): Promise<Player[]> => {
    const { data } = await api.get("/players");
    return data;
  },
  getBySeasonId: async (seasonId: number, category: string = "over19"): Promise<Player[]> => {
    const { data } = await api.get(`/players/season/${seasonId}`, { params: { category } });
    return data;
  },
  /** Admin: inclui jogadores marcados como "error" */
  getAllBySeasonId: async (seasonId: number, category: string = "over19"): Promise<Player[]> => {
    const { data } = await api.get(`/players/admin/season/${seasonId}`, { params: { category } });
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
  /** Atualiza o status do jogador num squad/época específicos (admin only). */
  updateSquadStatus: async (
    playerExternalId: number,
    seasonId: number,
    status: "active" | "left" | "error",
    category: string = "over19",
  ): Promise<void> => {
    await api.patch(
      `/squads/${playerExternalId}/season/${seasonId}/status`,
      { status, category },
    );
  },
};