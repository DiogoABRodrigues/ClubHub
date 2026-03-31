import React, { useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./News.styles";
import { NewsCard } from "../../components/NewsCard";
import { COLORS } from "../../theme/colors";
import { useNews } from "../../contexts/NewsContext";

export const News = ({ navigation }: any) => {
  const { news, loading } = useNews();

  // Memoiza a lista de notícias
  const newsList = news;

  const goToNewsDetail = useCallback(
    (id: number) => {
      navigation.navigate("NewsDetail", { id });
    },
    [navigation],
  );

  const renderedNews = useMemo(() => {
    return newsList.map((item) => (
      <NewsCard
        key={item.id}
        news={item}
        onPress={() => goToNewsDetail(item.id)}
      />
    ));
  }, [newsList, goToNewsDetail]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notícias</Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            A carregar notícias...
          </Text>
        ) : newsList.length > 0 ? (
          <View style={styles.newsList}>
            {renderedNews}
          </View>
        ) : (
          <View style={styles.noNews}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📰</Text>
            </View>
            <Text style={styles.noNewsText}>
              Não foram encontradas notícias
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
