// services/StatsService.ts
import { api } from './api';
import { Stats } from '../models/Stats';

export const StatsService = {
  getAll: async (): Promise<Stats[]> => {
    const { data } = await api.get('/stats');
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Stats[]> => {
    const { data } = await api.get(`/stats/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Stats[]> => {
    const { data } = await api.get('/stats/current');
    return data;
  },
};