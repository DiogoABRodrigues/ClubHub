export type News = {
  id: number;
  title: string;
  category: 'Team' | 'Transfers' | 'Events';
  excerpt?: string;
  content: string;
  image?: string;
  publishedAt: string;
};