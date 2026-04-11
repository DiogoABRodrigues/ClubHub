import * as cheerio from "cheerio";
import Player from "../models/Player";
import Squad from "../models/Squad";
import Season from "../models/Season";
import { teamConfig } from "../config/teamConfig";
import Stats from "../models/Stats";
import { getSharedBrowser } from "../utils/browser";

async function getOrCreateSeason() {
  const [season] = await Season.findOrCreate({
    where: { year: teamConfig.currentSeason },
  });
  return season;
}

export async function scrapeTeamPlayers() {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(teamConfig.players_url, {
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

    // Esperar pelo conteúdo renderizado pelo JS
    await page.waitForSelector("#team_squad .staff, #team_squad .innerbox", {
      timeout: 30000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);
    const players: any[] = [];

    $("#team_squad .innerbox").each((_, box) => {
      const position = $(box).find(".section").text().trim() || "Unknown";

      $(box)
        .find(".staff")
        .each((_, el) => {
          const numberText = $(el).find(".number").text().trim();
          const number = numberText !== "-" ? parseInt(numberText) : null;

          const nameLink = $(el).find(".name a[href*='/jogador/']");
          const name = nameLink.text().trim();

          let externalId = null;
          const href = nameLink.attr("href");
          if (href) {
            const match = href.match(/\/jogador\/[^/]+\/(\d+)\?epoca_id=\d+/);
            if (match) externalId = parseInt(match[1]);
          }

          let age: number | null = null;
          const ageText = $(el).find(".name span").text().trim();
          if (ageText) {
            const m = ageText.match(/\d+/);
            if (m) age = parseInt(m[0]);
          }

          let photoUrl: string | null = null;
          const style = $(el).find(".photo").attr("style");
          if (style) {
            const m = style.match(/url\(['"]?(.*?)['"]?\)/);
            if (m) photoUrl = m[1];
          }

          if (name && externalId) {
            players.push({ externalId, name, number, position, age, photoUrl });
          }
        });
    });

    // Equipa técnica
    $("#team_staff .innerbox").each((_, box) => {
      const sectionRole = $(box).find(".section").text().trim() || "Staff";

      $(box)
        .find(".staff")
        .each((_, el) => {
          const nameLink = $(el).find(".text a[href*='/treinador/']");
          const name = nameLink.text().trim();

          let externalId: number | null = null;
          const href = nameLink.attr("href");
          if (href) {
            const match = href.match(/\/treinador\/[^/]+\/(\d+)/);
            if (match) externalId = parseInt(match[1]);
          }

          let age: number | null = null;
          const ageText = $(el).find("span").text().trim();
          if (ageText) {
            const m = ageText.match(/\d+/);
            if (m) age = parseInt(m[0]);
          }

          let photoUrl: string | null = null;
          const style = $(el).find(".photo").attr("style");
          if (style) {
            const m = style.match(/url\(['"]?(.*?)['"]?\)/);
            if (m) photoUrl = m[1];
          }

          if (name && externalId) {
            players.push({
              externalId,
              name,
              number: null,
              position: sectionRole,
              age,
              photoUrl,
            });
          }
        });
    });

    console.log(`✅ Jogadores encontrados: ${players.length}`);
    if (players.length === 0) console.log("⚠️ Nenhum jogador encontrado");

    const seasonName = teamConfig.currentSeason;
    let season = await Season.findOne({ where: { year: seasonName } });
    if (!season) {
      season = await Season.create({ year: seasonName });
    }

    for (const p of players) {
      await Squad.upsert({
        playerExternalId: p.externalId,
        seasonId: season.id,
        number: p.number,
        position: p.position,
      });
    }

    if (players.length > 0) {
      await savePlayersAndSquad(players);
    }

    return players;
  } finally {
    await page.close();
  }
}

export async function savePlayersAndSquad(players: any[]) {
  const season = await getOrCreateSeason();

  for (const p of players) {
    await Player.upsert({
      externalId: p.externalId,
      name: p.name,
      photoUrl: p.photoUrl,
      age: p.age,
    });

    await Squad.upsert({
      playerExternalId: p.externalId,
      seasonId: season.id,
      number: p.number,
      position: p.position,
    });

    await Stats.upsert({
      playerExternalId: p.externalId,
      seasonId: season.id,
      gamesPlayed: 0,
      goals: 0,
      minutesPlayed: 0,
      position: p.position,
    });
  }
}