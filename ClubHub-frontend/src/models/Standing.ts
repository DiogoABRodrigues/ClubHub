export type Standing = {
  id: number;
  teamName: string;
  competitionId?: number;
  seasonId: number;
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