import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { styles } from "./News.styles";
import { NewsCard } from "../../components/NewsCard";
import { EmptyState } from "../../components/EmptyState";
import { useNews } from "../../hooks/useNews";
import { COLORS } from "../../theme/colors";
import { News as NewsModel } from "../../models/News";

export const News = ({ navigation }: any) => {
  const { news, loading, loadingMore, hasMore, loadMore, refreshNews } =
    useNews();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshNews();
    } finally {
      setRefreshing(false);
    }
  }, [refreshNews]);

  const renderItem = useCallback(
    ({ item, index }: { item: NewsModel; index: number }) => (
      <NewsCard
        news={item}
        onPress={() => navigation.navigate("NewsDetail", { id: item.id })}
        featured={index === 0}
        isLast={!hasMore && index === news.length - 1}
      />
    ),
    [navigation, news.length, hasMore],
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) void loadMore();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Notícias</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="Não foi possível encontrar informação"
              message="Por favor tenta novamente mais tarde."
              onRetry={onRefresh}
              retryLabel="Atualizar"
            />
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={{ paddingVertical: 20 }}
              color={COLORS.primary}
            />
          ) : null
        }
      />
    </View>
  );
};