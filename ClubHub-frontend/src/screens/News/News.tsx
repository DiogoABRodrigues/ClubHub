import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { RefreshControl } from "react-native";
import { styles } from "./News.styles";
import { NewsCard } from "../../components/NewsCard";
import { EmptyState } from "../../components/EmptyState";
import { useNews } from "../../hooks/useNews";
import { COLORS } from "../../theme/colors";

export const News = ({ navigation }: any) => {
  const { news, loading, refreshNews } = useNews();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshNews();
    } finally {
      setRefreshing(false);
    }
  }, [refreshNews]);

  const goToNewsDetail = useCallback(
    (id: number) => navigation.navigate("NewsDetail", { id }),
    [navigation],
  );

  const renderedNews = useMemo(
    () => news.map((item) => (
      <NewsCard key={item.id} news={item} onPress={() => goToNewsDetail(item.id)} />
    )),
    [news, goToNewsDetail],
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Notícias</Text>
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {!loading && news.length === 0 ? (
          <EmptyState
            title="Não foi possível encontrar informação"
            message="Por favor tenta novamente mais tarde."
            onRetry={onRefresh}
            retryLabel="Atualizar"
          />
        ) : (
          <View style={styles.newsList}>{renderedNews}</View>
        )}
      </ScrollView>
    </View>
  );
};
