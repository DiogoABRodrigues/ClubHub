import * as cheerio from "cheerio";
import Stats from "../models/Stats";
import Season from "../models/Season";
import { teamConfig } from "../config/teamConfig";
import { getSharedBrowser } from "../utils/browser";

async function getOrCreateSeason() {
  const [season] = await Season.findOrCreate({
    where: { year: teamConfig.currentSeason },
  });
  return season;
}

export async function scrapeTeamStats() {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(teamConfig.stats, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });

    // Aceitar cookies
    try {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll("button")).find((b) =>
          b.textContent?.includes("Aceitar"),
        );
        if (btn) (btn as HTMLElement).click();
      });
    } catch {}

    // Esperar pelo JS renderizar a tabela
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

      stats.push({ externalId, name, position, gamesPlayed, goals, minutesPlayed });
    });

    console.log(`✅ Estatísticas encontradas: ${stats.length}`);
    if (stats.length === 0) {
      // debug: mostra quantas linhas existem e o HTML da primeira
      const rowCount = $("tbody tr").length;
      console.log(`⚠️ Linhas encontradas no tbody: ${rowCount}`);
      if (rowCount > 0) {
        console.log(`⚠️ HTML primeira linha: ${$("tbody tr").first().html()?.substring(0, 300)}`);
      }
    }

    const season = await getOrCreateSeason();

    for (const s of stats) {
      await Stats.upsert({
        playerExternalId: s.externalId,
        seasonId: season.id,
        gamesPlayed: s.gamesPlayed,
        goals: s.goals,
        minutesPlayed: s.minutesPlayed,
        position: s.position,
      });
    }

    return stats;
  } finally {
    await page.close();
  }
}