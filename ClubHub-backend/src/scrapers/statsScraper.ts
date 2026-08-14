import * as cheerio from "cheerio";
import Stats from "../models/Stats";
import Season from "../models/Season";
import { CategoryConfig } from "../config/teamConfig";
import { getSharedBrowser } from "../utils/browser";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

async function getOrCreateSeason(seasonYear: string) {
  const [season] = await Season.findOrCreate({
    where: { year: seasonYear },
  });
  return season;
}

export async function scrapeTeamStats(
  cfg?: CategoryConfig,
  options: { persist?: boolean } = {},
) {
  if (!cfg) throw new Error("scrapeTeamStats requer uma equipa descoberta.");
  const config = cfg;

  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(config.stats_url, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });

    try {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll("button")).find((b) =>
          b.textContent?.includes("Aceitar"),
        );
        if (btn) (btn as HTMLElement).click();
      });
    } catch {}

    await page.waitForSelector("tbody tr", { timeout: 30000 });

    const html = await page.content();
    const $ = cheerio.load(html);
    const stats: any[] = [];

    $("tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length < 6) return;

      const nameLink = $(tds[2]).find("a[href*='/jogador/']");
      const name = nameLink.text().trim();

      let externalId: number | null = null;
      const href = nameLink.attr("href");
      if (href) {
        const match = href.match(/\/jogador\/[^/]+\/(\d+)/);
        if (match) externalId = parseInt(match[1]);
      }

      if (!name || !externalId) return;

      const position = $(tds[3]).text().trim() || null;
      const gamesPlayed = parseInt($(tds[4]).text().trim()) || 0;
      const goals = parseInt($(tds[5]).text().trim()) || 0;
      const minutesPlayed = parseInt($(tds[9]).text().trim()) || 0;

      stats.push({
        externalId,
        name,
        position,
        gamesPlayed,
        goals,
        minutesPlayed,
      });
    });

    console.log(
      `✅ Estatísticas encontradas: ${stats.length} [${config.category}]`,
    );

    if (options.persist === false) return stats;

    const season = await getOrCreateSeason(
      config.seasonYear,
    );

    for (const s of stats) {
      await Stats.upsert({
        playerExternalId: s.externalId,
        seasonId: season.id,
        seasonYear: season.year,
        gamesPlayed: s.gamesPlayed,
        goals: s.goals,
        minutesPlayed: s.minutesPlayed,
        position: s.position,
        category: config.category,
      });
    }

    // As fichas de jogadores incluem Stats; por isso ambas as famílias têm de
    // ser invalidadas para a época que foi realmente raspada.
    await Promise.all([
      cache.del(CacheKeys.stats.bySeason(season.id, config.category)),
      cache.del(CacheKeys.players.bySeason(season.id, config.category)),
      cache.del(CacheKeys.players.adminBySeason(season.id, config.category)),
      cache.clearPattern("app:player:*:allstats"),
    ]);

    console.log(
      `✅ Estatísticas guardadas e cache invalidada para a época ${season.year} [${config.category}]`,
    );
    return stats;
  } finally {
    await page.close();
  }
}
