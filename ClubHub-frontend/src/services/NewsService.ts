import { api } from "./api";
import { News } from "../models/News";

export const NewsService = {
  getAll: async (): Promise<News[]> => {
    const { data } = await api.get("/news");
    return data;
  },

  getLast10: async (): Promise<News[]> => {
    const { data } = await api.get("/news/last10");
    return data;
  },

  create: async (news: News, file?: File): Promise<News> => {
    const formData = new FormData();

    formData.append("title", news.title);
    formData.append("category", news.category);
    formData.append("content", news.content);

    if (news.excerpt) formData.append("excerpt", news.excerpt);
    if (file) formData.append("image", file);

    const { data } = await api.post("/news", formData);
    return data;
  },

  update: async (id: number, news: News, file?: File): Promise<News> => {
    const formData = new FormData();

    formData.append("title", news.title);
    formData.append("category", news.category);
    formData.append("content", news.content);

    if (news.excerpt) formData.append("excerpt", news.excerpt);
    if (file) formData.append("image", file);

    const { data } = await api.put(`/news/${id}`, formData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
  },
};