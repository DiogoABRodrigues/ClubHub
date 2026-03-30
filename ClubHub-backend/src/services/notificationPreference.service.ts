import NotificationPreference from "../models/NotificationPreference";

export const addOrUpdatePreference = async (
  deviceId: string,
  teamId: string,
  matchId: string | null,
  events: string[],
) => {
  const pref = await NotificationPreference.findOne({
    where: { deviceId, teamId, matchId },
  });
  if (pref) {
    pref.events = events;
    return pref.save();
  }
  return NotificationPreference.create({ deviceId, teamId, matchId, events });
};

export const removePreference = async (
  deviceId: string,
  teamId: string,
  matchId?: string,
) => {
  return NotificationPreference.destroy({
    where: { deviceId, teamId, matchId },
  });
};

export const getPreferencesForEvent = async (
  teamId: string,
  matchId: string | null,
  eventType: string,
) => {
  return NotificationPreference.findAll({
    where: {
      teamId,
      matchId,
      events: { [NotificationPreference.sequelize.Op.contains]: [eventType] },
    },
    include: ["Device"],
  });
};
