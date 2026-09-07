export type MatchEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "penalty_shootout";

export type MatchEvent = {
  id?: number;
  matchId: number;
  matchExternalId?: number | null;

  type: MatchEventType;

  minute: number;

  /** Para eventos normais: fase do jogo em que ocorreu */
  phase?: "1st" | "2nd" | "extra" | "penalties" | "interval";

  playerId?: number | null;
  playerInId?: number | null;
  playerOutId?: number | null;
  playerExternalId?: number | null;
  playerInExternalId?: number | null;
  playerOutExternalId?: number | null;

  isOpponent: boolean;
  isOwnGoal?: boolean;
  isSecondYellow?: boolean;

  /** Num golo normal indica g.p.; na série indica marcado/falhado. */
  penaltyScored?: boolean | null;

  createdAt?: Date;
};
