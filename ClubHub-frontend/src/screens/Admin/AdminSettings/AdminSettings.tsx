import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./AdminSettings.styles";
import { COLORS } from "../../../theme/colors";
import { ScrapperService } from "../../../services/ScrapperService";
import { useStatements } from "../../../contexts/StatementContext";
import { StatementModal } from "../../../components/StatementModal";

export const AdminSettings = ({ navigation }: any) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);

  const [statementModalVisible, setStatementModalVisible] = useState(false);

  const { statements } = useStatements();
  const activeStatement = statements?.[0];

  const handleUpdateAll = async () => {
    setIsUpdating(true);
    setUpdateDone(false);
    try {
      await ScrapperService.scrapAll();
      setUpdateDone(true);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      alert("Falha ao atualizar dados. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Definições</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Atualizar Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SINCRONIZAÇÃO</Text>

          <View style={styles.card}>
            <View style={styles.cardIconRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="sync-outline"
                  size={22}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>Atualizar Dados</Text>
                <Text style={styles.cardDescription}>
                  Atualiza as equipas, os jogos, os jogadores e as estatísticas.
                </Text>
              </View>
            </View>

            <View style={styles.infoBanner}>
              <Ionicons
                name="information-circle-outline"
                size={15}
                color={COLORS.primary}
                style={{ marginTop: 1 }}
              />
              <Text style={styles.infoBannerText}>
                Esta ação pode demorar alguns minutos e não vai interromper a
                aplicação enquanto executa.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                isUpdating && styles.actionButtonDisabled,
                updateDone && styles.actionButtonDone,
              ]}
              onPress={handleUpdateAll}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {isUpdating ? (
                <View style={styles.buttonInner}>
                  <Ionicons
                    name="sync"
                    size={16}
                    color="#fff"
                    style={styles.spinIcon}
                  />
                  <Text style={styles.actionButtonText}>A atualizar...</Text>
                </View>
              ) : updateDone ? (
                <View style={styles.buttonInner}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.actionButtonText}>Atualizado</Text>
                </View>
              ) : (
                <View style={styles.buttonInner}>
                  <Ionicons
                    name="cloud-download-outline"
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.actionButtonText}>
                    Iniciar Atualização
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="megaphone-outline" size={22} color={COLORS.primary} />
          </View>

          <View style={styles.cardTextBlock}>
            <Text style={styles.cardTitle}>Comunicado</Text>
            <Text style={styles.cardDescription}>
              Criar ou editar o comunicado oficial do clube.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setStatementModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>
            {activeStatement ? "Editar Comunicado" : "Criar Comunicado"}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      <StatementModal
        visible={statementModalVisible}
        onClose={() => setStatementModalVisible(false)}
      />
    </View>
    
  );
};

export default AdminSettings;
