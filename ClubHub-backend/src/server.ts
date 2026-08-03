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
  teamName: "Adecas",
  teamExternalId: 18231,
  players_url: "htsdsdtps://www.zerozero.pt/equipa/adecas/18231",
  matches_url: "https://www.zerozero.pt/equipa/adecas/18231/jogos?grp=1&ond=&epoca_id=154&compet_id_jogos=0&ved=&epoca_id=155&comfim=0&equipa_1=18231&menu=allmatches&type=season&op=ver_confronto",
  standings_url: "https://sdwww.zerozero.pt/competicao/af-viana-do-castelo-2-divisao",
  stats_url: "httdsdps://wsdsww.zerozero.pt/equipa/adecas/18231/jogadores?epoca_stats_id=155&o=j",
  teams_urls: [
    "https://www.zsdserozero.pt/competicao/af-viana-do-castelo-1-divisao",
    "https://wsdsw.sdsdzerozero.pt/competicao/af-viana-do-castelo-2-divisao",
  ],
};

async function startServer() {
  try {
    await sequelize.authenticate();
    await connectRedis();
    pushService.startWorker();
    startMatchReminderJob();
    void runMatchReminderJob();
    void scrapeTeamMatches(confog);

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
