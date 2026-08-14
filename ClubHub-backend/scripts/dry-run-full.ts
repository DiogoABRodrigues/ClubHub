import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scrapeAllTeams } from "../src/scrapers/allTeamsScraper";
import { scrapeTeamMatches } from "../src/scrapers/matchScraper";
import { scrapeTeamPlayers } from "../src/scrapers/playersScraper";
import { scrapeStandings } from "../src/scrapers/standingsScraper";
import { scrapeTeamStats } from "../src/scrapers/statsScraper";
import {
  discoverTeamCategories,
  getCompetitionsFromMatches,
} from "../src/scrapers/teamDiscoveryScraper";
import { closeSharedBrowser } from "../src/utils/browser";

async function main() {
  try {
    const discoveredCategories = await discoverTeamCategories();
    const targetCategory = process.env.DRY_RUN_CATEGORY;
    const categories = targetCategory
      ? discoveredCategories.filter((category) => category.category === targetCategory)
      : discoveredCategories;
    if (!categories.length) throw new Error(`Escalão não encontrado: ${targetCategory}`);
    const includeDetails = process.env.DRY_RUN_INCLUDE_DETAILS === "true";
    const competitionUrls = new Set<string>();
    const categoryReports: Record<string, unknown> = {};

    for (const category of categories) {
      console.log(`\nDry run: ${category.label}`);
      // As fichas individuais só acrescentam localizações, golos e formações.
      // Não são necessárias para validar a descoberta e tornariam este teste
      // de leitura demasiado lento.
      const matches = await scrapeTeamMatches(category, {
        persist: false,
        includeDetails,
      });
      const competitions = getCompetitionsFromMatches(matches);
      competitions.forEach(({ url }) => competitionUrls.add(url));

      const classifications = [];
      for (const competition of competitions) {
        const url = competition.url;
        if (!competition.hasStandings) {
          classifications.push({ url, competition: competition.name, skipped: "Taça não tem classificação" });
          continue;
        }
        try {
          classifications.push({
            url,
            rows: await scrapeStandings(
              { ...category, standings_url: url },
              { persist: false },
            ),
          });
        } catch (error) {
          classifications.push({
            url,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      const players = await scrapeTeamPlayers(category, { persist: false });
      const stats = await scrapeTeamStats(category, { persist: false });
      categoryReports[category.category] = {
        config: category,
        matches,
        classifications,
        players,
        stats,
      };
    }

    const teams = await scrapeAllTeams([...competitionUrls], { persist: false });
    const report = {
      generatedAt: new Date().toISOString(),
      mode: "dry-run",
      scope: targetCategory ?? "all",
      includeMatchDetails: includeDetails,
      guarantee: "Nenhum scraper gravou na base de dados, cache da aplicação ou notificações.",
      categories: categoryReports,
      teams,
    };
    const reportDir = path.resolve(process.cwd(), "reports");
    const reportPath = path.join(
      reportDir,
      targetCategory ? `zerozero-${targetCategory}-dry-run.json` : "zerozero-full-dry-run.json",
    );
    await mkdir(reportDir, { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`\nRelatório completo guardado em: ${reportPath}`);
  } finally {
    await closeSharedBrowser();
  }
}

void main().catch((error) => {
  console.error("Dry run completo falhou:", error);
  process.exitCode = 1;
});
