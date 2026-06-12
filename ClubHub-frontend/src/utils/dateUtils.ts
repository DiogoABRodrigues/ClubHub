export const formatDatePT = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatDateWithWeekdayPT = (dateStr: string): string => {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("pt-PT", { weekday: "long" }); // ex: "segunda-feira"
  const formattedDate = date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${formattedDate}`; // ex: "segunda-feira, 27 de março de 2026"
};

export const parseDateStr = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date();
  date.setFullYear(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return isNaN(date.getTime()) ? new Date() : date;
};

export const applyTimeStr = (base: Date, timeStr: string): Date => {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date(base);
  date.setHours(h ?? 0, m ?? 0, 0, 0);
  return date;
};

export const formatToDateStr = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatToTimeStr = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
};

/**
 * Quando um jogo termina nos penáltis, o marcador real fica empatado (ex: "1-1").
 * Para exibição, adiciona +1 ao lado vencedor: "2*-1" ou "1-2*".
 * O asterisco indica que o golo extra é fictício (representa a vitória nos penáltis).
 *
 * @param result  resultado guardado na BD, ex: "1-1"
 * @param outcome "V" = a nossa equipa ganhou, "D" = perdeu
 * @param homeOrAway "C" = casa, "F" = fora
 * @param decidedByPenalties true se o jogo foi a penáltis
 * @returns [homeDisplay, awayDisplay] - strings para mostrar no marcador
 */
export function getPenaltyDisplayScore(
  result: string | null | undefined,
  outcome: "V" | "D" | "E" | null | undefined,
  homeOrAway: "C" | "F",
  decidedByPenalties: boolean | undefined,
): [string, string] | null {
  if (!result || !decidedByPenalties || outcome === "E" || !outcome) return null;
 
  const parts = result.split("-");
  if (parts.length < 2) return null;
 
  let home = parseInt(parts[0], 10);
  let away = parseInt(parts[1], 10);
 
  // "V" significa que a nossa equipa ganhou nos penáltis
  const ourTeamWon = outcome === "V";
  const weAreHome = homeOrAway === "C";
 
  if (ourTeamWon && weAreHome) {
    return [`${home + 1}*`, `${away}`];
  } else if (ourTeamWon && !weAreHome) {
    return [`${home}`, `${away + 1}*`];
  } else if (!ourTeamWon && weAreHome) {
    return [`${home}`, `${away + 1}*`];
  } else {
    return [`${home + 1}*`, `${away}`];
  }
}
 