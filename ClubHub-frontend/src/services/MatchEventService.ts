import { api } from "./api";
import { MatchEvent } from "../models/MatchEvent";

export const MatchEventService = {
  create: async (
    matchId: number,
    event: Partial<MatchEvent>,
  ): Promise<MatchEvent> => {
    const { data } = await api.post(`/match-events/${matchId}/events`, event);
    return data;
  },

  update: async (
    eventId: number,
    updates: Partial<MatchEvent>,
  ): Promise<MatchEvent> => {
    const { data } = await api.put(`/match-events/events/${eventId}`, updates);
    return data;
  },

  delete: async (eventId: number): Promise<void> => {
    await api.delete(`/match-events/events/${eventId}`);
  },
};