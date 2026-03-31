import MatchEvent from "../models/MatchEvent";

export const createEvent = async (matchId: number, data: any) => {
  return await MatchEvent.create({ ...data, matchId });
};

export const updateEvent = async (eventId: number, data: any) => {
  await MatchEvent.update(data, { where: { id: eventId } });
  return await MatchEvent.findByPk(eventId);
};

export const deleteEvent = async (eventId: number) => {
  return await MatchEvent.destroy({ where: { id: eventId } });
};

export const getEventsByMatch = async (matchId: number) => {
  return await MatchEvent.findAll({
    where: { matchId },
    order: [["minute", "ASC"]],
  });
};