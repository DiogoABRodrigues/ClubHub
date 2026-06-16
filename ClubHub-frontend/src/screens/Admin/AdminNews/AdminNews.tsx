import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Plus, Edit, Trash2 } from "lucide-react-native";

import { useNews } from "../../../hooks/useNews";
import { COLORS } from "../../../theme/colors";
import { NewsCard } from "../../../components/NewsCard";
import { styles } from "./AdminNews.styles";
import { useAuth } from "../../../contexts/AuthContext";
export const AdminNews = ({ navigation }: { navigation: any }) => {
  const { news, loading, deleteNews, refreshNews } = useNews();
  const { isAdmin } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshNews();
    } finally {
      setRefreshing(false);
    }
  }, [refreshNews]);

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Acesso negado</Text>
      </View>
    );
  }
  const handleDelete = useCallback(
    (id: number, title: string) => {
      Alert.alert("Eliminar notícia", `Eliminar "${title}"?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNews(id);
            } catch (e) {
              Alert.alert("Erro", "Não foi possível eliminar.");
            }
          },
        },
      ]);
    },
    [deleteNews],
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>A carregar...</Text>
      </View>
    );
  }

  if (!news.length) {
    return (
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.eyebrow}> </Text>
              <Text style={styles.headerTitle}>Notícias</Text>
            </View>
          </View>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 24 }}>📰</Text>
          </View>
          <Text style={styles.emptyText}>Nenhuma notícia encontrada</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("AdminNewsForm")}
          >
            <Text style={styles.createButtonText}>Criar primeira notícia</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.eyebrow}> </Text>
            <Text style={styles.headerTitle}>Notícias</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={news}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AdminNewsForm")}
          >
            <Plus width={16} height={16} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <View style={styles.newsWrapper}>
            <NewsCard
              news={item}
              onPress={() =>
                navigation.navigate("AdminNewsForm", { id: item.id })
              }
            />

            <View style={styles.newsActions}>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Trash2 width={16} height={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
