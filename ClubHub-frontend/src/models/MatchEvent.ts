export type MatchEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution";

export type MatchEvent = {
  id?: number;
  matchId: number;

  type: MatchEventType;

  minute: number;

  playerId?: number | null;
  playerInId?: number | null;
  playerOutId?: number | null;

  isOpponent: boolean;
  isOwnGoal?: boolean;
};
