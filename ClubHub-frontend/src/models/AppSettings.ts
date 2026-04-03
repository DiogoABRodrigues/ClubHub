export type AppSettingsKey =
  | "notifications_enabled"
  | "notifications_goals"
  | "notifications_matchday"
  | "notifications_news";

export interface AppSettings {
  id?: number;
  key: AppSettingsKey;
  value: string; // backend manda string ("true" / "false")
  createdAt?: string;
  updatedAt?: string;
}
