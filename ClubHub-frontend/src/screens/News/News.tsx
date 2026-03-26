import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './News.styles';
import { mockNews, NewsCategory } from '../../data/mockData';
import { NewsCard } from '../../components/NewsCard';
import { COLORS, SPACING } from '../../theme/colors';

export const News = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');

  const categories: Array<NewsCategory | 'All'> = ['All', 'Team', 'Transfers', 'Events'];

  const filteredNews =
    selectedCategory === 'All'
      ? mockNews
      : mockNews.filter((n) => n.category === selectedCategory);

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

        {/* CATEGORY FILTER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={{ gap: SPACING.sm }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredNews.length > 0 ? (
          <View style={styles.newsList}>
            {filteredNews.map((news) => (
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