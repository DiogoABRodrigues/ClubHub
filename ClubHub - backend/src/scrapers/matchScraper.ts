// src/scrapers/matchScraper.ts
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { teamConfig } from "../config/teamConfig";
import Match from "../models/Match";
import Competition from "../models/Competition";

export interface ScrapedMatch {
  date: string;
  time: string;
  homeOrAway: 'C' | 'F';
  opponent: string;
  result: string | null;
  competition: string;
  round: string;
  outcome: 'V' | 'E' | 'D' | null;
}

// Função auxiliar para extrair nome e época da competição
function parseCompetition(competitionStr: string): { name: string; season: string } {
  // Formato esperado: "AF Viana do Castelo 2ª Divisão 25/26" ou "AF Viana do Castelo Taça 25/26"
  const match = competitionStr.match(/(.+?)\s+(\d{2}\/\d{2})$/);
  
  if (match) {
    return {
      name: match[1].trim(),
      season: match[2]
    };
  }
  
  // Fallback: tentar extrair de forma mais genérica
  const seasonMatch = competitionStr.match(/(\d{2}\/\d{2})$/);
  if (seasonMatch) {
    return {
      name: competitionStr.replace(seasonMatch[0], "").trim(),
      season: seasonMatch[1]
    };
  }
  
  // Último recurso
  return {
    name: competitionStr,
    season: "2025/26" // época padrão
  };
}

// Função para obter ou criar competição
async function getOrCreateCompetition(competitionStr: string): Promise<Competition> {
  const { name, season } = parseCompetition(competitionStr);
  
  // Verificar se já existe
  let competition = await Competition.findOne({
    where: { name, season }
  });
  
  // Se não existir, criar
  if (!competition) {
    console.log(`   🆕 Nova competição: ${name} (${season})`);
    competition = await Competition.create({
      name,
      season
    });
  } else {
    console.log(`   ✅ Competição existente: ${name} (${season})`);
  }
  
  return competition;
}

export async function saveMatches(teamName: string, scrapedMatches: ScrapedMatch[]) {
  for (const match of scrapedMatches) {
    // Obter ou criar competição
    let competitionId: number | null = null;
    if (match.competition) {
      const competition = await getOrCreateCompetition(match.competition);
      competitionId = competition.id;
    }
 
    // Criar ou atualizar a match
    await Match.upsert({
      teamName,
      date: match.date,           // atualiza a data se mudou
      time: match.time,       // atualiza a hora se mudou 
      homeOrAway: match.homeOrAway,
      opponent: match.opponent,
      result: match.result,       // atualiza o resultado se mudou
      competitionId,             // id da competição
      round: match.round,
      outcome: match.outcome, 
      status: match.result ? 'played' : 'scheduled' // status baseado na presença de resultado
    });

  console.log(`✅ ${scrapedMatches.length} jogos guardados/atualizados para a equipa ${teamName}`);
}
}

export async function scrapeTeamMatches() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  console.log(`🌐 A aceder a: ${teamConfig.matches_url}`);
  await page.goto(teamConfig.matches_url, { waitUntil: "networkidle2", timeout: 30000 });

  // Aceitar cookies
  try {
    await page.waitForSelector("button", { timeout: 5000 });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const acceptBtn = buttons.find(btn =>
        btn.textContent?.includes("Aceitar") || btn.textContent?.includes("Aceitar todos")
      );
      if (acceptBtn) (acceptBtn as HTMLElement).click();
    });
  } catch {}

  // Aguardar pela tabela de jogos
  await page.waitForSelector("#team_games table", { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const matches: ScrapedMatch[] = [];

  // Procurar todas as linhas de jogos (tr com class="parent")
  $("tr.parent").each((_, row) => {
    const cells = $(row).find("td");
    
    if (cells.length < 9) return;
    
    // 1. Outcome (V/E/D)
    let outcome: 'V' | 'E' | 'D' | null = null;
    const formCell = $(cells[0]).find(".form .sign");
    if (formCell.length) {
      const formClass = formCell.attr("class") || "";
      if (formClass.includes("win")) outcome = 'V';
      else if (formClass.includes("draw")) outcome = 'E';
      else if (formClass.includes("lost")) outcome = 'D';
    }
    
    // 2. Data
    const date = $(cells[1]).text().trim();
    
    // 3. Hora
    const time = $(cells[2]).text().trim();
    
    // 4. Local
    let homeOrAway: 'C' | 'F' = 'C';
    const locationText = $(cells[3]).text().trim();
    if (locationText === "(F)") homeOrAway = 'F';
    else if (locationText === "(C)") homeOrAway = 'C';
    
    // 5. Adversário
    let opponent = "";
    const opponentLink = $(cells[5]).find("a");
    if (opponentLink.length) {
      opponent = opponentLink.text().trim();
    } else {
      opponent = $(cells[5]).text().trim();
    }
    opponent = opponent.replace(/\s+B$/, "").trim();
    
    // 6. Resultado
    let result: string | null = null;
    const resultText = $(cells[6]).text().trim();
    if (resultText && resultText !== "-" && resultText !== "") {
      result = resultText;
    }
    
    // 7. Competição
    let competition = "";
    const compLink = $(cells[7]).find("a");
    if (compLink.length) {
      competition = compLink.text().trim();
    } else {
      competition = $(cells[7]).text().trim();
    }
    
    // 8. Jornada
    let round = $(cells[8]).text().trim();
    if (!round) {
      const roundMatch = competition.match(/(J\d+|1\/\d+|Taça)/i);
      if (roundMatch) round = roundMatch[1];
    }
    
    // Validar dados
    if (!date || !opponent) return;
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) return;
    
    matches.push({
      date,
      time,
      homeOrAway,
      opponent,
      result,
      competition,
      round,
      outcome
    });
  });

  // Remover duplicados
  const uniqueMatches = matches.filter((match, index, self) => 
    index === self.findIndex(m => m.date === match.date && m.opponent === match.opponent)
  );
  
  // Ordenar por data
  uniqueMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`\n📊 Resumo da extração:`);
  console.log(`✅ Total de jogos encontrados: ${uniqueMatches.length}`);
  
  if (uniqueMatches.length > 0) {
    const uniqueComps = new Set(uniqueMatches.map(m => m.competition));
    console.log(`🏆 Competições detectadas: ${Array.from(uniqueComps).join(", ")}`);
  }

  return uniqueMatches;
}

