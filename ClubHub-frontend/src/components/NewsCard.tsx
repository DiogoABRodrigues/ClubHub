import React, { useMemo, useCallback } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styles } from "./styles/NewsCard.styles";
import { News } from "../models/News";
import { formatDatePT } from "../utils/dateUtils";

interface Props {
  news: News;
  onPress?: () => void;
}

export const NewsCard = React.memo(({ news, onPress }: Props) => {
  const formattedDate = useMemo(
    () => formatDatePT(news.createdAt),
    [news.createdAt],
  );

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {/* IMAGE */}
      {news.image ? (
        <Image
          source={{ uri: news.image }}
          style={styles.image}
          resizeMode="cover"
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
          {news.excerpt}
        </Text>
      </View>
    </Pressable>
  );
});
