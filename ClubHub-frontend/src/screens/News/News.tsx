import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './News.styles';
import { mockNews, NewsCategory } from '../../data/mockData';
import { NewsCard } from '../../components/NewsCard';
import { COLORS, SPACING } from '../../theme/colors';

export const News = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Club News</Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {mockNews.length > 0 ? (
          <View style={styles.newsList}>
            {mockNews.map((news) => (
              <NewsCard key={news.id} news={news} onPress={() => navigation.navigate('NewsDetail', { id: news.id })} />
            ))}
          </View>
        ) : (
          <View style={styles.noNews}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📰</Text>
            </View>
            <Text style={styles.noNewsText}>No news found for this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};