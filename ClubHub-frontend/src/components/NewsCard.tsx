import React, { useMemo, useCallback } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styles } from "./styles/NewsCard.styles";
import { News } from "../models/News";
import { formatDatePT } from "../utils/dateUtils";

interface Props {
  news: News;
  onPress?: () => void;
  featured?: boolean;
  isLast?: boolean;
}

export const NewsCard = React.memo(({ news, onPress, featured, isLast }: Props) => {
  const formattedDate = useMemo(
    () => formatDatePT(news.createdAt),
    [news.createdAt],
  );

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  if (featured) {
    return (
      <Pressable style={styles.featuredCard} onPress={handlePress}>
        {news.image ? (
          <Image
            source={{ uri: news.image }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.featuredPlaceholder}>
            <Text style={styles.placeholderEmoji}>⚽</Text>
          </View>
        )}
        <View style={styles.featuredBody}>
          <Text style={styles.featuredDate}>{formattedDate}</Text>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {news.title}
          </Text>
          <Text style={styles.featuredExcerpt} numberOfLines={2}>
            {news.content}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.card, isLast && { borderBottomWidth: 0 }]}
      onPress={handlePress}
    >
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
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={1}>
          {news.content}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </Pressable>
  );
});