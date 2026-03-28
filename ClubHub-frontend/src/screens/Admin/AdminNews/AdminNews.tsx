import React, { useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Plus, Edit, Trash2, Search } from "lucide-react-native";
import { styles } from "./AdminNews.styles";
import { NewsCard } from "../../../components/NewsCard";
import { COLORS } from "../../../theme/colors";
import { useNews } from "../../../contexts/NewsContext";

export const AdminNews: React.FC = ({ navigation }: any) => {
  const { news, loading } = useNews();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Deriva as categorias dinamicamente a partir dos dados reais
  const categories = useMemo(() => {
    const unique = Array.from(new Set(news.map((n) => n.category).filter(Boolean)));
    return ["All", ...unique] as string[];
  }, [news]);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        item.title?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  return (
    <View style={styles.container}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AdminAddNews")}
          >
            <Plus width={16} height={16} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>

      {/* News List */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>A carregar notícias...</Text>
        ) : filteredNews.length > 0 ? (
          <View style={styles.newsList}>
            {filteredNews.map((item) => (
              <View key={item.id} style={styles.newsWrapper}>
                <NewsCard
                  news={item}
                  onPress={() =>
                    navigation.navigate("NewsDetail", { id: item.id })
                  }
                />
                <View style={styles.newsActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      navigation.navigate("AdminEditNews", { id: item.id })
                    }
                  >
                    <Edit width={16} height={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Trash2 width={16} height={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 32 }}>📰</Text>
            </View>
            <Text style={styles.emptyText}>Nenhum artigo encontrado</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("AdminAddNews")}
            >
              <Text style={styles.createButtonText}>Criar primeiro artigo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};