import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Plus, Edit, Trash2 } from "lucide-react-native";
import { styles } from "./AdminNews.styles";
import { NewsCard } from "../../../components/NewsCard";
import { COLORS } from "../../../theme/colors";
import { useNews } from "../../../contexts/NewsContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminNewsStackParamList } from "../../../navigation/AdminNewsStack";

// Tipagem correta das props
type Props = NativeStackScreenProps<AdminNewsStackParamList, "AdminNews">;

export const AdminNews: React.FC<Props> = ({ navigation }) => {
  const { news, loading, deleteNews } = useNews();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(news.map((n) => n.category).filter(Boolean)),
    );
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

  const handleDelete = useCallback(
    (id: string, title: string) => {
      Alert.alert(
        "Eliminar notícia?",
        `Tens a certeza que queres eliminar "${title}"? Esta ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteNews(id);
              } catch {
                Alert.alert("Erro", "Não foi possível eliminar a notícia.");
              }
            },
          },
        ],
      );
    },
    [deleteNews],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AdminNewsForm")}
      >
        <Plus width={16} height={16} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
        {loading ? (
          <Text style={styles.loadingText}>A carregar notícias...</Text>
        ) : filteredNews.length > 0 ? (
          <View style={styles.newsList}>
            {filteredNews.map((item) => (
              <View key={item.id} style={styles.newsWrapper}>
                <NewsCard
                  news={item}
                  onPress={() => navigation.navigate("AdminNewsForm", { id: item.id })}
                />
                <View style={styles.newsActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      navigation.navigate("AdminNewsForm", { id: item.id })
                    }
                  >
                    <Edit width={16} height={16} color={COLORS.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id, item.title)}
                  >
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
              onPress={() => navigation.navigate("AdminNewsForm")}
            >
              <Text style={styles.createButtonText}>Criar primeiro artigo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};