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

/** Extrai o externalId de qualquer variante de URL do zerozero:
 *  /jogador/nome/12345
 *  /jogador/nome/12345?epoca_id=99
 *  /jogador/nome/12345/stats
 */
function parsePlayerId(href: string): number | null {
  const m = href.match(/\/jogador\/[^/]+\/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function parseTrainerId(href: string): number | null {
  const m = href.match(/\/treinador\/[^/]+\/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function parseAge(el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): number | null {
  const text = $(el).find("span").text().trim();
  const m = text.match(/\d+/);
  return m ? parseInt(m[0]) : null;
}

function parsePhoto(el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string | null {
  const style = $(el).find(".photo").attr("style") ?? "";
  const m = style.match(/url\(['"]?(.*?)['"]?\)/);
  return m ? m[1] : null;
}

export async function scrapeTeamPlayers() {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setViewport({ width: 1280, height: 800 });

    try {
      await page.goto(teamConfig.players_url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
    } catch {
      console.log("⚠️ Timeout no goto players, a tentar continuar...");
    }

    // Aceitar cookies
    try {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll("button")).find((b) =>
          b.textContent?.includes("Aceitar"),
        );
        if (btn) (btn as HTMLElement).click();
      });
    } catch {}

    // Espera por qualquer um dos seletores conhecidos
    try {
      await page.waitForSelector(
        "#team_squad .staff, #team_squad .innerbox, .team-player, [class*='squad']",
        { timeout: 30000 },
      );
    } catch {
      console.log("⚠️ Seletor principal não encontrado, a tentar continuar...");
    }

    const html = await page.content();
    const $ = cheerio.load(html);
    const players: any[] = [];

    // ── DEBUG: mostra os IDs e classes de topo para diagnóstico ──────────
    const topIds = $("[id]")
      .map((_, el) => $(el).attr("id"))
      .get()
      .filter(Boolean)
      .slice(0, 30);
    console.log("🔍 IDs encontrados na página:", topIds.join(", "));

    // ── JOGADORES ────────────────────────────────────────────────────────
    // Tenta o seletor original primeiro, depois variantes
    const squadBox = $("#team_squad .innerbox").length
      ? $("#team_squad .innerbox")
      : $(".team_squad .innerbox, [id*='squad'] .innerbox").length
        ? $(".team_squad .innerbox, [id*='squad'] .innerbox")
        : null;

    if (squadBox && squadBox.length > 0) {
      console.log(`✅ Encontrou squad box com ${squadBox.length} grupos`);

      squadBox.each((_, box) => {
        const position = $(box).find(".section").text().trim() || "Unknown";

        $(box)
          .find(".staff")
          .each((_, el) => {
            const numberText = $(el).find(".number").text().trim();
            const number =
              numberText && numberText !== "-" ? parseInt(numberText) : null;

            // Tenta .name primeiro, depois .text (variante nova)
            const nameLink =
              $(el).find(".name a[href*='/jogador/']").length
                ? $(el).find(".name a[href*='/jogador/']")
                : $(el).find("a[href*='/jogador/']");

            const name = nameLink.text().trim();
            const href = nameLink.attr("href") ?? "";
            const externalId = parsePlayerId(href);

            const age = parseAge($(el), $);
            const photoUrl = parsePhoto($(el), $);

            if (name && externalId) {
              players.push({ externalId, name, number, position, age, photoUrl });
            } else {
              // Log para perceber o que está a falhar
              if (name && !externalId) {
                console.log(`⚠️ Jogador "${name}" sem externalId. href="${href}"`);
              }
            }
          });
      });
    } else {
      // Fallback: procura qualquer link de jogador na página
      console.log("⚠️ squad box não encontrado — a tentar fallback genérico");

      $("a[href*='/jogador/']").each((_, el) => {
        const href = $(el).attr("href") ?? "";
        const externalId = parsePlayerId(href);
        const name = $(el).text().trim();

        if (name && externalId && !players.find((p) => p.externalId === externalId)) {
          // Sobe ao elemento pai para tentar apanhar número e posição
          const row = $(el).closest(".staff, tr, li, [class*='player']");
          const numberText = row.find(".number, [class*='number']").text().trim();
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

    // ── EQUIPA TÉCNICA ───────────────────────────────────────────────────
    const staffBox = $("#team_staff .innerbox").length
      ? $("#team_staff .innerbox")
      : $(".team_staff .innerbox, [id*='staff'] .innerbox");

    staffBox.each((_, box) => {
      const sectionRole = $(box).find(".section").text().trim() || "Staff";

      $(box)
        .find(".staff")
        .each((_, el) => {
          const nameLink =
            $(el).find(".text a[href*='/treinador/']").length
              ? $(el).find(".text a[href*='/treinador/']")
              : $(el).find("a[href*='/treinador/']");

          const name = nameLink.text().trim();
          const href = nameLink.attr("href") ?? "";
          const externalId = parseTrainerId(href);

          const age = parseAge($(el), $);
          const photoUrl = parsePhoto($(el), $);

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

    console.log(`✅ Total encontrado: ${players.length} (jogadores + staff)`);
    if (players.length === 0) {
      console.log("⚠️ Nenhum jogador encontrado — verifica os IDs acima no log");
    }

    const seasonName = teamConfig.currentSeason;
    let season = await Season.findOne({ where: { year: seasonName } });
    if (!season) season = await Season.create({ year: seasonName });

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