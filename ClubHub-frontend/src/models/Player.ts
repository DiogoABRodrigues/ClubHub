import { Stats } from "./Stats";

// Reflete o campo "status" do Squad — por época, não global.
export type SquadStatus = "active" | "left" | "error";

export type Player = {
  id: number;
  externalId: number;
  name: string;
  photoUrl?: string | null;
  age: number | null;
  /** Status deste jogador nesta época específica, injetado pelo backend */
  squadStatus?: SquadStatus;
  Stats?: Stats[];
};
