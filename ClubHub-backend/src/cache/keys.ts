export const CacheKeys = {
  season: {
    current: "app:season:current",
  },

  matches: {
    bySeason: (seasonId: number) => `app:matches:season:${seasonId}`,
  },

  players: {
    bySeason: (seasonId: number) => `app:players:season:${seasonId}`,
  },

  stats: {
    bySeason: (seasonId: number) => `app:stats:season:${seasonId}`,
  },

  standings: {
    bySeason: (seasonId: number) => `app:standings:season:${seasonId}`,
  },

  squad: {
    bySeason: (seasonId: number) => `app:squad:season:${seasonId}`,
  },

  news: {
    last10: "app:news:last10",
  },
};