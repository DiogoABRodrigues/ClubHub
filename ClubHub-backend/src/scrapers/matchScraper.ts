// src/scrapers/matchScraper.ts
import { teamConfig } from "../config/teamConfig";
import * as cheerio from "cheerio";
import Match from "../models/Match";
import Competition from "../models/Competition";
import Season from "../models/Season";
import { getSharedBrowser } from "../utils/browser";
export interface ScrapedMatch {
  date: string;
  time: string;
  homeOrAway: "C" | "F";
  opponent: string;
  result: string | null;
  competition: string;
  seasonId: number;
  round: string;
  outcome: "V" | "E" | "D" | null;
}

// Função auxiliar para extrair nome e época da competição
function parseCompetition(competitionStr: string): {
  name: string;
  season: string;
} {
  const match = competitionStr.match(/(.+?)\s+(\d{4}\/\d{4}|\d{2}\/\d{2})$/);
  if (match) {
    let season = match[2];
    // Se for YY/YY, converte para YYYY/YYYY
    if (/^\d{2}\/\d{2}$/.test(season)) {
      const [start, end] = season.split("/").map(Number);
      const startYear = start + 2000;
      const endYear = end + 2000;
      season = `${startYear}/${endYear}`;
    }
    return { name: match[1].trim(), season };
  }

  // fallback
  return { name: competitionStr, season: "2025/2026" };
}

// Obter ou criar Season
async function getOrCreateSeason(seasonName: string) {
  let season = await Season.findOne({ where: { year: seasonName } });
  if (!season) {
    console.log(`   🆕 Nova season: ${seasonName}`);
    season = await Season.create({ year: seasonName });
  }
  return season;
}

// Obter ou criar Competition com Season
async function getOrCreateCompetition(competitionStr: string) {
  const { name, season: seasonName } = parseCompetition(competitionStr);

  const season = await getOrCreateSeason(seasonName);

  let competition = await Competition.findOne({
    where: { name, seasonId: season.id },
  });
  if (!competition) {
    console.log(`   🆕 Nova competição: ${name} (${seasonName})`);
    competition = await Competition.create({
      name,
      seasonId: season.id,
    });
  }
  return competition;
}

// Guardar/atualizar jogos
export async function saveMatches(teamName: string, scrapedMatches: ScrapedMatch[]) {
  const seasonCache = new Map<string, Season>();
  const competitionCache = new Map<string, Competition>();

  for (const match of scrapedMatches) {
    // Vai à BD apenas se não estiver já em memória
    const { name, season: seasonName } = parseCompetition(match.competition);
    
    let season = seasonCache.get(seasonName);
    if (!season) {
      season = await Season.findOne({ where: { year: seasonName } }) 
               ?? await Season.create({ year: seasonName });
      seasonCache.set(seasonName, season);
    }

    const compKey = `${name}:${season.id}`;
    let competition = competitionCache.get(compKey);
    if (!competition) {
      competition = await Competition.findOne({ where: { name, seasonId: season.id } })
                   ?? await Competition.create({ name, seasonId: season.id });
      competitionCache.set(compKey, competition);
    }

    const location = match.homeOrAway === "C" ? teamConfig.teamLocation : null;

    await Match.upsert({
      teamName,
      date: match.date,
      time: match.time,
      homeOrAway: match.homeOrAway,
      opponent: match.opponent,
      result: match.result,
      competitionId: competition.id,
      seasonId: season.id,
      round: match.round,
      outcome: match.outcome,
      status: match.result ? "finished" : "upcoming",
      location,
    });
  }
  console.log(
    `✅ ${scrapedMatches.length} jogos guardados/atualizados para a equipa ${teamName}`,
  );
}

// Scraper principal
export async function scrapeTeamMatches(): Promise<ScrapedMatch[]> {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  console.log(`🌐 A aceder a: ${teamConfig.matches_url}`);
  await page.goto(teamConfig.matches_url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Aceitar cookies
  try {
    await page.waitForSelector("button", { timeout: 5000 });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const acceptBtn = btns.find(
        (b) =>
          b.textContent?.includes("Aceitar") ||
          b.textContent?.includes("Aceitar todos"),
      );
      if (acceptBtn) (acceptBtn as HTMLElement).click();
    });
  } catch {}

  try {
    await page.waitForSelector("#team_games table", { timeout: 20000 });
  } catch {
    // tenta recarregar uma vez
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#team_games table", { timeout: 20000 });
  }

  const html = await page.content(); // ← tira o HTML após JS renderizar
  await page.close();

  const $ = cheerio.load(html); // ← cheerio a partir daqui
  const scrapedMatches: ScrapedMatch[] = [];

  $("tr.parent").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 9) return;

    let outcome: "V" | "E" | "D" | null = null;
    const formEl = $(cells[0]).find(".form .sign");
    if (formEl.hasClass("win")) outcome = "V";
    else if (formEl.hasClass("draw")) outcome = "E";
    else if (formEl.hasClass("lost")) outcome = "D";

    const date = $(cells[1]).text().trim();
    const time = $(cells[2]).text().trim();
    const homeOrAway: "C" | "F" =
      $(cells[3]).text().trim() === "(F)" ? "F" : "C";

    let opponent =
      $(cells[5]).find("a").text().trim() || $(cells[5]).text().trim();
    opponent = opponent.replace(/\s+B$/, "").trim();

    let result = $(cells[6]).text().trim() || null;
    if (result === "-" || result === "") result = null;

    const competition =
      $(cells[7]).find("a").text().trim() || $(cells[7]).text().trim();

    let round = $(cells[8]).text().trim();
    if (!round) {
      const roundMatch = competition.match(/(J\d+|1\/\d+|Taça)/i);
      if (roundMatch) round = roundMatch[1];
    }

    if (!date || !opponent) return;

    scrapedMatches.push({
      date,
      time,
      homeOrAway,
      opponent,
      result,
      competition,
      round,
      outcome,
      seasonId: 0,
    });
  });

  console.log(`\n📊 Total de jogos encontrados: ${scrapedMatches.length}`);
  const uniqueComps = Array.from(new Set(scrapedMatches.map((m) => m.competition)));
  console.log(`🏆 Competições detectadas: ${uniqueComps.join(", ")}`);

  if (scrapedMatches.length > 0) {
    await saveMatches(teamConfig.name, scrapedMatches);
  }

  return scrapedMatches;
}