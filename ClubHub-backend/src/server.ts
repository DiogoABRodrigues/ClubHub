import http from "http";
import app from "./app";
import { sequelize } from "./config/database";
import { connectRedis, redis } from "./config/redis";
import { initAssociations } from "./models/associations";
import { initSocket } from "./config/socket";
import { runMatchReminderJob, startMatchReminderJob } from "./jobs/matchReminder.job";
import { wakeUpBackend } from "./jobs/wake-up";
import { warmupBrowser, closeSharedBrowser } from "./utils/browser";
import { env } from "./config/env";
import { pushService } from "./services/push.service";
import { scrapeTeamMatches } from "./scrapers/matchScraper";
import { CategoryConfig } from "./config/teamConfig";
import { scrapeAllTeams } from "./scrapers/allTeamsScraper";
import { scrapeStandings } from "./scrapers/standingsScraper";
import { scrapeTeamPlayers } from "./scrapers/playersScraper";
import { scrapeTeamStats } from "./scrapers/statsScraper";

const server = http.createServer(app);
server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 1_000;

initAssociations();
initSocket(server);
wakeUpBackend();

const confog: CategoryConfig = {
  category: "over19",
  label: "Seniores",
  enabled: true,  
  seasonYear: "2026/2027",
  teamName: "Adecas",
  teamExternalId: 18231,
  players_url: "https://www.zerozero.pt/equipa/adecas/18231?epoca_id=156",
  matches_url: "https://www.zerozero.pt/equipa/adecas/18231/jogos",
  standings_url: "https://www.zerozero.pt/edicao/af-viana-do-castelo-2-divisao-2026-2027-2-divisao-mka/221710",
  stats_url: " https://www.zerozero.pt/equipa/adecas/18231/jogadores?pos=0&pais=0&epoca_stats_id=156&comp_id=0&menu=",
  teams_urls: [
    "https://www.zerozero.pt/edicao/af-viana-do-castelo-taca-2026-27/221737/equipas",
    "https://www.zerozero.pt/edicao/af-viana-do-castelo-2-divisao-mka-2026-2027/221710/equipas",
  ],
};

async function runStartupScrapers() {
  try {
    // Jogos e classificações referem equipas; os jogos também referem a
    // competição criada/atualizada pelo scraper de classificações.
    //await scrapeAllTeams();
    //await scrapeStandings(confog);

    // A partir daqui não há dependências entre estes três scrapers.
    const results = await Promise.allSettled([
      scrapeTeamMatches(confog),
      //scrapeTeamPlayers(confog),
    ]);

    //await scrapeTeamStats(confog);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Erro no scraper de arranque #${index + 1}:`, result.reason);
      }
    });
  } catch (error) {
    console.error("Erro nos scrapers de arranque:", error);
  }
}

async function startServer() {
  try {
    await sequelize.authenticate();
    await connectRedis();
    pushService.startWorker();
    startMatchReminderJob();
    void runMatchReminderJob();

    server.listen(env.PORT, () => {
      console.log(`Servidor a correr em ${env.PORT}`);
      void (async () => {
        try {
          await warmupBrowser();
          //await runStartupScrapers();
        } catch (error) {
          console.error("Erro ao preparar os scrapers de arranque:", error);
        }
      })();
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
      Promise.resolve(pushService.stopWorker()),
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
