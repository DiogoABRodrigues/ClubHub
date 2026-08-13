import { scrapperApi } from "./api";

export type ScrapeJob = {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  currentStep: string;
  error: string | null;
};

export const ScrapperService = {
  scrapAll: async (): Promise<ScrapeJob> => {
    const { data } = await scrapperApi.post<ScrapeJob>("/scrape/allInfo");
    return data;
  },
  getJob: async (id: string): Promise<ScrapeJob> => {
    const { data } = await scrapperApi.get<ScrapeJob>(`/scrape/jobs/${id}`);
    return data;
  },
};
