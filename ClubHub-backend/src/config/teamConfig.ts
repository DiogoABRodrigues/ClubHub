/**
 * Configura\u00e7\u00e3o que n\u00e3o muda entre \u00e9pocas. Os IDs das equipas e as
 * competi\u00e7\u00f5es s\u00e3o descobertos no ZeroZero em cada recolha.
 */
export type Category = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

export interface CategoryConfig {
  category: Category;
  label: string;
  enabled: boolean;
  seasonYear?: string;
  teamName: string;
  teamExternalId: number;
  players_url: string;
  matches_url: string;
  standings_url: string;
  stats_url: string;
  teams_urls: string[];
}

export interface CategoryDefinition {
  category: Category;
  label: string;
  enabled: boolean;
  teamName: string;
}

export const teamConfig = {
  name: "Adecas",
  updateSchedule: "0 2 * * 0",
  teamLocation: "Campo Costa do Monte, Arcos de Valdevez",
  /** A \u00fanica fonte ZeroZero que precisa de ser configurada. */
  primaryTeamUrl: "https://www.zerozero.pt/equipa/adecas/18231",
  currentSeason: getCurrentSeason(),
  categories: [
    { category: "over19", label: "Seniores", enabled: true, teamName: "Adecas" },
    { category: "sub19", label: "Sub-19", enabled: true, teamName: "Adecas" },
    { category: "sub17", label: "Sub-17", enabled: true, teamName: "Adecas" },
    { category: "sub15", label: "Sub-15", enabled: true, teamName: "Adecas" },
    { category: "sub13", label: "Sub-13", enabled: true, teamName: "Adecas" },
  ] as CategoryDefinition[],
};

export function getEnabledCategoryDefinitions(): CategoryDefinition[] {
  return teamConfig.categories.filter((c) => c.enabled);
}

export function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}
