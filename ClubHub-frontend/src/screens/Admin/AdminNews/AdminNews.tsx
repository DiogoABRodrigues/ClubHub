import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Plus, Edit, Trash2 } from "lucide-react-native";
import { styles } from "./AdminNews.styles";
import { NewsCard } from "../../../components/NewsCard";
import { COLORS } from "../../../theme/colors";
import { useNews } from "../../../contexts/NewsContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminNewsStackParamList } from "../../../navigation/AdminNewsStack";
import { Platform } from "react-native";

// Tipagem correta das props
type Props = NativeStackScreenProps<AdminNewsStackParamList, "AdminNews">;

export const AdminNews: React.FC<Props> = ({ navigation }) => {
  const { news, loading, deleteNews } = useNews();


  const handleDelete = useCallback(
    (id: number, title: string) => {
        // 📱 Mobile: usa Alert
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
                  console.log("Notícia eliminada com sucesso");
                } catch (err) {
                  console.error("Não foi possível eliminar a notícia.", err);
                  Alert.alert("Erro", "Não foi possível eliminar a notícia.");
                }
              },
            },
          ]
        );
    },
    [deleteNews]
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AdminNewsForm" as never)}
      >
        <Plus width={16} height={16} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
        {loading ? (
          <Text style={styles.loadingText}>A carregar notícias...</Text>
        ) : news.length > 0 ? (
          <View style={styles.newsList}>
            {news.map((item) => (
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
              onPress={() => navigation.navigate("AdminNewsForm" as never)}
            >
              <Text style={styles.createButtonText}>Criar primeiro artigo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};