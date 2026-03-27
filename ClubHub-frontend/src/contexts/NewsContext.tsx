import React, { createContext, useState, useEffect, useContext } from "react";
import { News } from "../models/News";
import { NewsService } from "../services/NewsService";
import { Platform } from "react-native";

interface NewsContextType {
  news: News[];
  loading: boolean;
  refreshNews: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType>({
  news: [],
  loading: true,
  refreshNews: async () => {},
});

const formatNewsImage = (image?: string) => {
  if (!image) return undefined;

  const baseUrl =
    Platform.OS === "android"
      ? "http://192.168.1.105:3000/uploads"
      : "http://192.168.1.105:3000/uploads";

  return `${baseUrl}/${image}`;
};

export const NewsProvider = ({ children }: any) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const dbNews = await NewsService.getLast10();

      // transforma o campo image para URL completa
      const formattedNews = dbNews.map((n) => ({
        ...n,
        image: formatNewsImage(n.image),
      }));

      setNews(formattedNews);
    } catch (err) {
      console.error("Erro a buscar news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading, refreshNews: fetchNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
