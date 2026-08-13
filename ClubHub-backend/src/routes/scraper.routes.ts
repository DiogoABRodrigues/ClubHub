import { Router } from "express";
import { scrapeTeamMatches } from "../scrapers/matchScraper";
import { scrapeTeamPlayers } from "../scrapers/playersScraper";
import { scrapeStandings } from "../scrapers/standingsScraper";
import { scrapeTeamStats } from "../scrapers/statsScraper";
import { scrapeAllTeams } from "../scrapers/allTeamsScraper";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { closeSharedBrowser } from "../utils/browser";
import { discoverTeamCategories, getCompetitionUrlsFromMatches } from "../scrapers/teamDiscoveryScraper";
import socketService from "../services/socket.service";

const router = Router();

async function restartBrowser() {
  await closeSharedBrowser();
  await new Promise((r) => setTimeout(r, 2000));
}

async function scrapeCategory(cfg: Awaited<ReturnType<typeof discoverTeamCategories>>[number]) {
  const matches = await scrapeTeamMatches(cfg);
  const competitionUrls = getCompetitionUrlsFromMatches(matches);
  let standingsCount = 0;

  // Ta\u00e7as nem sempre t\u00eam tabela classificativa. Uma falha numa delas n\u00e3o
  // pode impedir a recolha da liga nem dos restantes escal\u00f5es.
  for (const standingsUrl of competitionUrls) {
    try {
      const standings = await scrapeStandings({ ...cfg, standings_url: standingsUrl });
      standingsCount += standings.length;
    } catch (error) {
      console.warn(`Classifica\u00e7\u00e3o indispon\u00edvel em ${standingsUrl}:`, error);
    }
  }
  await restartBrowser();

  const players = await scrapeTeamPlayers(cfg);
  await restartBrowser();
  const stats = await scrapeTeamStats(cfg);

  return { matches, standingsCount, players, stats, competitionUrls };
}

// Scrape de todos os escalões activos
router.post(
  "/allInfo",
  authMiddleware,
  authorizeRoles("admin"),
  async (_req, res) => {
    try {
      const categories = await discoverTeamCategories();
      const results: any = {};
      const competitionUrls = new Set<string>();

      for (const cfg of categories) {
        console.log(
          `\n🏃 A fazer scrape do escalão: ${cfg.label} (${cfg.category})`,
        );

        const { matches, standingsCount, players, stats, competitionUrls: urls } = await scrapeCategory(cfg);
        urls.forEach((url) => competitionUrls.add(url));

        results[cfg.category] = {
          matches: matches.length,
          standings: standingsCount,
          players: players.length,
          stats: stats.length,
        };
      }

      // Scrape de todas as equipas (só over19 para classificação)
      const teams = await scrapeAllTeams([...competitionUrls]);

      socketService.emitDataUpdated();

      res.json({
        success: true,
        message: "Scraper executado com sucesso para todos os escalões",
        results,
        totalTeams: teams.length,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao executar scraper" });
    } finally {
      await closeSharedBrowser();
    }
  },
);

// Scrape de um escalão específico
router.post(
  "/category/:category",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const { category } = req.params;
    const categories = await discoverTeamCategories();
    const cfg = categories.find((c) => c.category === category);

    if (!cfg) {
      res
        .status(404)
        .json({
          success: false,
          message: `Escalão "${category}" não encontrado ou desactivado`,
        });
      return;
    }

    try {
      console.log(`\n🏃 A fazer scrape do escalão: ${cfg.label}`);

      const { matches, standingsCount, players, stats } = await scrapeCategory(cfg);

      socketService.emitDataUpdated();

      res.json({
        success: true,
        category: cfg.category,
        label: cfg.label,
        matches: matches.length,
        standings: standingsCount,
        players: players.length,
        stats: stats.length,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao executar scraper" });
    } finally {
      await closeSharedBrowser();
    }
  },
);

export default router;
