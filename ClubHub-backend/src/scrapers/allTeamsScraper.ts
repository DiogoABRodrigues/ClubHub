import * as cheerio from "cheerio";
import Team from "../models/Team";
import { teamConfig } from "../config/teamConfig";
import { getSharedBrowser } from "../utils/browser";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

export interface ScrapedTeam {
  externalId: number;
  name: string;
  abbreviation?: string;
  logoUrl?: string;
}

const competitions = teamConfig.categories
  .filter((category) => category.enabled)
  .flatMap((category) => category.teams_urls)
  .filter((url, index, urls) => urls.indexOf(url) === index)
  .map((url) => ({ url }));

function extractTeamExternalId(href: string | undefined): number | null {
  if (!href) return null;
  const match = href.match(/\/equipa\/[^/]+\/(\d+)(?:[/?#]|$)/);
  return match ? Number(match[1]) : null;
}

export async function scrapeAllTeams(): Promise<ScrapedTeam[]> {
  const browser = await getSharedBrowser();
  const allTeams: ScrapedTeam[] = [];

  for (const comp of competitions) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      );

      await page.goto(comp.url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });

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

      // Aguardar pela tabela
      await page.waitForSelector("table tbody tr", { timeout: 30000 });

      const html = await page.content();
      const $ = cheerio.load(html);
      const compTeams: ScrapedTeam[] = [];

      $("#DataTables_Table_0 tbody tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 3) return;

        const firstCellText = $(cells[0]).text().trim();
        if (!/^\d+$/.test(firstCellText)) return;

        let logoUrl: string | null = null;
        const logoImg = $(cells[1]).find("img");
        if (logoImg.length) {
          logoUrl = logoImg.attr("src") || logoImg.attr("data-src") || null;
          if (logoUrl && !logoUrl.startsWith("http")) {
            logoUrl = "https://www.zerozero.pt" + logoUrl;
          }
        }

        let teamName = "";
        let teamExternalId: number | null = null;
        const nameLink = $(cells[2]).find("a[href*='/equipa/']").first();
        if (nameLink.length) teamName = nameLink.text().trim();
        teamExternalId = extractTeamExternalId(nameLink.attr("href"));

        if (!teamName || !teamExternalId) {
          const altLink = $(cells[1]).find("a[href*='/equipa/']").first();
          if (!teamName && altLink.length && altLink.text().trim().length > 2) {
            teamName = altLink.text().trim();
          }
          teamExternalId ??= extractTeamExternalId(altLink.attr("href"));
        }

        if (teamName && teamName.length > 2 && teamExternalId) {
          if (!compTeams.some((t) => t.externalId === teamExternalId)) {
            compTeams.push({
              externalId: teamExternalId,
              name: teamName,
              logoUrl: logoUrl || undefined,
            });
          }
        }
      });

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

  if (uniqueTeams.length > 0) {
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

    if (existing) {
      await existing.update({
        name: team.name,
        abbreviation: team.abbreviation,
        logoUrl: team.logoUrl,
        externalId: team.externalId,
      });
    } else {
      await Team.create({
        externalId: team.externalId,
        name: team.name,
        abbreviation: team.abbreviation,
        logoUrl: team.logoUrl,
      });
    }
  }
  await cache.del(CacheKeys.teams.all);
  console.log(`✅ ${teams.length} equipas guardadas/atualizadas na BD`);
}
