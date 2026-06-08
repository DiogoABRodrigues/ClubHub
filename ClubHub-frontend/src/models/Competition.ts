export type LegendItem = {
  color: string;
  label: string;
};

export type Competition = {
  id: number;
  name: string;
  seasonId: number;
  legend: LegendItem[] | null;
};