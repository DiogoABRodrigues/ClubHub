import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  discoverCompetitionUrlsForCategory,
  discoverTeamCategories,
} from "../src/scrapers/teamDiscoveryScraper";
import { closeSharedBrowser } from "../src/utils/browser";

async function main() {
  try {
    const categories = await discoverTeamCategories();
    const report = {
      generatedAt: new Date().toISOString(),
      source: "ZeroZero (modo apenas de leitura; nenhuma escrita na base de dados)",
      primaryTeamUrl: process.env.ZEROZERO_CLUB_URL ?? "config.teamConfig.primaryTeamUrl",
      categories: await Promise.all(
        categories.map(async (category) => ({
          category: category.category,
          label: category.label,
          teamExternalId: category.teamExternalId,
          playersUrl: category.players_url,
          matchesUrl: category.matches_url,
          statsUrl: category.stats_url,
          ...(await (async () => {
            try {
              return {
                competitionUrls: await discoverCompetitionUrlsForCategory(category),
              };
            } catch (error) {
              return {
                competitionUrls: [],
                discoveryError: error instanceof Error ? error.message : String(error),
              };
            }
          })()),
        })),
      ),
    };

    const reportDir = path.resolve(process.cwd(), "reports");
    const reportPath = path.join(reportDir, "zerozero-discovery.json");
    await mkdir(reportDir, { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

    console.log(JSON.stringify(report, null, 2));
    console.log(`\nRelatório guardado em: ${reportPath}`);
  } finally {
    await closeSharedBrowser();
  }
}

void main().catch((error) => {
  console.error("Dry run de descoberta falhou:", error);
  process.exitCode = 1;
});
