import React, { useMemo, useCallback, useState, useEffect } from "react";
import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { styles } from "./styles/NewsCard.styles";
import { News } from "../models/News";
import { formatDatePT } from "../utils/dateUtils";

interface Props {
  news: News;
  onPress?: () => void;
}

const screenWidth = Dimensions.get("window").width;

export const NewsCard = React.memo(({ news, onPress }: Props) => {
  const formattedDate = useMemo(
    () => formatDatePT(news.createdAt),
    [news.createdAt],
  );

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  // Calcula a altura proporcional à largura real da imagem
  const [imageHeight, setImageHeight] = useState<number>(200);

  useEffect(() => {
    if (!news.image) return;
    // A largura disponível para a imagem é a largura do card (screenWidth - margens)
    // O card tem marginBottom: 12 mas não margem horizontal — usa screenWidth
    Image.getSize(
      news.image,
      (w, h) => {
        if (w > 0) {
          // A imagem ocupa a largura total do card
          const cardWidth = screenWidth - 32; // padding horizontal da FlatList/ScrollView
          setImageHeight((h / w) * cardWidth);
        }
      },
      () => {
        setImageHeight(200); // fallback se falhar
      },
    );
  }, [news.image]);

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {/* IMAGE */}
      {news.image ? (
        <Image
          source={{ uri: news.image }}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderEmoji}>⚽</Text>
        </View>
      )}

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {news.content}
        </Text>
      </View>
    </Pressable>
  );
});