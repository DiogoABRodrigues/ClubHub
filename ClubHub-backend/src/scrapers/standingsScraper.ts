import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { teamConfig } from "../config/teamConfig";
import Team from "../models/Team";
import Standing from "../models/Standing";
import Season from "../models/Season";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";

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

export async function scrapeStandings(): Promise<StandingRow[]> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });
  } catch (err) {
    console.error("🔥 ERRO AO ABRIR BROWSER:", err);
    return [];
  }

  const page = await browser.newPage();

  // Configurar timeout maior
  page.setDefaultTimeout(60000);

  // Adicionar user agent realista
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  console.log(`🌐 Acessando: ${teamConfig.standings_url}`);

  try {
    // Tentar diferentes estratégias de waitUntil
    await page.goto(teamConfig.standings_url, {
      waitUntil: "domcontentloaded", // Mais rápido que networkidle2
      timeout: 60000,
    });

    // Aceitar cookies com um seletor mais abrangente
    try {
      const cookieButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const acceptBtn = buttons.find(
          (btn) =>
            btn.textContent?.includes("Aceitar") ||
            btn.textContent?.includes("Aceitar todos") ||
            btn.textContent?.includes("Accept") ||
            btn.textContent?.includes("Allow"),
        );
        if (acceptBtn) {
          (acceptBtn as HTMLElement).click();
          return true;
        }
        return false;
      });
      if (cookieButton) {
        console.log("🍪 Cookie aceito");
      }
    } catch (error) {
      console.log("⚠️ Nenhum cookie banner encontrado");
    }

    // Esperar por qualquer tabela, não apenas com ID específico
    try {
      await page.waitForSelector("table", { timeout: 30000 });
      console.log("✅ Tabela encontrada");
    } catch (error) {
      console.log("❌ Tabela não encontrada. Tentando alternativas...");

      // Salvar HTML para debug
      const html = await page.content();
      const fs = require("fs");
      fs.writeFileSync("debug-page.html", html);
      console.log("📁 HTML salvo em debug-page.html para análise");

      throw new Error("Tabela não encontrada na página");
    }

    // Verificar se há iframes ou elementos dinâmicos
    const hasIframes = await page.evaluate(
      () => document.querySelectorAll("iframe").length,
    );
    if (hasIframes > 0) {
      console.log(`⚠️ Encontrados ${hasIframes} iframes na página`);
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    const standings: StandingRow[] = [];

    // Tentar diferentes seletores para encontrar a tabela
    let tableRows: any[] = [];

    // Tentativa 1: Tabela com ID específico
    tableRows = $("table#DataTables_Table_0 tbody tr").toArray();

    // Tentativa 2: Qualquer tabela com classificação
    if (tableRows.length === 0) {
      console.log("Tentando seletor alternativo: table tbody tr");
      tableRows = $("table tbody tr").toArray();
    }

    // Tentativa 3: Qualquer linha de tabela
    if (tableRows.length === 0) {
      console.log("Tentando seletor alternativo: table tr");
      tableRows = $("table tr").toArray();
    }

    if (tableRows.length === 0) {
      console.log("⚠️ Nenhuma linha de tabela encontrada");

      // Listar todas as tabelas para debug
      const tableCount = $("table").length;
      console.log(`📊 Número de tabelas encontradas: ${tableCount}`);

      if (tableCount > 0) {
        $("table").each((i, table) => {
          console.log(`Tabela ${i + 1}: ${$(table).find("tr").length} linhas`);
          console.log(`Classes: ${$(table).attr("class")}`);
          console.log(`ID: ${$(table).attr("id")}`);
        });
      }
    }

    // Processar cada linha
    for (const row of tableRows) {
      const $row = $(row);
      const cells = $row.find("td");

      if (cells.length < 10) {
        console.log(`Linha ignorada: apenas ${cells.length} colunas`);
        continue;
      }

      // Tentar identificar qual coluna contém o nome da equipe
      let teamNameCellIndex = 1; // Assumindo que a posição é coluna 0

      // Verificar se a primeira coluna é a posição
      const firstCellText = $(cells[0]).text().trim();
      const position = parseInt(firstCellText);

      if (isNaN(position)) {
        // Se a primeira coluna não é número, talvez a estrutura seja diferente
        continue;
      }

      // Encontrar o link da equipe
      let teamLink = null;
      let teamName = "";
      let teamUrl = undefined;

      // Procurar em todas as colunas por um link que parece nome de equipe
      for (let i = 0; i < cells.length; i++) {
        const link = $(cells[i]).find("a");
        if (link.length > 0) {
          const text = link.text().trim();
          if (text.length > 2 && !text.match(/^\d+$/)) {
            teamLink = link;
            teamName = text;
            teamNameCellIndex = i;
            break;
          }
        }
      }

      // Se não encontrou link, pegar texto da coluna do meio
      if (!teamName && cells.length > 2) {
        teamName = $(cells[2]).text().trim();
      }

      if (!teamName) {
        console.log("Nome da equipe não encontrado na linha");
        continue;
      }

      // Construir URL da equipe
      if (teamLink) {
        const href = teamLink.attr("href");
        teamUrl = href
          ? href.startsWith("http")
            ? href
            : "https://www.zerozero.pt" + href
          : undefined;
      }

      // Extrair estatísticas baseado na estrutura real
      // Ajuste os índices conforme necessário
      const points =
        parseInt(
          $(cells[teamNameCellIndex + 1])
            .text()
            .trim(),
        ) || 0;
      const matchesPlayed =
        parseInt(
          $(cells[teamNameCellIndex + 2])
            .text()
            .trim(),
        ) || 0;
      const wins =
        parseInt(
          $(cells[teamNameCellIndex + 3])
            .text()
            .trim(),
        ) || 0;
      const draws =
        parseInt(
          $(cells[teamNameCellIndex + 4])
            .text()
            .trim(),
        ) || 0;
      const losses =
        parseInt(
          $(cells[teamNameCellIndex + 5])
            .text()
            .trim(),
        ) || 0;
      const goalsFor =
        parseInt(
          $(cells[teamNameCellIndex + 6])
            .text()
            .trim(),
        ) || 0;
      const goalsAgainst =
        parseInt(
          $(cells[teamNameCellIndex + 7])
            .text()
            .trim(),
        ) || 0;

      let goalDifference = 0;
      if (cells.length > teamNameCellIndex + 8) {
        const gdText = $(cells[teamNameCellIndex + 8])
          .text()
          .trim();
        goalDifference =
          parseInt(gdText.replace(/[^0-9-]/g, "")) || goalsFor - goalsAgainst;
      } else {
        goalDifference = goalsFor - goalsAgainst;
      }

      standings.push({
        position,
        teamName,
        teamUrl,
        points,
        matchesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
      });
    }

    console.log(`✅ ${standings.length} equipas extraídas`);

    if (standings.length === 0) {
      console.log(
        "⚠️ Nenhum dado foi extraído. Verifique o arquivo debug-page.html",
      );
    }

    const seasonYear = teamConfig.currentSeason;
    const season = await getOrCreateSeason(seasonYear);

    if (standings.length > 0) {
      await saveStandings(standings, 1, season.id);
    }
    return standings;
  } catch (error) {
    console.error("❌ Erro durante o scraping:", error);

    // Salvar screenshot para debug
    try {
      await page.screenshot({ path: "error-screenshot.png" });
      console.log("📸 Screenshot salvo como error-screenshot.png");
    } catch (screenshotError) {
      console.log("Não foi possível salvar screenshot");
    }

    throw error;
  } finally {
    await browser.close();
  }
}

export async function saveStandings(
  standings: StandingRow[],
  competitionId: number,
  seasonId: number, // 🔹 novo parâmetro
) {
  const data = [];

  for (const row of standings) {
    let team = await Team.findOne({
      where: { name: row.teamName },
    });

    if (!team) {
      team = await Team.create({
        name: row.teamName,
        externalUrl: row.teamUrl,
      });
    }

    data.push({
      teamName: team.name,
      competitionId,
      seasonId, // 🔹 associar season
      position: row.position,
      points: row.points,
      played: row.matchesPlayed,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff: row.goalDifference,
    });
  }

  // Limpa antes (opcional mas recomendado)
  await Standing.destroy({
    where: {
      competitionId,
      seasonId, // 🔹 garantir que só apaga desta época
    },
  });

  await Standing.bulkCreate(data);
  await cache.del("standings:current");

  console.log(
    `✅ Standings guardadas para a competição ${competitionId} e season ${seasonId}`,
  );
}
