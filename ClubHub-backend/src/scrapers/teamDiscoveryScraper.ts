import * as cheerio from "cheerio";
import {
  Category,
  CategoryConfig,
  getEnabledCategoryDefinitions,
  teamConfig,
} from "../config/teamConfig";
import { getSharedBrowser } from "../utils/browser";

const ZEROZERO_BASE_URL = "https://www.zerozero.pt";

function toAbsoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${ZEROZERO_BASE_URL}${url}`;
}

function categoryFromZeroZeroLabel(label: string): Category | null {
  const value = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/equipa\s+(principal|a)\b|seniores?/.test(value)) return "over19";
  if (/jun\.?\s*a\b|sub\s*-?\s*19\b/.test(value)) return "sub19";
  if (/jun\.?\s*b\b|sub\s*-?\s*17\b/.test(value)) return "sub17";
  if (/jun\.?\s*c\b|sub\s*-?\s*15\b/.test(value)) return "sub15";
  if (/jun\.?\s*d\b|sub\s*-?\s*13\b/.test(value)) return "sub13";
  return null;
}

function extractSlug(url: string): string {
  const match = new URL(url).pathname.match(/^\/equipa\/([^/]+)\/\d+/);
  if (!match) throw new Error(`URL de equipa ZeroZero inv\u00e1lido: ${url}`);
  return match[1];
}

function appendQuery(url: string, parameters: Record<string, string>): string {
  const parsed = new URL(url);
  Object.entries(parameters).forEach(([key, value]) =>
    parsed.searchParams.set(key, value),
  );
  return parsed.toString();
}

/**
 * Descobre os escal\u00f5es no seletor da p\u00e1gina principal do clube. N\u00e3o usa
 * IDs, links de jogos ou links de competi\u00e7\u00e3o definidos manualmente.
 */
export async function discoverTeamCategories(): Promise<CategoryConfig[]> {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.goto(teamConfig.primaryTeamUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForSelector("select[name='id'] option", { timeout: 20000 });

    const $ = cheerio.load(await page.content());
    const slug = extractSlug(teamConfig.primaryTeamUrl);
    const seasonId = $("select[name='epoca_id'] option[selected]").first().attr("value")
      ?? $("select[name='epoca_id'] option").first().attr("value");
    if (!seasonId || !/^\d+$/.test(seasonId)) {
      throw new Error("N\u00e3o foi poss\u00edvel identificar a \u00e9poca atual no ZeroZero.");
    }
    const definitions = new Map(
      getEnabledCategoryDefinitions().map((definition) => [definition.category, definition]),
    );
    const discovered = new Map<Category, CategoryConfig>();

    $("select[name='id'] option[value]").each((_, option) => {
      const id = Number($(option).attr("value"));
      const sourceLabel = $(option).text().replace(/\s+/g, " ").trim();
      const category = categoryFromZeroZeroLabel(sourceLabel);
      const definition = category ? definitions.get(category) : undefined;
      if (!Number.isInteger(id) || id <= 0 || !category || !definition) return;

      const teamUrl = `${ZEROZERO_BASE_URL}/equipa/${slug}/${id}`;
      discovered.set(category, {
        category,
        label: definition.label,
        enabled: true,
        teamName: teamConfig.name,
        teamExternalId: id,
        // O ZeroZero mostra dados hist\u00f3ricos sem estes par\u00e2metros.
        players_url: appendQuery(teamUrl, { epoca_id: seasonId }),
        matches_url: appendQuery(`${teamUrl}/jogos`, { epoca_id: seasonId }),
        // As competi\u00e7\u00f5es s\u00e3o obtidas da tabela de jogos durante a recolha.
        standings_url: "",
        stats_url: appendQuery(`${teamUrl}/jogadores`, {
          epoca_stats_id: seasonId,
          compet_id_jogos: "0",
          pais: "0",
          pos: "0",
        }),
        teams_urls: [],
      });
    });

    if (!discovered.size) {
      throw new Error("N\u00e3o foi encontrado nenhum escal\u00e3o reconhecido no seletor do ZeroZero.");
    }

    const categories = [...discovered.values()];
    console.log(
      `\u2705 Escal\u00f5es descobertos: ${categories.map((c) => `${c.label} (${c.teamExternalId})`).join(", ")}`,
    );
    return categories;
  } finally {
    await page.close();
  }
}

export function getCompetitionUrlsFromMatches(
  matches: Array<{ competitionUrl?: string | null }>,
): string[] {
  return [...new Set(matches.map((match) => match.competitionUrl).filter((url): url is string => !!url))]
    .map(toAbsoluteUrl);
}

/** Lê somente os links de competições na página de jogos; não grava dados. */
export async function discoverCompetitionUrlsForCategory(
  category: CategoryConfig,
): Promise<string[]> {
  const browser = await getSharedBrowser();
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.goto(category.matches_url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    // Alguns escalões sem jogos na época não apresentam tabela. Não é erro de
    // descoberta: devolvemos simplesmente uma lista vazia de competições.
    await page
      .waitForSelector("#team_games, a[href*='/edicao/']", { timeout: 10000 })
      .catch(() => {});

    const $ = cheerio.load(await page.content());
    const urls = new Set<string>();
    const games = $("#team_games");
    games.find("tr.parent").each((_, row) => {
      const href = $(row).find("td").eq(7).find("a").first().attr("href");
      if (href?.includes("/edicao/")) urls.add(toAbsoluteUrl(href));
    });
    // Compatibilidade com a variante de markup que não usa tr.parent.
    if (urls.size === 0) {
      games.find("a[href*='/edicao/']").each((_, link) => {
        const href = $(link).attr("href");
        if (href) urls.add(toAbsoluteUrl(href));
      });
    }
    return [...urls];
  } finally {
    await page.close();
  }
}
