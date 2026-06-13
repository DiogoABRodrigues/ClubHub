import app from "./app";
import { sequelize } from "./config/database";
import { connectRedis, redis } from "./config/redis";
import { initAssociations } from "./models/associations";
import { initSocket } from "./config/socket";
import http from "http";
import { startMatchReminderJob } from "./jobs/matchReminder.job";
import { wakeUpBackend } from "./jobs/wake-up";
import { warmupBrowser } from "./utils/browser";
import { scrapeTeamMatches } from "./scrapers/matchScraper";
import { scrapeStandings } from "./scrapers/standingsScraper";
import { scrapeTeamPlayers } from "./scrapers/playersScraper";
import { scrapeAllTeams } from "./scrapers/allTeamsScraper";
import { scrapeTeamStats } from "./scrapers/statsScraper";
import { closeSharedBrowser } from "./utils/browser";

async function restartBrowser() {
  await closeSharedBrowser();
  // pequena pausa para o processo limpar memória
  await new Promise((r) => setTimeout(r, 2000));
}

if (
  !process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_ACCESS_SECRET.length < 32
) {
  throw new Error("JWT_ACCESS_SECRET fraco ou ausente");
}

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
    //await sequelize.sync({ alter: true });
    //await scrapeTeamPlayers();
    //await scrapeTeamMatches();
    //await scrapeStandings();
    //await scrapeTeamStats();
    //await scrapeAllTeams();

    //wait restartBrowser();

    await redis.flushDb();
    console.log("DB ligada");

    server.listen(PORT, async () => {
      console.log(`Servidor a correr em ${PORT}`);
      await warmupBrowser();
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();
