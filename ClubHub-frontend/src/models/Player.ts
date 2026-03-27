import { Stats } from "./Stats";

export type Player = {
  id: number;
  externalId: number;
  name: string;
  photoUrl?: string | null;
  age: number | null;
};

export interface PlayerWithStats extends Player {
  stats: Stats;
}
