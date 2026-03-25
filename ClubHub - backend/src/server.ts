import app from "./app";
import { sequelize } from "./config/database";
import { scrapeTeamPlayers, savePlayers } from "./scrapers/teamScraper";
import { scrapeTeamMatches, saveMatches } from "./scrapers/matchScraper";
import { teamConfig } from "./config/teamConfig";
import { scrapeAllTeams, saveAllTeams } from "./scrapers/allTeamsScraper";
import { scrapeStandings, saveStandings } from "./scrapers/standingsScraper";

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
  const standings = await scrapeStandings();
//

  if(standings.length === 0) {
    console.log("Nenhum standing encontrado. Verifique o scraper.");
  } else {
    await saveStandings(standings, 1);
  }
  console.log(standings);
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
