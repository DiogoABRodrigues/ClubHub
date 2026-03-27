import { sequelize } from "../config/database";
import { teamConfig } from "../config/teamConfig";
import Player from "../models/Player";
import { scrapeTeamMatches, saveMatches } from "../scrapers/matchScraper";

export async function updateMatchesAtomic() {
  console.log("🕒 Iniciando atualização de jogos...");

  const matches = await scrapeTeamMatches();

  if (matches.length === 0) {
    console.log("Nenhum jogo encontrado. Verifique o scraper.");
    return;
  } else {
    await saveMatches(teamConfig.name, matches);
  }
  console.log("✅ Jogos atualizados de forma atômica!");
}
