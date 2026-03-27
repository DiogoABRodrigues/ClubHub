export const formatDatePT = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateWithWeekdayPT = (dateStr: string): string => {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString('pt-PT', { weekday: 'long' }); // ex: "segunda-feira"
  const formattedDate = date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return `${weekday}, ${formattedDate}`; // ex: "segunda-feira, 27 de março de 2026"
};