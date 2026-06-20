export const CacheKeys = {
  season: {
    all: "app:seasons:all",
    current: "app:season:current",
    byId: (seasonId: number) => `app:season:${seasonId}`,
    byCategory: (category: string) => `app:seasons:category:${category}`,
  },

  competitions: {
    all: "app:competitions:all",
    bySeason: (seasonId: number) => `app:competitions:season:${seasonId}`,
  },

  matches: {
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:matches:season:${seasonId}:${category}`,
    summaryBySeason: (seasonId: number, category: string = "over19") =>
      `app:matches:summary:${seasonId}:${category}`,
    byId: (matchId: number) => `app:match:${matchId}`,
    byCompetition: (competitionId: number) =>
      `app:matches:competition:${competitionId}`,
  },

  players: {
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:players:season:${seasonId}:${category}`,
    adminBySeason: (seasonId: number, category: string = "over19") =>
      `app:players:season:${seasonId}:${category}:admin`,
    allStatsByPlayer: (playerId: number) =>
      `app:player:${playerId}:allstats`,
  },

  stats: {
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:stats:season:${seasonId}:${category}`,
  },

  standings: {
    all: "app:standings:all",
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:standings:season:${seasonId}:${category}`,
  },

  squad: {
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:squad:season:${seasonId}:${category}`,
  },

  news: {
    last10: "app:news:last10",
    all: "app:news:all",
  },

  categories: {
    enabled: "app:categories:enabled",
  },

  teams: {
    all: "app:teams:all",
  },

  devices: {
    all: "devices:all",
    goals: (category: string) => `devices:goals:${category}`,
    matchday: (category: string) => `devices:matchday:${category}`,
    results: (category: string) => `devices:results:${category}`,
    news: "devices:news",
  },
};
