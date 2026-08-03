import { Op } from "sequelize";
import { teamConfig, CategoryConfig } from "../config/teamConfig";
import * as cheerio from "cheerio";
import Match from "../models/Match";
import Competition from "../models/Competition";
import Season from "../models/Season";
import Player from "../models/Player";
import Lineup from "../models/Lineup";
import MatchEvent from "../models/MatchEvent";
import { getSharedBrowser } from "../utils/browser";

const ZEROZERO_BASE_URL = "https://www.zerozero.pt";

export interface ScrapedGoalEvent {
  type: "goal" | "red_card";
  minute: number;
  phase: "1st" | "2nd";
  isOpponent: boolean;
  isOwnGoal: boolean;
  externalId: number | null; // só preenchido para jogadores do nosso lado
}

export interface ScrapedLineupEntry {
  externalId: number;
  name: string;
  isStarting: boolean;
}

export interface ScrapedFormations {
  events: ScrapedGoalEvent[];
  lineup: ScrapedLineupEntry[];
}

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
  matchUrl: string | null;
  location: string | null;
  formations: ScrapedFormations | null;
}

function parseCompetition(competitionStr: string): {
  name: string;
  season: string;
} {
  // Procura a época no fim da string:
  // 2023/24 | 2023/2024 | 23/24
  const match = competitionStr.match(
    /^(.*?)\s+(\d{4}\/\d{2,4}|\d{2}\/\d{2})$/,
  );

  if (!match) {
    throw new Error(
      `Não foi possível extrair a época da competição: "${competitionStr}"`,
    );
  }

  const name = match[1].trim();
  const seasonRaw = match[2];

  let season: string;

  if (/^\d{2}\/\d{2}$/.test(seasonRaw)) {
    // 23/24 -> 2023/2024
    const [start, end] = seasonRaw.split("/").map(Number);
    season = `${2000 + start}/${2000 + end}`;
  } else if (/^\d{4}\/\d{2}$/.test(seasonRaw)) {
    // 2023/24 -> 2023/2024
    const [startStr, endStr] = seasonRaw.split("/");
    season = `${startStr}/${2000 + Number(endStr)}`;
  } else {
    // Já vem como 2023/2024
    season = seasonRaw;
  }

  return {
    name,
    season,
  };
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

function locationKey(date: string, opponent: string): string {
  return `${date}|${opponent}`;
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parsePlayerExternalId(href: string | undefined): number | null {
  if (!href) return null;
  const m = href.match(/\/jogador\/[^/]+\/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Lê os marcadores do cabeçalho da ficha do jogo (".match-header-scorers").
 * Esta é a fonte mais fiável para golos: o zerozero agrupa sempre o golo do
 * lado de quem BENEFICIA (mesmo autogolos), ao contrário da secção
 * "Formações" que por vezes nem sequer marca o autogolo.
 */
function parseHeaderGoals(
  $: cheerio.CheerioAPI,
  ourTeamName: string,
): ScrapedGoalEvent[] | null {
  const ourNameNorm = normalizeName(ourTeamName);
  const rightName = normalizeName(
    $(".match-header-team.right .match-header-team-name a").first().text(),
  );
  const leftName = normalizeName(
    $(".match-header-team.left .match-header-team-name a").first().text(),
  );

  let ourSide: "right" | "left" | null = null;
  if (rightName && (rightName.includes(ourNameNorm) || ourNameNorm.includes(rightName))) {
    ourSide = "right";
  } else if (leftName && (leftName.includes(ourNameNorm) || ourNameNorm.includes(leftName))) {
    ourSide = "left";
  }

  if (!ourSide) {
    console.log(
      `   ⚠️ Não consegui identificar o lado do ${ourTeamName} no cabeçalho do jogo`,
    );
    return null;
  }

  const events: ScrapedGoalEvent[] = [];

  (["right", "left"] as const).forEach((side) => {
    const groupIsOurs = side === ourSide;
    $(`.match-header-scorers.${side} a[href*='/jogador/']`).each((_, a) => {
      const externalId = parsePlayerExternalId($(a).attr("href"));
      const timeText = $(a).next("span.time").text().trim();
      const minuteMatches =
      timeText.match(/\d+(?:\+\d+)?/g) ?? [];

    for (const minuteText of minuteMatches) {
      const minute = parseMinute(minuteText);

      if (minute === null) continue;

      const isOwnGoal = /\(p\.b\.\)/i.test(timeText);

      // autogolo: quem marcou pertence à equipa contrária ao grupo onde aparece
      const scorerIsOurs = isOwnGoal ? !groupIsOurs : groupIsOurs;

      events.push({
        type: "goal",
        minute,
        phase: minute <= 45 ? "1st" : "2nd",
        isOpponent: !groupIsOurs,
        isOwnGoal,
        externalId: scorerIsOurs ? externalId : null,
      });
    }
    });
  });

  return events;
}

/**
 * Lê o bloco "Formações" da ficha do jogo.
 * Estrutura: 2 linhas (titulares, suplentes) x 2 colunas (uma por equipa),
 * sempre com a mesma equipa na mesma coluna nas duas linhas.
 * Só extrai cartões vermelhos ("Vermelhos") — os golos vêm do cabeçalho,
 * ver `parseHeaderGoals` — e só monta o lineup do lado que corresponde a
 * `ourTeamName`.
 */
function parseFormations(
  $: cheerio.CheerioAPI,
  ourTeamName: string,
): ScrapedFormations | null {
  const rows = $("#game_report .zz-tpl-row.game_report");
  if (rows.length === 0) return null;

  const titularsRow = rows.eq(0);
  const titularCols = titularsRow.find(".zz-tpl-col");
  if (titularCols.length < 2) return null;

  const ourNameNorm = normalizeName(ourTeamName);
  let ourColIndex: number | null = null;
  titularCols.each((i, el) => {
    const subtitle = normalizeName($(el).find(".subtitle").first().text());
    if (subtitle && (subtitle.includes(ourNameNorm) || ourNameNorm.includes(subtitle))) {
      ourColIndex = i;
    }
  });

  if (ourColIndex === null) {
    console.log(
      `   ⚠️ Não consegui identificar a coluna do ${ourTeamName} nas formações`,
    );
    return null;
  }

  const events: ScrapedGoalEvent[] = [];
  const lineup: ScrapedLineupEntry[] = [];

  rows.slice(0, 2).each((rowIdx, rowEl) => {
    const isSubsRow = rowIdx === 1;
    $(rowEl)
      .find(".zz-tpl-col")
      .each((colIdx, colEl) => {
        const isOurSide = colIdx === ourColIndex;

        $(colEl)
          .find(".player")
          .each((_, playerEl) => {
            const link = $(playerEl).find(".name a[href*='/jogador/']").first();
            const name = link.text().trim();
            const externalId = parsePlayerExternalId(link.attr("href"));

            const { enteredMinute, exitMinute, redCardMinutes } =
              extractPlayerEvents($, playerEl);

            // suplente que nunca entrou (fica no banco) -> nenhum cartão é válido,
            // mesmo que apareça listado (anomalia dos dados do zerozero)
            const neverPlayed = isSubsRow && enteredMinute === null;

            if (!neverPlayed) {
              const fieldStart = isSubsRow ? enteredMinute ?? 0 : 0;
              const fieldEnd = exitMinute ?? Infinity;

              for (const minute of redCardMinutes) {
                if (minute >= fieldStart && minute <= fieldEnd) {
                  events.push({
                    type: "red_card",
                    minute,
                    phase: minute <= 45 ? "1st" : "2nd",
                    isOpponent: !isOurSide,
                    isOwnGoal: false,
                    externalId: isOurSide ? externalId : null,
                  });
                }
              }
            }

            // ponto 1: guardar SEMPRE o suplente no lineup, entrou ou não
            if (isOurSide && name && externalId) {
              lineup.push({
                externalId,
                name,
                isStarting: !isSubsRow,
              });
            }
          });
      });
  });

  return { events, lineup };
}

async function getMatchesMissingFormations(
  teamName: string,
  category: string,
  finishedMatches: ScrapedMatch[],
): Promise<Set<string>> {
  const missing = new Set<string>();
  const candidates = finishedMatches.filter((m) => !!m.matchUrl);
  if (candidates.length === 0) return missing;

  const withLineup = await Match.findAll({
    where: {
      teamName,
      category,
      date: { [Op.in]: candidates.map((m) => m.date) },
    },
    include: [{ model: Lineup, attributes: ["id"], required: true, limit: 1 }],
  });

  const doneKeys = new Set(
    withLineup.map((m) => locationKey(m.date as unknown as string, m.opponent)),
  );

  for (const m of candidates) {
    const key = locationKey(m.date, m.opponent);
    if (!doneKeys.has(key)) missing.add(key);
  }
  return missing;
}

async function getKnownLocations(
  teamName: string,
  category: string,
  awayMatches: ScrapedMatch[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (awayMatches.length === 0) return map;

  const existing = await Match.findAll({
    where: {
      teamName,
      category,
      homeOrAway: "F",
      date: { [Op.in]: awayMatches.map((m) => m.date) },
      location: { [Op.ne]: null },
    },
  });

  for (const m of existing) {
    if (m.location) {
      map.set(locationKey(m.date as unknown as string, m.opponent), m.location);
    }
  }
  return map;
}

async function scrapeMatchPage(
  page: any,
  matchUrl: string,
  ourTeamName: string,
): Promise<{ location: string | null; formations: ScrapedFormations | null }> {
  try {
    await page.goto(matchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page
      .waitForSelector("#stadium, #game_report", { timeout: 10000 })
      .catch(() => {});

    const html = await page.content();
    const $ = cheerio.load(html);

    const stadiumName = $("#stadium .name a").first().text().trim();
    const stadiumPlace = $("#stadium .micrologo_and_text .text").first().text().trim();
    const location =
      stadiumName || stadiumPlace
        ? [stadiumName, stadiumPlace].filter(Boolean).join(", ")
        : null;

    /*const isUnconfirmed = $("body")
      .text()
      .includes("ainda não foi confirmado pelo zerozero");

    if (isUnconfirmed) {
      console.log(
        `   ⚠️ Resultado ainda não confirmado pelo zerozero (${matchUrl}) — não processo golos/cartões/lineup agora.`,
      );
      return { location, formations: null };
    }*/

    const headerGoals = parseHeaderGoals($, ourTeamName);
    const formations = parseFormations($, ourTeamName);

    const merged: ScrapedFormations | null =
      formations || headerGoals
        ? {
            events: [...(headerGoals ?? []), ...(formations?.events ?? [])],
            lineup: formations?.lineup ?? [],
          }
        : null;

    return { location, formations: merged };
  } catch {
    console.log(`   ⚠️ Não foi possível ler a ficha de ${matchUrl}`);
    return { location: null, formations: null };
  }
}

function parseExpectedGoals(
  result: string | null,
  homeOrAway: "C" | "F",
): { our: number; opponent: number } | null {
  if (!result) return null;
  const m = result.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!m) return null;

  const home = parseInt(m[1], 10);
  const away = parseInt(m[2], 10);
  return homeOrAway === "C"
    ? { our: home, opponent: away }
    : { our: away, opponent: home };
}

  function parseMinute(text: string): number | null {
  const clean = text.replace(/'/g, "").trim();

  const extra = clean.match(/^(\d+)\+(\d+)$/);

  if (extra) {
    return Number(extra[1]) + Number(extra[2]);
  }

  const normal = clean.match(/^\d+$/);

  if (normal) {
    return Number(normal[0]);
  }

  return null;
}

function extractPlayerEvents(
  $: cheerio.CheerioAPI,
  playerEl: any,
): { enteredMinute: number | null; exitMinute: number | null; redCardMinutes: number[] } {
  const children = $(playerEl).find(".events").first().children().toArray();

  let enteredMinute: number | null = null;
  let exitMinute: number | null = null;
  const redCardMinutes: number[] = [];

  let i = 0;
  while (i < children.length) {
    const el = children[i];
    if (el.tagName?.toLowerCase() === "span") {
      const $el = $(el);
      const title = $el.attr("title");
      const iconText = $el.text().trim();

      // procura o próximo <div> real, mesmo que haja outros <span> pelo meio
      // (ex: segunda amarela seguida do ícone de vermelho antes da div do minuto)
      let j = i + 1;
      while (j < children.length && children[j].tagName?.toLowerCase() !== "div") {
        j++;
      }
      const minuteText = j < children.length ? $(children[j]).text().trim() : "";
      const minute = parseMinute(minuteText);

      if (title === "Entrou") {
        enteredMinute = minute;
      } else if (!title && iconText === "8") {
        exitMinute = minute;
      } else if (title === "Vermelhos") {
        if (minute !== null) {
          redCardMinutes.push(minute);
        }
      }

      i = j + 1;
    } else {
      i++;
    }
  }

  return { enteredMinute, exitMinute, redCardMinutes };
}

async function saveFormations(
  matchId: number,
  formations: ScrapedFormations,
  expectedGoals: { our: number; opponent: number } | null,
) {
  const playerIdByExternalId = new Map<number, number>();

  const lineupToCreate = [];

for (const entry of formations.lineup) {
    let player = await Player.findOne({
        where: {
            externalId: entry.externalId,
        },
    });

    if (!player) {
        player = await Player.create({
            externalId: entry.externalId,
            name: entry.name,
            photoUrl: null,
            age: null,
        });
    }

    playerIdByExternalId.set(entry.externalId, player.id);

    lineupToCreate.push({
        matchId,
        playerId: player.id,
        isStarting: entry.isStarting,
    });
}

  const normalizeLineup = (l: {
      playerId: number;
      isStarting: boolean;
  }) => ({
      playerId: l.playerId,
      isStarting: l.isStarting,
  });

  const existingLineup = await Lineup.findAll({
    where: { matchId },
    order: [["playerId", "ASC"]],
  });

  const currentLineup = existingLineup
      .map(normalizeLineup)
      .sort((a, b) => a.playerId - b.playerId);

  const scrapedLineup = lineupToCreate
      .map(normalizeLineup)
      .sort((a, b) => a.playerId - b.playerId);

  const lineupChanged =
      JSON.stringify(currentLineup) !== JSON.stringify(scrapedLineup);

  if (lineupChanged) {
      await Lineup.destroy({
          where: {
              matchId,
          },
      });

      if (lineupToCreate.length > 0) {
          await Lineup.bulkCreate(lineupToCreate);
      }

      console.log(
          `   🔄 Lineup sincronizado (${lineupToCreate.length} jogador(es))`,
      );
  }

  const ourScrapedGoals = formations.events.filter(
    (e) => e.type === "goal" && !e.isOpponent,
  ).length;
  const opponentScrapedGoals = formations.events.filter(
    (e) => e.type === "goal" && e.isOpponent,
  ).length;

  if (
    expectedGoals &&
    (ourScrapedGoals !== expectedGoals.our ||
      opponentScrapedGoals !== expectedGoals.opponent)
  ) {
    console.log(
      `   ⚠️ Golos lidos nas formações (${ourScrapedGoals}-${opponentScrapedGoals}) não batem certo com o resultado (${expectedGoals.our}-${expectedGoals.opponent}) — guardo os eventos lidos na mesma, convém confirmar manualmente.`,
    );
  }
  const eventsToCreate = [];

for (const ev of formations.events) {
  let playerId: number | null = null;

  if (ev.externalId) {
    playerId = playerIdByExternalId.get(ev.externalId) ?? null;

    if (playerId === null) {
      const [player] = await Player.findOrCreate({
        where: { externalId: ev.externalId },
        defaults: {
          name: `Jogador ${ev.externalId}`,
          photoUrl: null,
          age: null,
        },
      });

      playerId = player.id;
      playerIdByExternalId.set(ev.externalId, player.id);
    }
  }

  eventsToCreate.push({
    matchId,
    type: ev.type,
    minute: ev.minute,
    phase: ev.phase,
    playerId,
    isOpponent: ev.isOpponent,
    isOwnGoal: ev.isOwnGoal,
  });
}

const existingEvents = await MatchEvent.findAll({
  where: {
    matchId,
    type: {
      [Op.in]: ["goal", "red_card"],
    },
  },
  order: [
    ["minute", "ASC"],
    ["type", "ASC"],
    ["playerId", "ASC"],
  ],
});
  const scraperIsConsistent =
    !expectedGoals ||
    (ourScrapedGoals >= expectedGoals.our &&
      opponentScrapedGoals >= expectedGoals.opponent);

const existingHasEvents = existingEvents.length > 0;

// ZeroZero parece inconsistente mas já temos dados locais.
// Mantemos os dados da BD.
if (!scraperIsConsistent && existingHasEvents) {
  console.log(
    `   ⚠️ Eventos do ZeroZero inconsistentes com o resultado. Mantidos os eventos existentes.`,
  );
  return;
}

const currentEvents = existingEvents
  .map((e) => ({
    type: e.type,
    minute: e.minute,
    phase: e.phase ?? null,
    playerId: e.playerId ?? null,
    isOpponent: e.isOpponent ?? false,
    isOwnGoal: e.isOwnGoal ?? false,
  }))
  .sort((a, b) => a.minute - b.minute);

const scrapedEvents = eventsToCreate
  .map((e) => ({
    type: e.type,
    minute: e.minute,
    phase: e.phase ?? null,
    playerId: e.playerId ?? null,
    isOpponent: e.isOpponent,
    isOwnGoal: e.isOwnGoal,
  }))
  .sort((a, b) => a.minute - b.minute);

const eventsChanged =
  JSON.stringify(currentEvents) !== JSON.stringify(scrapedEvents);

if (eventsChanged) {
  await MatchEvent.destroy({
    where: {
      matchId,
      type: {
        [Op.in]: ["goal", "red_card"],
      },
    },
  });

  if (eventsToCreate.length > 0) {
    await MatchEvent.bulkCreate(eventsToCreate);
  }

  console.log(
    `   🔄 MatchEvents sincronizados (${eventsToCreate.length} evento(s))`,
  );
}
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

    const location =
      match.homeOrAway === "C" ? teamConfig.teamLocation : match.location;

    const [matchRow] = await Match.upsert({
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

    if (match.formations) {
      const expectedGoals = parseExpectedGoals(match.result, match.homeOrAway);
      await saveFormations(matchRow.id, match.formations, expectedGoals);
    }
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

    const matchHref = $(cells[6]).find("a").attr("href") || null;
    const matchUrl = matchHref ? `${ZEROZERO_BASE_URL}${matchHref}` : null;

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
      matchUrl,
      location: null,
      formations: null,
    });
  });

  console.log(
    `📊 Total de jogos encontrados: ${scrapedMatches.length} [${config.category}]`,
  );

  const finishedMatches = scrapedMatches.filter((m) => !!m.result);

  const awayMatches = finishedMatches.filter((m) => m.homeOrAway === "F");
  const knownLocations = await getKnownLocations(
    config.teamName,
    config.category,
    awayMatches,
  );
  for (const m of awayMatches) {
    const known = knownLocations.get(locationKey(m.date, m.opponent));
    if (known) m.location = known;
  }

  const matchesToVisit = finishedMatches.filter((m)=>!!m.matchUrl);

  if (matchesToVisit.length > 0) {
    console.log(
      `📍 A visitar ${matchesToVisit.length} ficha(s) de jogo (localização/formações) [${config.category}]`,
    );
    const detailPage = await browser.newPage();
    await detailPage.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );

    for (const match of matchesToVisit) {
      const { location, formations } = await scrapeMatchPage(
        detailPage,
        match.matchUrl!,
        config.teamName,
      );
      if (!match.location) match.location = location;
      match.formations = formations;
      await new Promise((r) => setTimeout(r, 700));
    }

    await detailPage.close();
  }

  if (scrapedMatches.length > 0) {
    await saveMatches(config.teamName, scrapedMatches, config.category);
  }

  return scrapedMatches;
}