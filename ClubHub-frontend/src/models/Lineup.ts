import { Player } from "./Player";

export type Lineup = {
  id: number;
  matchId: number;
  matchExternalId?: number | null;
  playerId: number;
  playerExternalId?: number | null;
  isStarting: boolean;
  Player?: Player;
};
