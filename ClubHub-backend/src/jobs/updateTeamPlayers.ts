import { sequelize } from "../config/database";
import Player from "../models/Player";
import { scrapeTeamPlayers } from "../scrapers/playersScraper.js";

export async function updatePlayersAtomic() {
  console.log("🕒 Iniciando atualização de jogadores...");

  const players = await scrapeTeamPlayers();

  if (players.length === 0) {
    console.log("Nenhum jogador encontrado. Verifique o scraper.");
    return;
  } else {
    await sequelize.transaction(async (t) => {
      await Player.destroy({ where: {}, transaction: t });

      await Player.bulkCreate(players, { transaction: t });
    });
  }
  console.log("✅ Jogadores atualizados de forma atômica!");
}
