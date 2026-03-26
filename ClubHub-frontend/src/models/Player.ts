export type Player = {
  id: number;
  externalId: number;
  name: string;
  photoUrl?: string | null;
  gamesPlayed?: number;
  goals?: number;
  minutesPlayed?: number;
  seasonId?: number | null;
  teamId?: number | null;
};