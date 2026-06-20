import { useCallback, useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { NewsService } from "../services/NewsService";
import { News } from "../models/News";

const NEWS_PAGE_SIZE = 10;

export const useNews = () => {
  const queryClient = useQueryClient();

  const newsQuery = useInfiniteQuery({
    queryKey: ["news"],
    queryFn: ({ pageParam }) =>
      NewsService.getPage(pageParam, NEWS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: Infinity,
  });

  const news = useMemo(
    () => newsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [newsQuery.data],
  );

  const refreshNews = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["news"] }),
    [queryClient],
  );

  const deleteNews = useMutation({
    mutationFn: (id: number) => NewsService.delete(id),
    onSuccess: refreshNews,
  });

  const createNews = useMutation({
    mutationFn: ({
      news,
      imageUri,
    }: {
      news: Partial<News>;
      imageUri?: string;
    }) => NewsService.create(news as News, imageUri),
    onSuccess: refreshNews,
  });

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
    onSuccess: refreshNews,
  });

  return {
    news,
    loading: newsQuery.isLoading,
    loadingMore: newsQuery.isFetchingNextPage,
    hasMore: newsQuery.hasNextPage,
    loadMore: newsQuery.fetchNextPage,
    refreshNews,
    deleteNews: deleteNews.mutateAsync,
    createNews: createNews.mutateAsync,
    updateNews: updateNews.mutateAsync,
  };
};
