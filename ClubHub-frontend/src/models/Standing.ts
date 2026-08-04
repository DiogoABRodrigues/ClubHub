export type Standing = {
  id: number;
  teamName: string;
  teamExternalId?: number | null;
  competitionExternalId?: number | null;
  competitionId?: number;
  seasonId: number;
  seasonYear?: string | null;
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  rowColor: string | null; // cor vinda do zerozero, ex: "#6aa121"
  createdAt: string;
  updatedAt: string;
};
