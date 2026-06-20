import { api, publicApi } from "./api";
import { News } from "../models/News";

export type PaginatedNews = {
  items: News[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
};

export const NewsService = {
  getPage: async (page = 1, limit = 10): Promise<PaginatedNews> => {
    const { data } = await publicApi.get("/news", {
      params: { page, limit },
    });
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
