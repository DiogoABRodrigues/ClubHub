import React, { createContext, useState, useEffect, useContext } from "react";
import { News } from "../models/News";
import { NewsService } from "../services/NewsService";
import { Platform } from "react-native";

interface NewsContextType {
  news: News[];
  loading: boolean;
  refreshNews: () => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  createNews: (news: Partial<News>, imageUri?: string) => Promise<void>;
  updateNews: (
    id: number,
    news: Partial<News>,
    imageUri?: string,
  ) => Promise<void>;
}

const NewsContext = createContext<NewsContextType>({
  news: [],
  loading: true,
  refreshNews: async () => {},
  deleteNews: async () => {},
  createNews: async () => {},
  updateNews: async () => {},
});

const formatNewsImage = (image?: string) => {
  if (!image) return undefined;

  const baseUrl =
    Platform.OS === "android"
      ? "http://192.168.1.107:3000/uploads"
      : "http://192.168.1.107:3000/uploads";

  return `${baseUrl}/${image}`;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const dbNews = await NewsService.getLast10();
      const formattedNews = dbNews.map((n) => ({
        ...n,
        image: formatNewsImage(n.image),
      }));
      setNews(formattedNews);
    } catch (err) {
      console.error("Erro a buscar notícias:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: number) => {
    try {
      await NewsService.delete(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Erro ao deletar notícia:", err);
      throw err;
    }
  };

  const createNews = async (newsData: Partial<News>, imageUri?: string) => {
    try {
      const newNews = await NewsService.create(newsData as News, imageUri);
      setNews((prev) => [
        { ...newNews, image: formatNewsImage(newNews.image) },
        ...prev,
      ]);
    } catch (err) {
      console.error("Erro ao criar notícia:", err);
      throw err;
    }
  };

  const updateNews = async (
    id: number,
    newsData: Partial<News>,
    imageUri?: string,
  ) => {
    try {
      const updatedNews = await NewsService.update(
        id,
        newsData as News,
        imageUri,
      );
      setNews((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...updatedNews, image: formatNewsImage(updatedNews.image) }
            : n,
        ),
      );
    } catch (err) {
      console.error("Erro ao atualizar notícia:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider
      value={{
        news,
        loading,
        refreshNews: fetchNews,
        deleteNews,
        createNews,
        updateNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
