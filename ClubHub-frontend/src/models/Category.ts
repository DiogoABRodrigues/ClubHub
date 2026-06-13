export type Category = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

export interface CategoryConfig {
  category: Category;
  label: string;
  enabled: boolean;
  teamName: string;
  players_url: string;
  matches_url: string;
  standings_url: string;
  stats_url: string;
  teams_urls: string[];
}