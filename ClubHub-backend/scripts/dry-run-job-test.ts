import "dotenv/config";
import http from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { connectRedis, redis } from "../src/config/redis";
import { initSocket } from "../src/config/socket";
import scrapeJobService from "../src/services/scrapeJob.service";

const WAIT_MS = 2_000;

async function main() {
  const socketServer = http.createServer();
  initSocket(socketServer);
  await connectRedis();
  try {
    const scope = process.env.DRY_RUN_JOB_SCOPE ?? "all";
    const job = await scrapeJobService.start(scope, "dry-run");
    console.log(`Job iniciado: ${job.id}`);

    let latest = job;
    while (latest.status === "queued" || latest.status === "running") {
      console.log(`${latest.status}: ${latest.currentStep}`);
      await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
      const refreshed = await scrapeJobService.get(job.id);
      if (!refreshed) throw new Error("Job desapareceu do Redis antes de terminar.");
      latest = refreshed;
    }

    const reportDir = path.resolve(process.cwd(), "reports");
    const reportPath = path.join(reportDir, "zerozero-dry-run-job-response.json");
    await mkdir(reportDir, { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(latest, null, 2)}\n`, "utf8");
    console.log(`Job ${latest.status}: ${latest.currentStep}`);
    console.log(`Resposta do job guardada em: ${reportPath}`);
    if (latest.status === "failed") process.exitCode = 1;
  } finally {
    await redis.quit();
    socketServer.close();
  }
}

void main().catch((error) => {
  console.error("Teste do endpoint/job falhou:", error);
  process.exitCode = 1;
});
