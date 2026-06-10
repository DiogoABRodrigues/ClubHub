import * as cheerio from "cheerio";
import { teamConfig, CategoryConfig } from "../config/teamConfig";
import Team from "../models/Team";
import Standing from "../models/Standing";
import Season from "../models/Season";
import Competition from "../models/Competition";
import { getSharedBrowser } from "../utils/browser";

export interface StandingRow {
  position: number;
  teamName: string;
  teamUrl?: string;
  points: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  rowColor: string | null; // cor extraída do zerozero (ex: "rgba(106, 161, 33, 1)")
}

async function getOrCreateSeason(seasonName: string) {
  let season = await Season.findOne({ where: { year: seasonName } });
  if (!season) {
    console.log(`   🆕 Nova season: ${seasonName}`);
    season = await Season.create({ year: seasonName });
  }
  return season;
}

/** Converte "rgba(106, 161, 33, 1)" → "#6aa121" para guardar de forma consistente */
function rgbaToHex(rgba: string): string | null {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  const r = parseInt(m[1]).toString(16).padStart(2, "0");
  const g = parseInt(m[2]).toString(16).padStart(2, "0");
  const b = parseInt(m[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

/** Extrai a cor da célula da posição (border-right ou background-color) */
function extractRowColor($: cheerio.CheerioAPI, posCell: any): string | null {
  const style = $(posCell).attr("style") ?? "";

  // Tenta background-color
  let match = style.match(/background-color:\s*(rgba?\([^)]+\)|#[0-9a-fA-F]+)/);
  if (match) {
    const raw = match[1];
    // Ignora branco (#ffffff / rgba(234,239,244,...) — zona neutra)
    if (raw === "#ffffff" || raw.startsWith("rgba(234") || raw.startsWith("rgba(255")) {
      return null;
    }
    return raw.startsWith("#") ? raw : rgbaToHex(raw);
  }

  return null;
}

export async function scrapeStandings(cfg?: CategoryConfig): Promise<StandingRow[]> {
  const config = cfg ?? teamConfig.categories.find((c) => c.category === "over19")!;
  const browser = await getSharedBrowser();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  console.log(`🌐 A aceder a: ${config.standings_url} [${config.category}]`);

  try {
    await page.goto(config.standings_url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    try {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const btn = btns.find(
          (b) => b.textContent?.includes("Aceitar") || b.textContent?.includes("Accept"),
        );
        if (btn) (btn as HTMLElement).click();
      });
    } catch {}

    try {
      await page.waitForSelector("table", { timeout: 30000 });
    } catch {
      throw new Error("Tabela não encontrada na página");
    }

    const html = await page.content();
    const $ = cheerio.load(html);
    const standings: StandingRow[] = [];

    // Tenta DataTable primeiro, depois qualquer tabela
    let tableRows =
      $("table#DataTables_Table_0 tbody tr").toArray().length > 0
        ? $("table#DataTables_Table_0 tbody tr").toArray()
        : $("table tbody tr").toArray();

    // Extrai a legenda do HTML do zerozero (se existir)
    const legendItems: { color: string; label: string }[] = [];
    $(".legend table tr").each((_, row) => {
      const tdStyle = $(row).find("td").first().attr("style") ?? "";
      const labelText = $(row).find("td").last().text().trim();
      const match = tdStyle.match(/background-color:\s*(rgba?\([^)]+\)|#[0-9a-fA-F]+)/);
      if (match && labelText) {
        const hex = match[1].startsWith("#") ? match[1] : rgbaToHex(match[1]);
        if (hex) legendItems.push({ color: hex, label: labelText });
      }
    });

    if (legendItems.length > 0) {
      console.log(`📋 Legenda encontrada: ${legendItems.length} entradas`);
    }

    for (const row of tableRows) {
      const $row = $(row);
      const cells = $row.find("td");
      if (cells.length < 10) continue;

      const firstCellText = $(cells[0]).text().trim();
      const position = parseInt(firstCellText);
      if (isNaN(position)) continue;

      // Extrai a cor desta linha
      const rowColor = extractRowColor($, cells[0]);

      // Encontra o link da equipa
      let teamName = "";
      let teamUrl: string | undefined;
      let teamNameCellIndex = 1;

      for (let i = 0; i < cells.length; i++) {
        const link = $(cells[i]).find("a");
        if (link.length > 0) {
          const text = link.text().trim();
          if (text.length > 2 && !text.match(/^\d+$/)) {
            teamName = text;
            teamNameCellIndex = i;
            const href = link.attr("href");
            if (href) {
              teamUrl = href.startsWith("http") ? href : `https://www.zerozero.pt${href}`;
            }
            break;
          }
        }
      }

      if (!teamName) continue;

      const n = teamNameCellIndex;
      const points        = parseInt($(cells[n + 1]).text().trim()) || 0;
      const matchesPlayed = parseInt($(cells[n + 2]).text().trim()) || 0;
      const wins          = parseInt($(cells[n + 3]).text().trim()) || 0;
      const draws         = parseInt($(cells[n + 4]).text().trim()) || 0;
      const losses        = parseInt($(cells[n + 5]).text().trim()) || 0;
      const goalsFor      = parseInt($(cells[n + 6]).text().trim()) || 0;
      const goalsAgainst  = parseInt($(cells[n + 7]).text().trim()) || 0;
      const gdText        = $(cells[n + 8]).text().trim();
      const goalDifference = parseInt(gdText.replace(/[^0-9-]/g, "")) || goalsFor - goalsAgainst;

      standings.push({
        position, teamName, teamUrl,
        points, matchesPlayed, wins, draws, losses,
        goalsFor, goalsAgainst, goalDifference,
        rowColor,
      });
    }

    console.log(`✅ ${standings.length} equipas extraídas`);

    const season = await getOrCreateSeason(teamConfig.currentSeason);

    if (standings.length > 0) {
      await saveStandings(standings, 1, season.id, config.category);
    }

    // Atualiza a legenda na Competition se a encontrámos
    if (legendItems.length > 0) {
      const competition = await Competition.findOne({ where: { seasonId: season.id, category: config.category } });
      if (competition) {
        // Deduplica por cor
        const seen = new Set<string>();
        const dedupedLegend = legendItems.filter((item) => {
          if (seen.has(item.color)) return false;
          seen.add(item.color);
          return true;
        });
        await competition.update({ legend: dedupedLegend });
        console.log(`📋 Legenda guardada na competição (${dedupedLegend.length} entradas)`);
      }
    }

    return standings;
  } catch (error) {
    console.error("❌ Erro durante o scraping:", error);
    try { await page.screenshot({ path: "error-screenshot.png" }); } catch {}
    throw error;
  } finally {
    await page.close();
  }
}

export async function saveStandings(
  standings: StandingRow[],
  competitionId: number,
  seasonId: number,
  category: string = "over19",
) {
  const data = [];

  for (const row of standings) {
    let team = await Team.findOne({ where: { name: row.teamName } });
    if (!team) {
      team = await Team.create({ name: row.teamName, externalUrl: row.teamUrl });
    }

    data.push({
      teamName: team.name,
      competitionId,
      seasonId,
      category,
      position: row.position,
      points: row.points,
      played: row.matchesPlayed,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff: row.goalDifference,
      rowColor: row.rowColor,
    });
  }

  await Standing.destroy({ where: { competitionId, seasonId, category } });
  await Standing.bulkCreate(data);

  console.log(`✅ Standings guardadas (competição ${competitionId}, season ${seasonId}, ${category})`);
}