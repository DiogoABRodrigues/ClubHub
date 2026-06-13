import * as cheerio from "cheerio";
import Player from "../models/Player";
import Squad from "../models/Squad";
import Season from "../models/Season";
import Stats from "../models/Stats";
import { teamConfig, CategoryConfig } from "../config/teamConfig";
import { getSharedBrowser } from "../utils/browser";

async function getOrCreateSeason() {
  const [season] = await Season.findOrCreate({
    where: { year: teamConfig.currentSeason },
  });
  return season;
}

function parsePlayerId(href: string): number | null {
  const m = href.match(/\/jogador\/[^/]+\/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function parseTrainerId(href: string): number | null {
  const m = href.match(/\/treinador\/[^/]+\/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function parseAge(
  el: cheerio.Cheerio<any>,
  $: cheerio.CheerioAPI,
): number | null {
  const text = $(el).find("span").text().trim();
  const m = text.match(/\d+/);
  return m ? parseInt(m[0]) : null;
}

function parsePhoto(
  el: cheerio.Cheerio<any>,
  $: cheerio.CheerioAPI,
): string | null {
  const style = $(el).find(".photo").attr("style") ?? "";
  const m = style.match(/url\(['"]?(.*?)['"']?\)/);
  return m ? m[1] : null;
}

export async function scrapeTeamPlayers(cfg?: CategoryConfig) {
  const config =
    cfg ?? teamConfig.categories.find((c) => c.category === "over19")!;

  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setViewport({ width: 1280, height: 800 });

    try {
      await page.goto(config.players_url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
    } catch {
      console.log("⚠️ Timeout no goto players, a tentar continuar...");
    }

    try {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll("button")).find((b) =>
          b.textContent?.includes("Aceitar"),
        );
        if (btn) (btn as HTMLElement).click();
      });
    } catch {}

    try {
      await page.waitForSelector("#team_squad .staff, #team_squad .innerbox", {
        timeout: 30000,
      });
    } catch {
      console.log("⚠️ Seletor principal não encontrado, a tentar continuar...");
    }

    const html = await page.content();
    const $ = cheerio.load(html);
    const players: any[] = [];

    const squadBox = $("#team_squad .innerbox").length
      ? $("#team_squad .innerbox")
      : null;

    if (squadBox && squadBox.length > 0) {
      squadBox.each((_, box) => {
        const position = $(box).find(".section").text().trim() || "Unknown";
        $(box)
          .find(".staff")
          .each((_, el) => {
            const numberText = $(el).find(".number").text().trim();
            const number =
              numberText && numberText !== "-" ? parseInt(numberText) : null;
            const nameLink = $(el).find(".name a[href*='/jogador/']").length
              ? $(el).find(".name a[href*='/jogador/']")
              : $(el).find("a[href*='/jogador/']");
            const name = nameLink.text().trim();
            const href = nameLink.attr("href") ?? "";
            const externalId = parsePlayerId(href);
            const age = parseAge($(el), $);
            const photoUrl = parsePhoto($(el), $);
            if (name && externalId)
              players.push({
                externalId,
                name,
                number,
                position,
                age,
                photoUrl,
              });
          });
      });
    } else {
      $("a[href*='/jogador/']").each((_, el) => {
        const href = $(el).attr("href") ?? "";
        const externalId = parsePlayerId(href);
        const name = $(el).text().trim();
        if (
          name &&
          externalId &&
          !players.find((p) => p.externalId === externalId)
        ) {
          const row = $(el).closest(".staff, tr, li");
          const numberText = row.find(".number").text().trim();
          const number =
            numberText && numberText !== "-" ? parseInt(numberText) : null;
          const photoUrl = parsePhoto(row, $);
          players.push({
            externalId,
            name,
            number,
            position: "Unknown",
            age: null,
            photoUrl,
          });
        }
      });
    }

    // Staff técnico
    const staffBox = $("#team_staff .innerbox").length
      ? $("#team_staff .innerbox")
      : null;
    if (staffBox) {
      staffBox.each((_, box) => {
        const sectionRole = $(box).find(".section").text().trim() || "Staff";
        $(box)
          .find(".staff")
          .each((_, el) => {
            const nameLink = $(el).find("a[href*='/treinador/']");
            const name = nameLink.text().trim();
            const href = nameLink.attr("href") ?? "";
            const externalId = parseTrainerId(href);
            const age = parseAge($(el), $);
            const photoUrl = parsePhoto($(el), $);
            if (name && externalId)
              players.push({
                externalId,
                name,
                number: null,
                position: sectionRole,
                age,
                photoUrl,
              });
          });
      });
    }

    console.log(`✅ Total encontrado: ${players.length} [${config.category}]`);

    if (players.length > 0) {
      await savePlayersAndSquad(players, config.category);
    }

    return players;
  } finally {
    await page.close();
  }
}

export async function savePlayersAndSquad(
  players: any[],
  category: string = "over19",
) {
  const season = await getOrCreateSeason();

  for (const p of players) {
    await Player.upsert({
      externalId: p.externalId,
      name: p.name,
      photoUrl: p.photoUrl,
      age: p.age,
      // category removida — jogador existe uma única vez, escalão fica no Squad
    });

    await Squad.upsert({
      playerExternalId: p.externalId,
      seasonId: season.id,
      number: p.number,
      position: p.position,
      category,
    });

    await Stats.upsert({
      playerExternalId: p.externalId,
      seasonId: season.id,
      gamesPlayed: 0,
      goals: 0,
      minutesPlayed: 0,
      position: p.position,
      category,
    });
  }
}
