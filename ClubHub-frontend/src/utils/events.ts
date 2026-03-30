import { Player } from "../models/Player";

export type EventType = "goal" | "yellow_card" | "red_card" | "substitution";
 
export interface EventForm {
  type: EventType;
  player?: Player | null;
  playerOut?: Player | null; // para substituição: jogador que sai
  playerIn?: Player | null;  // para substituição: jogador que entra
  minute?: string;
  isOpponent?: boolean;
}

export const createEventFromForm = (form: EventForm) => {
  const minute = Number(form.minute);

  if (form.type === "substitution") {
    return {
      id: Date.now().toString(),
      type: form.type,
      minute,
      playerOut: form.playerOut?.name || null,
      playerIn: form.playerIn?.name || null,
      description: `Substituição: ${form.playerOut?.name} sai, ${form.playerIn?.name} entra`,
    };
  }

  if (form.type === "goal") {
    return {
      id: Date.now().toString(),
      type: form.type,
      minute,
      player: form.player?.name || null,
      description: form.isOpponent
        ? `Golo da equipa adversária`
        : ``,
    };
  }

  if (form.type === "red_card") {
    return {
      id: Date.now().toString(),
      type: form.type,
      minute,
      player: form.player?.name || null,
      description: form.isOpponent
        ? `Cartão vermelho adversário`
        : `Cartão vermelho para ${form.player?.name}`,
    };
  }

  return {
    id: Date.now().toString(),
    type: form.type,
    minute,
    player: form.player?.name || null,
    description: "",
  };
};