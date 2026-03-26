import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsCard } from '../../components/NewsCard';
import { BottomNav } from '../../components/BottomNav';
import { styles } from './NewsDetail.styles';
import { mockNews } from '../../data/mockData';
import { COLORS, SPACING } from '../../theme/colors';

export const NewsDetail = ({ route, navigation }: any) => {
  const { id } = route.params;
  const news = mockNews.find((n) => n.id === id);

  if (!news) {
    return (
      <View style={styles.noNewsContainer}>
        <Text style={styles.noNewsText}>News article not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('News')}>
          <Text style={styles.backLink}>Back to News</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

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

  const relatedNews = mockNews.filter((n) => n.id !== news.id).slice(0, 3);

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
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Featured Image */}
        {news.image ? (
          <Image source={{ uri: news.image }} style={styles.featuredImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
        )}

        {/* Category Badge */}
        <View style={styles.categoryBadgeContainer}>
          <Text style={[styles.categoryBadge, { backgroundColor: getCategoryColor(news.category) }]}>
            {news.category}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.newsTitle}>{news.title}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{formatDate(news.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{news.author}</Text>
          </View>
        </View>

        {/* Excerpt */}
        <Text style={styles.excerpt}>{news.excerpt}</Text>

        {/* Content */}
        <Text style={styles.contentText}>{news.content}</Text>

        {/* Related News */}
        <View style={styles.relatedContainer}>
          <Text style={styles.relatedTitle}>More News</Text>
          {relatedNews.map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => navigation.navigate('NewsDetail', { id: n.id })}
              style={styles.relatedCard}
            >
              <View style={styles.relatedImage}>
                <Text style={styles.logoEmoji}>⚽</Text>
              </View>
              <View style={styles.relatedTextContainer}>
                <Text style={styles.relatedNewsTitle} numberOfLines={2}>
                  {n.title}
                </Text>
                <Text style={styles.relatedDate}>{formatDate(n.date)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};