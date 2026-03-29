import { Player } from "./Player";

export type Lineup = {
  id: number;
  matchId: number;
  playerId: number;
  isStarting: boolean;
  Player?: Player;
};
