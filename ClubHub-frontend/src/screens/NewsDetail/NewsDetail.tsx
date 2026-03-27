import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './NewsDetail.styles';
import { COLORS } from '../../theme/colors';
import { useNews } from '../../contexts/NewsContext';
import { formatDatePT } from '../../utils/dateUtils';

export const NewsDetail = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { news, loading } = useNews();
  const newsFound = news.find((n) => n.id === id);

  if (!newsFound) {
    return (
      <View style={styles.noNewsContainer}>
        <Text style={styles.noNewsText}>Ocorreu um erro ao carregar a notícia.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('News')}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const formatDate = (dateStr: string) => formatDatePT(dateStr);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Team':
        return COLORS.primary;
      case 'Transfers':
        return COLORS.chart2;
      case 'Events':
        return COLORS.chart3;
      default:
        return COLORS.muted;
    }
  };
  const relatedNews = news.filter((n) => n.id !== newsFound.id).slice(0, 3);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Featured Image */}
        {newsFound.image ? (
          <Image source={{ uri: newsFound.image }} style={styles.featuredImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
        )}
        {/* Category Badge */}
        <View style={styles.categoryBadgeContainer}>
          <Text style={[styles.categoryBadge, { backgroundColor: getCategoryColor(newsFound.category) }]}>
            {newsFound.category}
          </Text>
        </View>
        {/* Title */}
        <Text style={styles.newsTitle}>{newsFound.title}</Text>
        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{formatDate(newsFound.createdAt)}</Text>
          </View>
        </View>
        {/* Excerpt */}
        <Text style={styles.excerpt}>{newsFound.excerpt}</Text>
        {/* Content */}
        <Text style={styles.contentText}>{newsFound.content}</Text>
        {/* Related News */}
        <View style={styles.relatedContainer}>
          <Text style={styles.relatedTitle}>Mais Notícias</Text>
          {relatedNews.map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => navigation.navigate('NewsDetail', { id: n.id })}
              style={styles.relatedCard}
            >
            <View style={styles.relatedImage}>
              {n.image ? (
                <Image source={{ uri: n.image }} style={styles.relatedImage} resizeMode="cover" />
              ) : (
                <View style={[styles.relatedImage, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.logoEmoji}>⚽</Text>
                </View>
              )}
            </View>
              <View style={styles.relatedTextContainer}>
                <Text style={styles.relatedNewsTitle} numberOfLines={2}>
                  {n.title}
                </Text>
                <Text style={styles.relatedDate}>{formatDate(n.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};