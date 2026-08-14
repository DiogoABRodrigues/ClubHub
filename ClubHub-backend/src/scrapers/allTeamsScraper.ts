import * as cheerio from "cheerio";
import Team from "../models/Team";
import { getSharedBrowser } from "../utils/browser";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export interface ScrapedTeam {
  externalId: number;
  name: string;
  abbreviation?: string;
  logoUrl?: string;
  profileUrl?: string;
}

function extractTeamExternalId(href: string | undefined): number | null {
  if (!href) return null;
  const match = href.match(/\/equipa\/[^/]+\/(\d+)(?:[/?#]|$)/);
  return match ? Number(match[1]) : null;
}

async function ensureZeroZeroPageIsAvailable(
  page: import("puppeteer").Page,
) {
  const title = await page.title();
  const pageText = await page.evaluate(() => document.body?.innerText ?? "");

  if (
    title.toLowerCase().includes("attention required") ||
    /cloudflare|just a moment/i.test(pageText)
  ) {
    throw new Error(
      "O ZeroZero bloqueou este pedido com Cloudflare. Nenhuma equipa foi lida; tenta novamente mais tarde.",
    );
  }
}

function extractLogoUrlFromHtml(html: string): string | undefined {
  const $ = cheerio.load(html);
  const image = $("img[src*='/img/logos/equipas/'], img[data-src*='/img/logos/equipas/']").first();
  const imageUrl = image.attr("src") || image.attr("data-src");
  if (imageUrl) {
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://www.zerozero.pt${imageUrl}`;
  }

  const background = $("[style*='/img/logos/equipas/']")
    .first()
    .attr("style")
    ?.match(/url\(["']?([^"')]+)["']?\)/i)?.[1];
  return background
    ? background.startsWith("http")
      ? background
      : `https://www.zerozero.pt${background}`
    : undefined;
}

async function fetchTeamLogo(profileUrl: string): Promise<string | undefined> {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "pt-PT,pt;q=0.9" });
    await page.goto(profileUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
    await ensureZeroZeroPageIsAvailable(page);
    return extractLogoUrlFromHtml(await page.content());
  } catch (error) {
    console.warn(`Não foi possível obter o logo de ${profileUrl}:`, error);
    return undefined;
  } finally {
    await page.close();
  }
}

export async function scrapeAllTeams(
  competitionUrls: string[] = [],
  options: { persist?: boolean } = {},
): Promise<ScrapedTeam[]> {
  const browser = await getSharedBrowser();
  const allTeams: ScrapedTeam[] = [];
  const competitions = [...new Set(competitionUrls)]
    .map((url) => ({ url: `${url.replace(/\/$/, "")}/equipas` }));

  for (const comp of competitions) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      );
      await page.setExtraHTTPHeaders({ "Accept-Language": "pt-PT,pt;q=0.9" });
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
      });

      await page.goto(comp.url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await ensureZeroZeroPageIsAvailable(page);

      // Aceitar cookies
      try {
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const acceptBtn = buttons.find(
            (btn) =>
              btn.textContent?.includes("Aceitar") ||
              btn.textContent?.includes("Aceitar todos"),
          );
          if (acceptBtn) (acceptBtn as HTMLElement).click();
        });
      } catch {}

      await page.waitForSelector("a[href*='/equipa/']", { timeout: 30000 });
      await ensureZeroZeroPageIsAvailable(page);

      const html = await page.content();
      const $ = cheerio.load(html);
      const compTeams: ScrapedTeam[] = [];

      const toAbsoluteUrl = (url?: string) =>
        url && !url.startsWith("http") ? `https://www.zerozero.pt${url}` : url;

      const addTeam = (
        href: string | undefined,
        name: string | undefined,
        logoUrl?: string,
      ) => {
        const externalId = extractTeamExternalId(href);
        const cleanName = name?.replace(/\s+/g, " ").trim();
        if (
          !externalId ||
          !cleanName ||
          cleanName.length <= 2 ||
          compTeams.some((team) => team.externalId === externalId)
        ) {
          return;
        }

        compTeams.push({
          externalId,
          name: cleanName,
          logoUrl: toAbsoluteUrl(logoUrl),
          profileUrl: toAbsoluteUrl(href),
        });
      };

      // Formato recente: cartões. O texto do <a> contém também "xª participação",
      // por isso o nome tem obrigatoriamente de vir do span .first_name.
      $(".zz_stats_card").each((_, card) => {
        const teamLink = $(card).find("a[href*='/equipa/']").first();
        const logoLink = $(card).find(".photo-team a[href*='/equipa/']").first();
        const backgroundImage = logoLink.attr("style")?.match(
          /background:\s*url\(["']?([^"')]+)["']?\)/i,
        )?.[1];

        addTeam(
          teamLink.attr("href") || logoLink.attr("href"),
          $(card).find(".first_name").first().text(),
          backgroundImage,
        );
      });

      // Formato antigo: tabela. A equipa está sempre na primeira coluna; os
      // restantes links são "Plantel", "Histórico", etc. e não são equipas novas.
      $("table.zztable.zzlist tbody tr").each((_, row) => {
        const teamLink = $(row)
          .find("td")
          .first()
          .find("a[href*='/equipa/']")
          .first();
        addTeam(teamLink.attr("href"), teamLink.text());
      });

      // Compatibilidade com o formato DataTables que algumas páginas antigas usam.
      if (compTeams.length === 0) {
        $("#DataTables_Table_0 tbody tr").each((_, row) => {
          const teamLink = $(row).find("a[href*='/equipa/']").first();
          const logoImg = $(row).find("img").first();
          addTeam(
            teamLink.attr("href"),
            teamLink.text() || logoImg.attr("alt"),
            logoImg.attr("src") || logoImg.attr("data-src"),
          );
        });
      }

      allTeams.push(...compTeams);
      console.log(`✅ ${compTeams.length} equipas extraídas de ${comp.url}`);
    } catch (error) {
      console.error(`❌ Erro ao processar ${comp.url}:`, error);
    } finally {
      await page.close(); // fecha sempre a page, sucesso ou erro
    }
  }

  const uniqueTeams = allTeams.filter(
    (team, index, self) =>
      index === self.findIndex((t) => t.externalId === team.externalId),
  );

  console.log(`\n📊 Total de equipas únicas: ${uniqueTeams.length}`);

  if (uniqueTeams.length > 0 && options.persist !== false) {
    await saveAllTeams(uniqueTeams);
  }

  return uniqueTeams;
}

export async function saveAllTeams(teams: ScrapedTeam[]) {
  for (const team of teams) {
    const existingByExternalId = await Team.findOne({
      where: { externalId: team.externalId },
    });

    // Reaproveita um registo anterior à migração quando ainda não tem ID. Só
    // o fazemos quando há exactamente um candidato, pois o mesmo nome pode
    // existir em vários escalões.
    const legacyMatches = existingByExternalId
      ? []
      : await Team.findAll({ where: { name: team.name, externalId: null } });
    const existing = existingByExternalId ??
      (legacyMatches.length === 1 ? legacyMatches[0] : null);
    const logoUrl =
      team.logoUrl || existing?.logoUrl ||
      (team.profileUrl ? await fetchTeamLogo(team.profileUrl) : undefined);

    if (existing) {
      const updates: Partial<Team> = {
        name: team.name,
        abbreviation: team.abbreviation,
        externalId: team.externalId,
      };

      // O formato em tabela do ZeroZero não inclui o emblema da equipa. Não
      // podemos substituir um logo já guardado por undefined só porque esta
      // fonte não o disponibiliza.
      if (logoUrl) updates.logoUrl = logoUrl;

      await existing.update(updates);
    } else {
      await Team.create({
        externalId: team.externalId,
        name: team.name,
        abbreviation: team.abbreviation,
        logoUrl,
      });
    }
  }
  await cache.del(CacheKeys.teams.all);
  console.log(`✅ ${teams.length} equipas guardadas/atualizadas na BD`);
}
