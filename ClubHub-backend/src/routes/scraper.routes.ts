import { Router } from "express";
import { scrapeTeamMatches } from "../scrapers/matchScraper";
import { scrapeTeamPlayers } from "../scrapers/playersScraper";
import { scrapeStandings } from "../scrapers/standingsScraper";
import { scrapeTeamStats } from "../scrapers/statsScraper";
import { scrapeAllTeams } from "../scrapers/allTeamsScraper";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { redis } from "../config/redis";
import { closeSharedBrowser } from "../utils/browser";
import { getEnabledCategories } from "../config/teamConfig";
import socketService from "../services/socket.service";

const router = Router();

async function restartBrowser() {
  await closeSharedBrowser();
  await new Promise((r) => setTimeout(r, 2000));
}

// Scrape de todos os escalões activos
router.post(
  "/allInfo",
  authMiddleware,
  authorizeRoles("admin"),
  async (_req, res) => {
    try {
      const categories = getEnabledCategories();
      const results: any = {};

      for (const cfg of categories) {
        console.log(
          `\n🏃 A fazer scrape do escalão: ${cfg.label} (${cfg.category})`,
        );

        const matches = await scrapeTeamMatches(cfg);
        const standings = await scrapeStandings(cfg);
        await restartBrowser();

        const players = await scrapeTeamPlayers(cfg);
        await restartBrowser();

        const stats = await scrapeTeamStats(cfg);

        results[cfg.category] = {
          matches: matches.length,
          standings: standings.length,
          players: players.length,
          stats: stats.length,
        };
      }

      // Scrape de todas as equipas (só over19 para classificação)
      const teams = await scrapeAllTeams();

      await redis.flushDb();
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
    const categories = getEnabledCategories();
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

      const matches = await scrapeTeamMatches(cfg);
      const standings = await scrapeStandings(cfg);
      await restartBrowser();

      const players = await scrapeTeamPlayers(cfg);
      await restartBrowser();

      const stats = await scrapeTeamStats(cfg);

      await redis.flushDb();
      socketService.emitDataUpdated();

      res.json({
        success: true,
        category: cfg.category,
        label: cfg.label,
        matches: matches.length,
        standings: standings.length,
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
