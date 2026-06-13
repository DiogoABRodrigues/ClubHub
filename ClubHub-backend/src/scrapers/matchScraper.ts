import { teamConfig, CategoryConfig } from "../config/teamConfig";
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

function parseCompetition(competitionStr: string): {
  name: string;
  season: string;
} {
  const match = competitionStr.match(/(.+?)\s+(\d{4}\/\d{4}|\d{2}\/\d{2})$/);
  if (match) {
    let season = match[2];
    if (/^\d{2}\/\d{2}$/.test(season)) {
      const [start, end] = season.split("/").map(Number);
      season = `${start + 2000}/${end + 2000}`;
    }
    return { name: match[1].trim(), season };
  }
  return { name: competitionStr, season: "2025/2026" };
}

async function getOrCreateSeason(seasonName: string) {
  let season = await Season.findOne({ where: { year: seasonName } });
  if (!season) {
    console.log(`   🆕 Nova season: ${seasonName}`);
    season = await Season.create({ year: seasonName });
  }
  return season;
}

async function getOrCreateCompetition(
  competitionStr: string,
  category: string,
) {
  const { name, season: seasonName } = parseCompetition(competitionStr);
  const season = await getOrCreateSeason(seasonName);

  let competition = await Competition.findOne({
    where: { name, seasonId: season.id, category },
  });
  if (!competition) {
    console.log(`   🆕 Nova competição: ${name} (${seasonName}) [${category}]`);
    competition = await Competition.create({
      name,
      seasonId: season.id,
      category,
    });
  }
  return competition;
}

export async function saveMatches(
  teamName: string,
  scrapedMatches: ScrapedMatch[],
  category: string,
) {
  for (const match of scrapedMatches) {
    let competitionId: number | null = null;
    let seasonId: number | null = null;

    if (match.competition) {
      const competition = await getOrCreateCompetition(
        match.competition,
        category,
      );
      competitionId = competition.id;
      seasonId = competition.seasonId;
    }

    const location = match.homeOrAway === "C" ? teamConfig.teamLocation : null;

    await Match.upsert({
      teamName,
      date: match.date,
      time: match.time,
      homeOrAway: match.homeOrAway,
      opponent: match.opponent,
      result: match.result,
      competitionId,
      seasonId,
      round: match.round,
      outcome: match.outcome,
      status: match.result ? "finished" : "upcoming",
      location,
      category,
    });
  }
  console.log(
    `✅ ${scrapedMatches.length} jogos guardados para ${teamName} [${category}]`,
  );
}

export async function scrapeTeamMatches(
  cfg?: CategoryConfig,
): Promise<ScrapedMatch[]> {
  const config =
    cfg ?? teamConfig.categories.find((c) => c.category === "over19")!;

  const browser = await getSharedBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  console.log(`🌐 A aceder a: ${config.matches_url} [${config.category}]`);
  await page.goto(config.matches_url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  try {
    await page.waitForSelector("button", { timeout: 5000 });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const acceptBtn = btns.find((b) => b.textContent?.includes("Aceitar"));
      if (acceptBtn) (acceptBtn as HTMLElement).click();
    });
  } catch {}

  try {
    await page.waitForSelector("#team_games table", { timeout: 20000 });
  } catch {
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#team_games table", { timeout: 20000 });
  }

  const html = await page.content();
  await page.close();

  const $ = cheerio.load(html);
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

  console.log(
    `📊 Total de jogos encontrados: ${scrapedMatches.length} [${config.category}]`,
  );

  if (scrapedMatches.length > 0) {
    await saveMatches(config.teamName, scrapedMatches, config.category);
  }

  return scrapedMatches;
}
