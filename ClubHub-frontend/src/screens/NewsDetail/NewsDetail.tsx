import React, { useCallback, useMemo } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./NewsDetail.styles";
import { COLORS } from "../../theme/colors";
import { useNews } from "../../hooks/useNews";
import { formatDatePT } from "../../utils/dateUtils";

export const NewsDetail = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { news } = useNews();

  const newsMap = useMemo(() => {
    const map = new Map();
    for (const n of news) {
      map.set(n.id, n);
    }
    return map;
  }, [news]);

  // Memoize para evitar recalcular a cada render
  const newsFound = useMemo(() => {
    return newsMap.get(id);
  }, [newsMap, id]);

  const relatedNews = useMemo(() => {
    const result = [];

    for (const n of news) {
      if (n.id !== id) {
        result.push(n);
        if (result.length === 3) break;
      }
    }

    return result;
  }, [news, id]);

  const goToNewsDetail = useCallback(
    (newsId: string) => {
      navigation.navigate("NewsDetail", { id: newsId });
    },
    [navigation],
  );

  if (!newsFound) {
    return (
      <View style={styles.noNewsContainer}>
        <Text style={styles.noNewsText}>
          Ocorreu um erro ao carregar a notícia.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("News")}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const formatDate = formatDatePT;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>News</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Featured Image */}
        {newsFound.image ? (
          <Image
            source={{ uri: newsFound.image }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
        )}
        {/* Title */}
        <Text style={styles.newsTitle}>{newsFound.title}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>
              {formatDate(newsFound.createdAt)}
            </Text>
          </View>
        </View>

        {/* Excerpt */}
        <Text style={styles.excerpt}>{newsFound.excerpt}</Text>

        {/* Content */}
        <Text style={styles.contentText}>{newsFound.content}</Text>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <View style={styles.relatedContainer}>
            <Text style={styles.relatedTitle}>Mais Notícias</Text>
            {relatedNews.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => navigation.navigate("NewsDetail", { id: n.id })}
                style={styles.relatedCard}
              >
                <Image
                  source={
                    n.image
                      ? { uri: n.image }
                      : require("../../../assets/player.jpg")
                  }
                  style={styles.relatedImage}
                  resizeMode="contain"
                />
                <View style={styles.relatedTextContainer}>
                  <Text style={styles.relatedNewsTitle} numberOfLines={2}>
                    {n.title}
                  </Text>
                  <Text style={styles.relatedDate}>
                    {formatDate(n.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
