import React, { useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Plus, Edit, Trash2 } from "lucide-react-native";

import { useNews } from "../../../hooks/useNews";
import { COLORS } from "../../../theme/colors";
import { NewsCard } from "../../../components/NewsCard";
import { styles } from "./AdminNews.styles";

export const AdminNews = ({ navigation }: { navigation: any }) => {
  const { news, loading, deleteNews } = useNews();

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
        <Text>Nenhuma notícia</Text>

        <TouchableOpacity onPress={() => navigation.navigate("AdminNewsForm")}>
          <Text>Criar primeira notícia</Text>
        </TouchableOpacity>
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
                onPress={() =>
                  navigation.navigate("AdminNewsForm", { id: item.id })
                }
              >
                <Edit width={16} height={16} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Trash2 width={16} height={16} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
