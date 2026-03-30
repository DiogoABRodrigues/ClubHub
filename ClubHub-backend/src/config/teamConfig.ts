export const teamConfig = {
  players_url: "https://www.zerozero.pt/equipa/adecas/18231",
  matches_url: "https://www.zerozero.pt/equipa/adecas/18231/jogos?grp=1",
  name: "Adecas",
  updateSchedule: "0 2 * * 0",
  teams1: "https://www.zerozero.pt/competicao/af-viana-do-castelo-1-divisao",
  teams2: "https://www.zerozero.pt/competicao/af-viana-do-castelo-2-divisao",
  standings_url:
    "https://www.zerozero.pt/competicao/af-viana-do-castelo-2-divisao",
  nr_teams: 16,
  stats:
    "https://www.zerozero.pt/equipa/adecas/18231/jogadores?epoca_stats_id=155&o=j",
  currentSeason: getCurrentSeason(),
  teamLocation: "Campo Costa do Monte, Arcos de Valdevez",
};

function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 8) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
}
