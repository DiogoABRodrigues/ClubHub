import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react-native";
import { mockNews, NewsCategory } from "../../../data/mockData";
import { NewsCard } from "../../../components/NewsCard";
import { styles } from "./AdminNews.styles";

export const AdminNews: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    NewsCategory | "All"
  >("All");

  const categories: Array<NewsCategory | "All"> = [
    "All",
    "Team",
    "Transfers",
    "Events",
  ];

  const filteredNews = mockNews.filter((news) => {
    const matchesCategory =
      selectedCategory === "All" || news.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.navigate("AdminDashboard" as never)}
            style={styles.backButton}
          >
            <ArrowLeft width={20} height={20} color="#999" />
          </Pressable>
          <Text style={styles.headerTitle}>Manage News</Text>
          <Pressable style={styles.addButton}>
            <Plus width={16} height={16} color="#fff" />
            <Text style={styles.addButtonText}>New Article</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search
            width={20}
            height={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search articles..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* News List */}
      <View style={styles.newsContainer}>
        {filteredNews.length > 0 ? (
          filteredNews.map((news) => (
            <View key={news.id} style={styles.newsWrapper}>
              <NewsCard news={news} />
              <View style={styles.newsActions}>
                <Pressable style={styles.editButton}>
                  <Edit width={16} height={16} color="#0ea5e9" />
                </Pressable>
                <Pressable style={styles.deleteButton}>
                  <Trash2 width={16} height={16} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 32 }}>📰</Text>
            </View>
            <Text style={styles.emptyText}>No articles found</Text>
            <Pressable style={styles.createButton}>
              <Text style={styles.createButtonText}>Create First Article</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
