export type Category = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

export interface CategoryConfig {
  category: Category;
  label: string;
  enabled: boolean;
  teamName: string;
  players_url: string;
  matches_url: string;
  standings_url: string;
  stats_url: string;
  teams_urls: string[];
  nr_teams: number;
}

export const teamConfig = {
  name: "Adecas",
  updateSchedule: "0 2 * * 0",
  teamLocation: "Campo Costa do Monte, Arcos de Valdevez",
  currentSeason: getCurrentSeason(),

  categories: [
    {
      category: "over19" as Category,
      label: "Seniores",
      enabled: true,
      teamName: "Adecas",
      players_url: "https://www.zerozero.pt/equipa/adecas/18231",
      matches_url: "https://www.zerozero.pt/equipa/adecas/18231/jogos?grp=1",
      standings_url: "https://www.zerozero.pt/competicao/af-viana-do-castelo-2-divisao",
      stats_url: "https://www.zerozero.pt/equipa/adecas/18231/jogadores?epoca_stats_id=155&o=j",
      teams_urls: [
        "https://www.zerozero.pt/competicao/af-viana-do-castelo-1-divisao",
        "https://www.zerozero.pt/competicao/af-viana-do-castelo-2-divisao",
      ],
      nr_teams: 16,
    },
    {
      category: "sub15" as Category,
      label: "Sub-15",
      enabled: true,
      teamName: "Adecas Sub-15",
      // TODO: substituir pelas URLs reais do sub15 no zerozero
      players_url: "https://www.zerozero.pt/equipa/adecas-sub15/XXXXX",
      matches_url: "https://www.zerozero.pt/equipa/adecas-sub15/XXXXX/jogos?grp=1",
      standings_url: "https://www.zerozero.pt/competicao/af-viana-sub15",
      stats_url: "https://www.zerozero.pt/equipa/adecas-sub15/XXXXX/jogadores?epoca_stats_id=155&o=j",
      teams_urls: [
        "https://www.zerozero.pt/competicao/af-viana-sub15",
      ],
      nr_teams: 10,
    },
  ] as CategoryConfig[],
};

export function getEnabledCategories(): CategoryConfig[] {
  return teamConfig.categories.filter((c) => c.enabled);
}

export function getCategoryConfig(category: Category): CategoryConfig | undefined {
  return teamConfig.categories.find((c) => c.category === category);
}

function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}