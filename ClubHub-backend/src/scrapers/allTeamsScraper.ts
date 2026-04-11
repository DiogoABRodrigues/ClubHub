import * as cheerio from "cheerio";
import Team from "../models/Team";
import { teamConfig } from "../config/teamConfig";
import { launchBrowser } from "../utils/browser";

export interface ScrapedTeam {
  name: string;
  abbreviation?: string;
  logoUrl?: string;
}

const competitions = [{ url: teamConfig.teams1 }, { url: teamConfig.teams2 }];
export async function scrapeAllTeams(): Promise<ScrapedTeam[]> {
const browser = await launchBrowser();


  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  const allTeams: ScrapedTeam[] = [];

  for (const comp of competitions) {
    try {
      await page.goto(comp.url, { waitUntil: "networkidle2", timeout: 30000 });

      // Aceitar cookies
      try {
        await page.waitForSelector("button", { timeout: 5000 });
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

      // Aguardar pela tabela de classificação
      await page.waitForSelector("table tbody tr, table tr", {
        timeout: 10000,
      });
      await new Promise((r) => setTimeout(r, 2000));

      const html = await page.content();
      const $ = cheerio.load(html);

      const compTeams: ScrapedTeam[] = [];

      // Método principal: linhas da tabela
      $("#DataTables_Table_0 tbody tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 3) return;

        const firstCellText = $(cells[0]).text().trim();
        const isRankRow = /^\d+$/.test(firstCellText);
        if (!isRankRow) return;

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

        if (!teamName && cells.length >= 2) {
          const altLink = $(cells[1]).find("a");
          if (altLink.length && altLink.text().trim().length > 2) {
            teamName = altLink.text().trim();
          }
        }

        if (teamName && teamName.length > 2) {
          if (!compTeams.some((t) => t.name === teamName)) {
            compTeams.push({
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
    }
  }

  await browser.close();

  // Remover duplicados globais por nome
  const uniqueTeams = allTeams.filter(
    (team, index, self) =>
      index === self.findIndex((t) => t.name === team.name),
  );

  console.log(`\n📊 Total de equipas únicas: ${uniqueTeams.length}`);

  if (uniqueTeams.length > 0) {
    saveAllTeams(uniqueTeams);
  }

  return uniqueTeams;
}

// Guardar/atualizar equipas na BD
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
