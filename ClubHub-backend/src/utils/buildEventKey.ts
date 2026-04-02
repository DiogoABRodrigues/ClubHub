export const buildEventKey = (event: any, matchId: number) => {
  return `${matchId}:${event.type}:${event.minute}:${event.playerId ?? "none"}`;
};