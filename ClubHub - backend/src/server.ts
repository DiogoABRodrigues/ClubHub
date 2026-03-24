import app from "./app";
import { sequelize } from "./config/database";
import { scrapeTeamPlayers, savePlayers } from "./scrapers/teamScraper";

const PORT = 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync( { alter: true } );

    console.log("DB ligada");

    app.listen(PORT, () => {
      console.log(`Servidor a correr em http://localhost:${PORT}`);
    });
    try {
    const players = await scrapeTeamPlayers();

    if(players.length === 0) {
      console.log("Nenhum jogador encontrado. Verifique o scraper.");
    } else {
      await savePlayers(players);
    }
    console.log(players);
  } catch (error) {
    console.error(error);
  }
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
