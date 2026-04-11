import * as cheerio from "cheerio";
import Stats from "../models/Stats";
import Season from "../models/Season";
import { teamConfig } from "../config/teamConfig";
import { getSharedBrowser, launchBrowser } from "../utils/browser";

async function getOrCreateSeason() {
  const [season] = await Season.findOrCreate({
    where: { year: teamConfig.currentSeason },
  });

  return season;
}

export async function scrapeTeamStats() {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(teamConfig.stats, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Aceitar cookies (se existir)
  try {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent?.includes("Aceitar"),
      );
      if (btn) btn.click();
    });
  } catch (err) {}

  const html = await page.content();
  await page.close();

  const $ = cheerio.load(html);
  const stats: any[] = [];

  // Percorre cada linha da tabela de estatísticas
  $("tbody tr").each((_, row) => {
    const tds = $(row).find("td");

    const nameLink = $(tds[2]).find(".text a[href*='/jogador/']");
    const name = nameLink.text().trim();

    let externalId: number | null = null;
    const href = nameLink.attr("href");
    if (href) {
      const match = href.match(/\/jogador\/[^/]+\/(\d+)/);
      if (match) externalId = parseInt(match[1]);
    }

    const position = $(tds[3]).text().trim() || null;
    const age = parseInt($(tds[4]).text().trim()) || null;
    const gamesPlayed = parseInt($(tds[4]).text().trim()) || 0;
    const goals = parseInt($(tds[5]).text().trim()) || 0;
    const minutesPlayed = parseInt($(tds[9]).text().trim()) || 0;

    if (name && externalId) {
      stats.push({
        externalId,
        name,
        position,
        age,
        gamesPlayed,
        goals,
        minutesPlayed,
      });
    }
  });

  console.log(`✅ Estatísticas encontradas: ${stats.length}`);
  if (stats.length === 0) console.log("⚠️ Nenhuma estatística encontrada");

  const season = await getOrCreateSeason();

  // Salvar ou atualizar Stats
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
}
