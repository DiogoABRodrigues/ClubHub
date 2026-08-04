import { Lineup } from "./Lineup";
import { MatchEvent } from "./MatchEvent";

export type Match = {
  id: number;
  externalId?: number | null;
  category: "over19" | "sub19" | "sub17" | "sub15" | "sub13";
  teamExternalId?: number | null;
  teamName: string;
  date: string; // ISO string
  time?: string;
  homeOrAway: "C" | "F";
  opponent: string;
  opponentExternalId?: number | null;
  result?: string | null;
  competitionExternalId?: number | null;
  competitionId?: number | null;
  seasonId?: number | null;
  seasonYear?: string | null;
  round?: string;
  outcome?: "V" | "E" | "D" | null;
  status: "upcoming" | "live" | "finished";
  createdAt: string;
  updatedAt: string;
  location?: string;
  events?: MatchEvent[];
  statusTime?: "1st" | "interval" | "2nd" | "extra" | "penalties";
  decidedByPenalties?: boolean;
  Lineups?: Lineup[];
};
