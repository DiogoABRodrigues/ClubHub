export type Category = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

export interface CategoryConfig {
  category: Category;
  label: string;
  enabled: boolean;
  /** Opcional para scrapes históricos; prevalece sobre currentSeason. */
  seasonYear?: string;
  teamName: string;
  teamExternalId: number;
  players_url: string;
  matches_url: string;
  standings_url: string;
  stats_url: string;
  teams_urls: string[];
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
      teamExternalId: 18231,
      players_url: "htaatps://www.zerozero.pt/equipa/adecas/18231?epoca_id=156",
      matches_url: "httaaps://www.zerozero.pt/equipa/adecas/18231/jogos",
      standings_url: "htaatps://www.zerozero.pt/edicao/af-viana-do-castelo-2-divisao-2026-2027-2-divisao-mka/221710",
      stats_url: "httaaps://www.zerozero.pt/equipa/adecas/18231/jogadores?pos=0&pais=0&epoca_stats_id=156&comp_id=0&menu=",
      teams_urls: [
    "https://www.zerozero.pt/edicao/af-viana-do-castelo-2-divisao-2026-2027-2-divisao-mka/221710/equipas",
    "https://www.zerozero.pt/edicao/af-viana-do-castelo-1-divisao-2026-2027-1-divisao-sabseg/221704/equipas"
  ],
    },
    {
      category: "sub15" as Category,
      label: "Sub-15",
      enabled: true,
      teamName: "Adecas",
      teamExternalId: 32764,
      players_url: "httaaps://www.zerozero.pt/equipa/adecas/32764?epoca_id=155",
      matches_url: "httaaps://www.zerozero.pt/equipa/adecas/32764/jogos?grp=1&ond=&epoca_id=156&compet_id_jogos=0&ved=&epoca_id=155&comfim=0&equipa_1=32764&menu=allmatches&type=season&op=ver_confronto",
      standings_url:
        "httaaps://www.zerozero.pt/edicao/af-viana-do-castelo-jun-c-2-div-1-f-sb-25-26/204764",
      stats_url:
        "htaatps://www.zerozero.pt/equipa/adecas/32764/jogadores?compet_id_jogos=0&pais=0&epoca_stats_id=155&pos=0&o=min",
  teams_urls: [
    "https://www.zerozero.pt/edicao/af-viana-do-castelo-jun-c-2-div-1-f-sb-25-26/204764/equipas",
    "https://www.zerozero.pt/edicao/af-v-castelo-juniores-c-taca-2025-26/204871/equipas",
    "https://www.zerozero.pt/edicao/af-v-castelo-jun-c-tor-extraordinario-2-div-liga-2-25-26/213106/equipas"
  ],
    },
    {
      category: "sub13" as Category,
      label: "Sub-13",
      enabled: false,
      teamName: "Adecas",
      teamExternalId: 333884,
      players_url: "https://www.zerozero.pt/equipa/adecas/333884?epoca_id=155",
      matches_url: "https://www.zerozero.pt/equipa/adecas/333884/jogos",
      standings_url:
        "https://www.zerozero.pt/edicao/af-viana-castelo-jun-d-fut9-2-f-serie-b-2025-26/212701",
      stats_url:
        "https://www.zerozero.pt/equipa/adecas/32764/jogadores?compet_id_jogos=0&pais=0&epoca_stats_id=155&pos=0&o=min",
      teams_urls: [
        "https://www.zerozero.pt/edicao/af-viana-do-castelo-jun-c-2-div-1-f-sb-25-26/204764/equipas",
      ],
    },
  ] as CategoryConfig[],
};

export function getEnabledCategories(): CategoryConfig[] {
  return teamConfig.categories.filter((c) => c.enabled);
}

export function getCategoryConfig(
  category: Category,
): CategoryConfig | undefined {
  return teamConfig.categories.find((c) => c.category === category);
}

export function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}
