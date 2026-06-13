import { Player } from "../models/Player";

export const POSITION_ORDER: Record<string, number> = {
  "Guarda Redes": 1,
  Defesa: 2,
  Médio: 3,
  Avançado: 4,
  Treinador: 5,
  "Outros Técnicos": 6,
};

export function mapToMainPosition(position: string): string {
  const pos = position?.toLowerCase() || "";
  if (pos === "guarda redes") return "Guarda Redes";
  if (["rb", "cb", "lb", "defesa"].includes(pos)) return "Defesa";
  if (["cm", "cam", "médio"].includes(pos)) return "Médio";
  if (["rw", "lw", "st", "avançado"].includes(pos)) return "Avançado";
  if (pos === "treinador") return "Treinador";
  if (pos === "outros técnicos") return "Outros Técnicos";
  return "Médio";
}

export function getPositionOrder(position: string): number {
  return POSITION_ORDER[mapToMainPosition(position)] ?? 99;
}