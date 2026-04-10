import app from "./app";
import { sequelize } from "./config/database";
import { connectRedis } from "./config/redis";
import { initAssociations } from "./models/associations";
import { initSocket } from "./config/socket";
import http from "http";
import { startMatchReminderJob } from "./jobs/matchReminder.job";
import { wakeUpBackend } from "./jobs/wake-up";
import { scrapeTeamStats } from "./scrapers/statsScraper";
import { scrapeAllTeams } from "./scrapers/allTeamsScraper";
import { scrapeTeamPlayers } from "./scrapers/playersScraper";
import { scrapeStandings } from "./scrapers/standingsScraper";
import { scrapeTeamMatches } from "./scrapers/matchScraper";

const PORT = process.env.PORT;

const server = http.createServer(app);

startMatchReminderJob();
initAssociations();
initSocket(server);
wakeUpBackend();

async function startServer() {
  try {
    await sequelize.authenticate();
    await connectRedis();
    await sequelize.sync({ alter: true });
          const standings = await scrapeStandings();
          const stats = await scrapeTeamStats();
    console.log("DB ligada");

    server.listen(PORT, () => {
      console.log(`Servidor a correr em ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
