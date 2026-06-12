export type Category = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

export interface CategoryConfig {
  category: Category;
  label: string;
  enabled: boolean;
}

export const teamConfig = {
  name: "Adecas",
  instagram_URL: "https://www.instagram.com/adecasoficial/",
  backend_URL: "https://clubhub-c8u0.onrender.com",

  categories: [
    {
      category: "over19" as Category,
      label: "Seniores",
      enabled: true,
    },
    {
      category: "sub15" as Category,
      label: "Sub-15",
      enabled: true,
    },
  ] as CategoryConfig[],
};

export function getEnabledCategories(): CategoryConfig[] {
  return teamConfig.categories.filter((c) => c.enabled);
}