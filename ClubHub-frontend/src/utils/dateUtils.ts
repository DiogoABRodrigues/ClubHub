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

export function getPenaltyDisplayScore(
  result: string | null | undefined,
  outcome: "V" | "D" | "E" | null | undefined,
  decidedByPenalties: boolean | undefined,
): [string, string] | null {
  if (!result || !decidedByPenalties || outcome === "E" || !outcome)
    return null;

  const parts = result.split("-");
  if (parts.length < 2) return null;

  const home = parseInt(parts[0], 10);
  const away = parseInt(parts[1], 10);

  return (home > away) ? [`${home}*`, `${away}`] : [`${home}`, `${away}*`];
}
