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

const router = Router();

async function restartBrowser() {
  await closeSharedBrowser();
  // pequena pausa para o processo limpar memória
  await new Promise((r) => setTimeout(r, 2000));
}

router.post(
  "/scrape/allInfo",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const matches = await scrapeTeamMatches();
      const standings = await scrapeStandings();

      await restartBrowser();

      const players = await scrapeTeamPlayers();
      const teams = await scrapeAllTeams();

      await restartBrowser();

      const stats = await scrapeTeamStats();

      res.json({
        success: true,
        message: "Scraper executado com sucesso",
        totalMatches: matches.length,
        totalStandings: standings.length,
        totalStats: stats.length,
        totalPlayers: players.length,
        totalTeams: teams.length,
      });

      await redis.flushDb();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Erro ao executar scraper",
      });
    } finally {
      await closeSharedBrowser();
    }
  },
);

export default router;