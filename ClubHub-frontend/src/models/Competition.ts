export type LegendItem = {
  color: string;
  label: string;
};

export type Competition = {
  id: number;
  externalId: number | null;
  name: string;
  seasonId: number;
  seasonYear?: string | null;
  legend: LegendItem[] | null;
};
