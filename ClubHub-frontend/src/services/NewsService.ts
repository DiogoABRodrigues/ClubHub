import { api } from "./api";
import { News } from "../models/News";
import { File } from "expo-file-system";

export const NewsService = {
  getAll: async (): Promise<News[]> => {
    const { data } = await api.get("/news");
    return data;
  },

  getLast10: async (): Promise<News[]> => {
    const { data } = await api.get("/news/last10");
    return data;
  },

  create: async (news: News, imageUri?: string): Promise<News> => {
    try {
      const formData = new FormData();

      formData.append("title", news.title);
      formData.append("category", news.category);
      formData.append("content", news.content);

      if (news.excerpt) {
        formData.append("excerpt", news.excerpt);
      }

      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          name: "news-image.jpg",
          type: "image/jpeg",
        } as any);
      }

      const { data } = await api.post("/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      console.error("Erro no create:", error);
      throw error;
    }
  },

  update: async (id: number, news: News, imageUri?: string): Promise<News> => {
    try {
      const formData = new FormData();

      formData.append("title", news.title);
      formData.append("category", news.category);
      formData.append("content", news.content);

      if (news.excerpt) {
        formData.append("excerpt", news.excerpt);
      }

      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          name: "news-image.jpg",
          type: "image/jpeg",
        } as any);
      }

      const { data } = await api.put(`/news/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      console.error("Erro no update:", error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
  },
};
