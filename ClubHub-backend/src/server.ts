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
import { env } from "./config/env";

async function restartBrowser() {
  await closeSharedBrowser();
  // pequena pausa para o processo limpar memória
  await new Promise((r) => setTimeout(r, 2000));
}

const server = http.createServer(app);
server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 1_000;

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

    //await redis.flushDb();
    console.log("DB ligada");

    server.listen(env.PORT, async () => {
      console.log(`Servidor a correr em ${env.PORT}`);
      await warmupBrowser();
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error);
    process.exit(1);
  }
}

void startServer();

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`A encerrar (${signal})...`);

  const forceExit = setTimeout(() => process.exit(1), 10_000);
  forceExit.unref();

  server.close(async () => {
    await Promise.allSettled([
      closeSharedBrowser(),
      redis.isOpen ? redis.quit() : Promise.resolve(),
      sequelize.close(),
    ]);
    clearTimeout(forceExit);
    process.exit(0);
  });
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  void shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  void shutdown("uncaughtException");
});
