import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./NewsDetail.styles";
import { COLORS } from "../../theme/colors";
import { useNews } from "../../hooks/useNews";
import { formatDatePT } from "../../utils/dateUtils";
import { useAuth } from "../../contexts/AuthContext";
import { EmptyState } from "../../components/EmptyState";

const screenWidth = Dimensions.get("window").width;

export const NewsDetail = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { news } = useNews();
  const { adminMode } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const newsMap = useMemo(() => {
    const map = new Map();
    for (const n of news) {
      map.set(n.id, n);
    }
    return map;
  }, [news]);

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

  // Altura dinâmica da imagem principal
  const [featuredHeight, setFeaturedHeight] = useState<number>(240);

  useEffect(() => {
    setFeaturedHeight(240);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, [id]);

  useEffect(() => {
    if (!newsFound?.image) return;
    Image.getSize(
      newsFound.image,
      (w, h) => {
        if (w > 0) {
          setFeaturedHeight((h / w) * screenWidth);
        }
      },
      () => {
        setFeaturedHeight(240);
      },
    );
  }, [newsFound?.image]);

  const openRelatedNews = useCallback(
    (newsId: number) => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
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
        <TouchableOpacity
          onPress={() => navigation.navigate(adminMode ? "AdminNews" : "News")}
        >
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = formatDatePT;
  const isEmpty = news.length === 0;

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

      {isEmpty && (
        <EmptyState
          title="Não foi possível encontrar informação"
          message="Por favor tenta novamente mais tarde."
        />
      )}

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        {/* Featured Image — full-bleed, altura proporcional */}
        {newsFound.image ? (
          <Image
            source={{ uri: newsFound.image }}
            style={[styles.featuredImage, { height: featuredHeight }]}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
        )}

        {/* Content com padding horizontal */}
        <View style={styles.content}>
          <Text style={styles.newsTitle}>{newsFound.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>
                {formatDate(newsFound.createdAt)}
              </Text>
            </View>
          </View>

          <Text style={styles.contentText}>{newsFound.content}</Text>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <View style={styles.relatedContainer}>
              <Text style={styles.relatedTitle}>Mais Notícias</Text>
              {relatedNews.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  onPress={() => openRelatedNews(n.id)}
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
        </View>
      </ScrollView>
    </View>
  );
};
