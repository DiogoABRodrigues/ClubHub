import app from "./app";
import { sequelize } from "./config/database";
import { scrapeTeamPlayers } from "./scrapers/playersScraper";
import { scrapeTeamMatches } from "./scrapers/matchScraper";
import { teamConfig } from "./config/teamConfig";
import { scrapeAllTeams, saveAllTeams } from "./scrapers/allTeamsScraper";
import { scrapeStandings, saveStandings } from "./scrapers/standingsScraper";
import { scrapeTeamStats } from "./scrapers/statsScraper";

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
  //await scrapeTeamPlayers();
  //await scrapeTeamMatches();
  //await scrapeStandings();
  //await scrapeTeamStats();
  await scrapeAllTeams();
//

} catch (error) {
  console.error(error);
}


  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
