export type MatchEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "penalty_shootout";

export type MatchEvent = {
  id?: number;
  matchId: number;

  type: MatchEventType;

  minute: number;

  /** Para eventos normais: fase do jogo em que ocorreu */
  phase?: "1st" | "2nd" | "extra" | "penalties";

  playerId?: number | null;
  playerInId?: number | null;
  playerOutId?: number | null;

  isOpponent: boolean;
  isOwnGoal?: boolean;

  /** Apenas para penalty_shootout: true = marcado, false = falhado */
  penaltyScored?: boolean;

  createdAt?: Date;
};
