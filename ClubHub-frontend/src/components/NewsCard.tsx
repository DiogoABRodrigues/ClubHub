import React from 'react';
import { View, Text, Image, Pressable, Platform } from 'react-native';
import { styles } from './styles/NewsCard.styles';
import { COLORS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { News } from '../models/News';
import { formatDatePT } from '../utils/dateUtils';

interface Props {
  news: News;
  onPress?: () => void; // função de navegação
}

export const NewsCard = ({ news, onPress }: Props) => {

  const formatDate = (dateStr: string) => {
    return formatDatePT(dateStr);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Team':
        return { backgroundColor: COLORS.primary + '20', color: COLORS.primary };
      case 'Transfers':
        return { backgroundColor: COLORS.secondary + '20', color: COLORS.secondary };
      case 'Events':
        return { backgroundColor: COLORS.surface, color: COLORS.textPrimary };
      default:
        return { backgroundColor: COLORS.surface, color: COLORS.textSecondary };
    }
  };

  const categoryStyle = getCategoryColor(news.category);
  
  return (
    <Pressable style={styles.card} onPress={onPress}>
      
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
          <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.backgroundColor }]}>
            <Text style={[styles.categoryText, { color: categoryStyle.color }]}>
              {news.category}
            </Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
            <Text style={styles.dateText}>{formatDate(news.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>{news.excerpt}</Text>
      </View>

    </Pressable>
  );
};