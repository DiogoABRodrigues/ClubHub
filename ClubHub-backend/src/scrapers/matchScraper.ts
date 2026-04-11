// src/scrapers/matchScraper.ts
import { teamConfig } from "../config/teamConfig";
import Match from "../models/Match";
import Competition from "../models/Competition";
import Season from "../models/Season";
import { launchBrowser } from "../utils/browser";
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
export async function saveMatches(
  teamName: string,
  scrapedMatches: ScrapedMatch[],
) {
  for (const match of scrapedMatches) {
    let competitionId: number | null = null;
    let seasonId: number | null = null;

    if (match.competition) {
      const competition = await getOrCreateCompetition(match.competition);
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
    });
  }
  console.log(
    `✅ ${scrapedMatches.length} jogos guardados/atualizados para a equipa ${teamName}`,
  );
}

// Scraper principal
export async function scrapeTeamMatches(): Promise<ScrapedMatch[]> {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  console.log(`🌐 A aceder a: ${teamConfig.matches_url}`);
  await page.goto(teamConfig.matches_url, {
    waitUntil: "networkidle2",
    timeout: 300000,
  });

  // Aceitar cookies
  try {
    await page.waitForSelector("button", { timeout: 300000 });
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

  await page.waitForSelector("#team_games table", { timeout: 300000 });
  await new Promise((r) => setTimeout(r, 300000));

  const scrapedMatches: ScrapedMatch[] = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("tr.parent"));
    return rows
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 9) return null;

        let outcome: "V" | "E" | "D" | null = null;
        const formEl = cells[0].querySelector(".form .sign");
        if (formEl?.classList.contains("win")) outcome = "V";
        else if (formEl?.classList.contains("draw")) outcome = "E";
        else if (formEl?.classList.contains("lost")) outcome = "D";

        const date = cells[1].textContent?.trim() || "";
        const time = cells[2].textContent?.trim() || "";
        let homeOrAway: "C" | "F" =
          cells[3].textContent?.trim() === "(F)" ? "F" : "C";

        let opponent =
          cells[5].querySelector("a")?.textContent?.trim() ||
          cells[5].textContent?.trim() ||
          "";
        opponent = opponent.replace(/\s+B$/, "").trim();

        let result = cells[6].textContent?.trim() || null;
        if (result === "-" || result === "") result = null;

        let competition =
          cells[7].querySelector("a")?.textContent?.trim() ||
          cells[7].textContent?.trim() ||
          "";

        let round = cells[8].textContent?.trim() || "";
        if (!round) {
          const roundMatch = competition.match(/(J\d+|1\/\d+|Taça)/i);
          if (roundMatch) round = roundMatch[1];
        }

        if (!date || !opponent) return null;
        return {
          date,
          time,
          homeOrAway,
          opponent,
          result,
          competition,
          round,
          outcome,
        } as ScrapedMatch;
      })
      .filter(Boolean) as ScrapedMatch[];
  });

  await browser.close();

  console.log(`\n📊 Total de jogos encontrados: ${scrapedMatches.length}`);
  const uniqueComps = Array.from(
    new Set(scrapedMatches.map((m) => m.competition)),
  );
  console.log(`🏆 Competições detectadas: ${uniqueComps.join(", ")}`);

  if (scrapedMatches.length > 0) {
    await saveMatches(teamConfig.name, scrapedMatches);
  }
  return scrapedMatches;
}
