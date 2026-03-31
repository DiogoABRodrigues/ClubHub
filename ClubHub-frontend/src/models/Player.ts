import { Stats } from "./Stats";

export type Player = {
  id: number;
  externalId: number;
  name: string;
  photoUrl?: string | null;
  age: number | null;
  stillOnTeam?: boolean;
  Stats?: Stats[];
};
