import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './News.styles';
import { NewsCard } from '../../components/NewsCard';
import { COLORS, SPACING } from '../../theme/colors';
import { useNews } from '../../contexts/NewsContext';

export const News = ({ navigation }: any) => {

  const { news, loading } = useNews();
  
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notícias</Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {news.length > 0 ? (
          <View style={styles.newsList}>
            {news.map((news) => (
              <NewsCard key={news.id} news={news} onPress={() => navigation.navigate('NewsDetail', { id: news.id })} />
            ))}
          </View>
        ) : (
          <View style={styles.noNews}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📰</Text>
            </View>
            <Text style={styles.noNewsText}>Não foram encontradas notícias</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};