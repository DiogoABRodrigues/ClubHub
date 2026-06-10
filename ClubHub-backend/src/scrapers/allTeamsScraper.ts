import * as cheerio from "cheerio";
import Team from "../models/Team";
import { teamConfig } from "../config/teamConfig";
import { getSharedBrowser } from "../utils/browser";

export interface ScrapedTeam {
  name: string;
  abbreviation?: string;
  logoUrl?: string;
}

// Usa as URLs de equipas do escalão over19
const over19Config = teamConfig.categories.find((c) => c.category === "over19");
const competitions = (over19Config?.teams_urls ?? []).map((url) => ({ url }));

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
        const nameLink = $(cells[2]).find("a");
        if (nameLink.length) teamName = nameLink.text().trim();

        if (!teamName) {
          const altLink = $(cells[1]).find("a");
          if (altLink.length && altLink.text().trim().length > 2) {
            teamName = altLink.text().trim();
          }
        }

        if (teamName && teamName.length > 2) {
          if (!compTeams.some((t) => t.name === teamName)) {
            compTeams.push({ name: teamName, logoUrl: logoUrl || undefined });
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
      index === self.findIndex((t) => t.name === team.name),
  );

  console.log(`\n📊 Total de equipas únicas: ${uniqueTeams.length}`);

  if (uniqueTeams.length > 0) {
    await saveAllTeams(uniqueTeams);
  }

  return uniqueTeams;
}

export async function saveAllTeams(teams: ScrapedTeam[]) {
  for (const team of teams) {
    await Team.upsert({
      name: team.name,
      abbreviation: team.abbreviation,
      logoUrl: team.logoUrl,
    });
  }
  console.log(`✅ ${teams.length} equipas guardadas/atualizadas na BD`);
}