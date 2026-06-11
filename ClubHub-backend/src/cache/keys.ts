export const CacheKeys = {
  season: {
    current: "app:season:current",
  },

  competitions: {
    all: "app:competitions:all",
    bySeason: (seasonId: number) =>
      `app:competitions:season:${seasonId}`,
  },

  matches: {
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:matches:season:${seasonId}:${category}`,
  },

  players: {
    bySeason: (seasonId: number, category: string = "over19") =>
      `app:players:season:${seasonId}:${category}`,
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
  },
};