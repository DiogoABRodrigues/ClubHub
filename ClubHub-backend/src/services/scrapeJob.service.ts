import { randomUUID } from "node:crypto";
import { redis } from "../config/redis";
import { closeSharedBrowser } from "../utils/browser";
import { discoverTeamCategories, getCompetitionUrlsFromMatches } from "../scrapers/teamDiscoveryScraper";
import { scrapeTeamMatches } from "../scrapers/matchScraper";
import { scrapeStandings } from "../scrapers/standingsScraper";
import { scrapeTeamPlayers } from "../scrapers/playersScraper";
import { scrapeTeamStats } from "../scrapers/statsScraper";
import { scrapeAllTeams } from "../scrapers/allTeamsScraper";
import socketService from "./socket.service";

export type ScrapeJobStatus = "queued" | "running" | "completed" | "failed";
export interface ScrapeJob {
  id: string; status: ScrapeJobStatus; scope: "all" | string;
  startedAt: string | null; completedAt: string | null; currentStep: string;
  results: Record<string, unknown> | null; error: string | null;
}

const TTL = 60 * 60 * 24;
const currentKey = "scrape:job:current";
const key = (id: string) => `scrape:job:${id}`;

class ScrapeJobService {
  async start(scope: "all" | string = "all"): Promise<ScrapeJob> {
    const currentId = await redis.get(currentKey);
    const current = currentId ? await this.get(currentId) : null;
    if (current && ["queued", "running"].includes(current.status)) return current;

    const job: ScrapeJob = {
      id: randomUUID(), status: "queued", scope, startedAt: null, completedAt: null,
      currentStep: "Na fila", results: null, error: null,
    };
    await this.save(job);
    await redis.set(currentKey, job.id, { EX: TTL });
    setImmediate(() => void this.run(job.id));
    return job;
  }

  async get(id: string): Promise<ScrapeJob | null> {
    const value = await redis.get(key(id));
    return value ? JSON.parse(value) as ScrapeJob : null;
  }

  private async save(job: ScrapeJob) {
    await redis.set(key(job.id), JSON.stringify(job), { EX: TTL });
    socketService.emitScrapeJobUpdate(job);
  }

  private async update(job: ScrapeJob, changes: Partial<ScrapeJob>) {
    Object.assign(job, changes);
    await this.save(job);
  }

  private async run(id: string) {
    const job = await this.get(id);
    if (!job) return;
    try {
      await this.update(job, { status: "running", startedAt: new Date().toISOString(), currentStep: "A descobrir escalões" });
      const categories = await discoverTeamCategories();
      const selected = job.scope === "all" ? categories : categories.filter((c) => c.category === job.scope);
      if (!selected.length) throw new Error("Escalão não encontrado no ZeroZero.");

      const results: Record<string, unknown> = {};
      const competitionUrls = new Set<string>();
      for (const cfg of selected) {
        await this.update(job, { currentStep: `A atualizar ${cfg.label}: jogos` });
        const matches = await scrapeTeamMatches(cfg);
        const urls = getCompetitionUrlsFromMatches(matches);
        urls.forEach((url) => competitionUrls.add(url));
        let standings = 0;
        for (const standingsUrl of urls) {
          await this.update(job, { currentStep: `A atualizar ${cfg.label}: classificações` });
          try { standings += (await scrapeStandings({ ...cfg, standings_url: standingsUrl })).length; }
          catch (error) { console.warn(`Classificação indisponível em ${standingsUrl}:`, error); }
        }
        await this.update(job, { currentStep: `A atualizar ${cfg.label}: plantel` });
        const players = await scrapeTeamPlayers(cfg);
        await this.update(job, { currentStep: `A atualizar ${cfg.label}: estatísticas` });
        const stats = await scrapeTeamStats(cfg);
        results[cfg.category] = { matches: matches.length, standings, players: players.length, stats: stats.length };
      }
      if (job.scope === "all") {
        await this.update(job, { currentStep: "A atualizar equipas das competições" });
        results.totalTeams = (await scrapeAllTeams([...competitionUrls])).length;
      }
      socketService.emitDataUpdated();
      await this.update(job, { status: "completed", completedAt: new Date().toISOString(), currentStep: "Concluído", results });
    } catch (error) {
      console.error("Job de scrape falhou:", error);
      await this.update(job, { status: "failed", completedAt: new Date().toISOString(), currentStep: "Falhou", error: error instanceof Error ? error.message : String(error) });
    } finally {
      await closeSharedBrowser();
    }
  }
}

export default new ScrapeJobService();
