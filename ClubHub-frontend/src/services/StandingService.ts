// services/StandingService.ts
import { api } from './api';
import { Standing } from '../models/Standing';

export const StandingService = {
  getAll: async (): Promise<Standing[]> => {
    const { data } = await api.get('/standings');
    return data;
  },
  getBySeasonId: async (seasonId: number): Promise<Standing[]> => {
    const { data } = await api.get(`/standings/season/${seasonId}`);
    return data;
  },
  getByCurrentSeasonId: async (): Promise<Standing[]> => {
    const { data } = await api.get('/standings/current');
    return data;
  },
};