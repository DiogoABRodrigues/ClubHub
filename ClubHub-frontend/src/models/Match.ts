import { Lineup } from "./Lineup";
import { MatchEvent } from "./MatchEvent";

export type Match = {
  id: number;
  category: "Senior" | "U19" | "U17" | "U15";
  teamName: string;
  date: string; // ISO string
  time?: string;
  homeOrAway: "C" | "F";
  opponent: string;
  result?: string | null;
  competitionId?: number | null;
  seasonId?: number | null;
  round?: string;
  outcome?: "V" | "E" | "D" | null;
  status: "upcoming" | "live" | "finished" | "halftime";
  createdAt: string;
  updatedAt: string;
  location?: string;
  events?: MatchEvent[];
  statusTime?: "1st" | "interval" | "2nd" | "extra" | "penalties";
  decidedByPenalties?: boolean;
  Lineups?: Lineup[];
};
