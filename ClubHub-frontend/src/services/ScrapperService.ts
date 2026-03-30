import { scrapperApi } from "./api";

export const ScrapperService = {
  scrapAll: async (): Promise<void> => {
    await scrapperApi.post("/scrape/allInfo");
  }
};
