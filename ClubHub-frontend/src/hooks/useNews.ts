import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import { NewsService } from "../services/NewsService";
import { News } from "../models/News";
import { teamConfig } from "../config/teamConfig";

export const useNews = () => {
  const queryClient = useQueryClient();

  // ─────────────────────────────
  // GET NEWS
  // ─────────────────────────────
  const newsQuery = useQuery({
    queryKey: ["news"],
    queryFn: NewsService.getLast10,
    staleTime: Infinity,
    select: (data: News[]) => data,
  });

  // ─────────────────────────────
  // DELETE
  // ─────────────────────────────
  const deleteNews = useMutation({
    mutationFn: (id: number) => NewsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<News[]>(["news"], (old) =>
        old?.filter((n) => n.id !== id),
      );
    },
  });

  // ─────────────────────────────
  // CREATE
  // ─────────────────────────────
  const createNews = useMutation({
    mutationFn: ({
      news,
      imageUri,
    }: {
      news: Partial<News>;
      imageUri?: string;
    }) => NewsService.create(news as News, imageUri),

    onSuccess: (newNews) => {
      queryClient.setQueryData<News[]>(["news"], (old) => [
        newNews,
        ...(old ?? []),
      ]);
    },
  });

  // ─────────────────────────────
  // UPDATE
  // ─────────────────────────────
  const updateNews = useMutation({
    mutationFn: ({
      id,
      news,
      imageUri,
    }: {
      id: number;
      news: Partial<News>;
      imageUri?: string;
    }) => NewsService.update(id, news as News, imageUri),

    onSuccess: (updatedNews) => {
      queryClient.setQueryData<News[]>(["news"], (old) =>
        old?.map((n) => (n.id === updatedNews.id ? updatedNews : n)),
      );
    },
  });

  return {
    news: newsQuery.data ?? [],
    loading: newsQuery.isLoading,
    refreshNews: () => queryClient.invalidateQueries({ queryKey: ["news"] }),

    deleteNews: deleteNews.mutateAsync,
    createNews: createNews.mutateAsync,
    updateNews: updateNews.mutateAsync,
  };
};
