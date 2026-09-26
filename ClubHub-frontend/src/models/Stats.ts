export type Stats = {
  playerExternalId: number;
  seasonId: number;
  seasonYear?: string | null;
  /** Escalão a que este registo de stats pertence (ex: "sub19", "over19") */
  category: string;
  gamesPlayed: number;
  goals: number;
  minutesPlayed: number;
  number: number;
  age: number;
  position: string;
};