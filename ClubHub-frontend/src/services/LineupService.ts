// services/LineupService.ts
import { api } from './api';
import { Lineup } from '../models/Lineup';

export const LineupService = {
  getAll: async (): Promise<Lineup[]> => {
    const { data } = await api.get('/lineups');
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Lineup[]> => {
    const { data } = await api.get(`/lineups/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Lineup[]> => {
    const { data } = await api.get('/lineups/current');
    return data;
  },
};