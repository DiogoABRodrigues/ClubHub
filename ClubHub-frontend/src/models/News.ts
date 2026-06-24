export type News = {
  id: number;
  title: string;
  category: "Team" | "Transfers" | "Events";
  content: string;
  image?: string;
  createdAt: string;
};
