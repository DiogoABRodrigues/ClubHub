import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scrapeTeamMatches } from "../src/scrapers/matchScraper";
import { scrapeTeamPlayers } from "../src/scrapers/playersScraper";
import { scrapeStandings } from "../src/scrapers/standingsScraper";
import { scrapeTeamStats } from "../src/scrapers/statsScraper";
import {
  discoverTeamCategories,
  getCompetitionsFromMatches,
} from "../src/scrapers/teamDiscoveryScraper";
import { closeSharedBrowser } from "../src/utils/browser";

const target = process.env.BENCHMARK_SCRAPER ?? "stats";
const now = () => performance.now();

async function main() {
  const startedAt = new Date().toISOString();
  const totalStart = now();
  try {
    const discoveryStart = now();
    const category = (await discoverTeamCategories()).find(
      (item) => item.category === "over19",
    );
    if (!category) throw new Error("Seniores não encontrados no ZeroZero.");
    const discoveryMs = Math.round(now() - discoveryStart);

    const scraperStart = now();
    let data: unknown[];
    if (target === "stats") data = await scrapeTeamStats(category, { persist: false });
    else if (target === "players") data = await scrapeTeamPlayers(category, { persist: false });
    else if (target === "matches" || target === "matches-details") data = await scrapeTeamMatches(category, {
      persist: false,
      includeDetails: target === "matches-details",
    });
    else if (target === "standings") {
      const matches = await scrapeTeamMatches(category, {
        persist: false,
        includeDetails: false,
      });
      const competitions = getCompetitionsFromMatches(matches);
      data = [];
      for (const competition of competitions) {
        const url = competition.url;
        if (!competition.hasStandings) {
          data.push({ url, competition: competition.name, skipped: "Taça não tem classificação" });
          continue;
        }
        const competitionStart = now();
        try {
          const rows = await scrapeStandings(
            { ...category, standings_url: url },
            { persist: false },
          );
          data.push({ url, durationMs: Math.round(now() - competitionStart), rows });
        } catch (error) {
          data.push({
            url,
            durationMs: Math.round(now() - competitionStart),
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }
    else throw new Error(`Scraper desconhecido: ${target}`);

    const report = {
      startedAt,
      category: "over19",
      scraper: target,
      persist: false,
      discoveryMs,
      scraperMs: Math.round(now() - scraperStart),
      totalMs: Math.round(now() - totalStart),
      recordCount: target === "standings"
        ? data.reduce((total: number, item: any) => total + (item.rows?.length ?? 0), 0)
        : data.length,
      sample: data.slice(0, 3),
    };
    const reportDir = path.resolve(process.cwd(), "reports");
    const reportPath = path.join(reportDir, `benchmark-over19-${target}.json`);
    await mkdir(reportDir, { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(JSON.stringify(report, null, 2));
    console.log(`Relatório guardado em: ${reportPath}`);
  } finally {
    await closeSharedBrowser();
  }
}

void main().catch((error) => {
  console.error("Benchmark falhou:", error);
  process.exitCode = 1;
});
