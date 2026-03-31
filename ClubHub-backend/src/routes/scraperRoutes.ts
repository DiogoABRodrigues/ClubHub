import { Router } from "express";
import { scrapeTeamMatches } from "../scrapers/matchScraper";
import { scrapeTeamPlayers } from "../scrapers/playersScraper";
import { scrapeStandings } from "../scrapers/standingsScraper";
import { scrapeTeamStats } from "../scrapers/statsScraper";
import { scrapeAllTeams } from "../scrapers/allTeamsScraper";

const router = Router();

router.post("/scrape/allInfo", async (req, res) => {
  try {
    const matches = await scrapeTeamMatches();
    const standings = await scrapeStandings();
    const players = await scrapeTeamPlayers();
    const teams = await scrapeAllTeams();
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao executar scraper",
    });
  }
});

export default router;
