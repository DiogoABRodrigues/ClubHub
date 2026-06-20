import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./AdminSettings.styles";
import { COLORS } from "../../../theme/colors";
import { ScrapperService } from "../../../services/ScrapperService";
import { useStatements } from "../../../hooks/useStatements";
import { StatementModal } from "../../../components/StatementModal";
import { NotificationModal } from "../../../components/NotificationModal";
import { useAuth } from "../../../contexts/AuthContext";
import { Switch } from "../../../components/Switch";
import { useAppSetting } from "../../../hooks/useAppSettings";
import { Alert } from "react-native";

export const AdminSettings = ({ navigation }: any) => {
  const { isAdmin, logout, setAdminMode } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);
  const [statementModalVisible, setStatementModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const {
    value: notificationsEnabled,
    toggle: toggleNotifications,
    loading: loadingNotifications,
  } = useAppSetting("notifications_enabled");
  const { statements } = useStatements();
  const activeStatement = statements?.[0];

  const handleToggleNotifications = (newValue: boolean) => {
    Alert.alert(
      newValue ? "Ativar Notificações" : "Desativar Notificações",
      newValue
        ? "Tens a certeza que queres ativar todas as notificações para todos os utilizadores?"
        : "Tens a certeza que queres desativar todas as notificações para todos os utilizadores?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: newValue ? "default" : "destructive",
          onPress: () => toggleNotifications(newValue),
        },
      ],
    );
  };

  const handleUpdateAll = async () => {
    setIsUpdating(true);
    setUpdateDone(false);
    try {
      await ScrapperService.scrapAll();
      await queryClient.invalidateQueries();
      setUpdateDone(true);
    } catch (error) {
      alert("Falha ao atualizar dados. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Acesso negado</Text>
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
            <Text style={styles.headerTitle}>Definições</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card: Atualizar Dados */}
        <View style={styles.section}>
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
                color={COLORS.textSecondary}
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

        {/* Card: Comunicado */}
        <View style={[styles.card, { marginBottom: 20 }]}>
          <View style={styles.cardIconRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="megaphone-outline"
                size={22}
                color={COLORS.primary}
              />
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

        {/* Card: Notificações (toggle + enviar) */}
        <View style={[styles.card, { marginBottom: 20 }]}>
          <View style={styles.cardIconRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Notificações</Text>
              <Text style={styles.cardDescription}>
                Ativar o envio de notificações para todos os utilizadores.
              </Text>
            </View>
            {!loadingNotifications && (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                size={32}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setNotificationModalVisible(true)}
          >
            <View style={styles.buttonInner}>
              <Ionicons name="send-outline" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Enviar Notificação</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card: Logout */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="log-out-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Logout</Text>
              <Text style={styles.cardDescription}>
                Terminar sessão na conta atual.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDestructive]}
            onPress={async () => {
              try {
                await logout();
                setAdminMode(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Início" }],
                });
              } catch (e) {
                console.log("Erro logout", e);
              }
            }}
          >
            <Text style={styles.actionButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatementModal
        visible={statementModalVisible}
        onClose={() => setStatementModalVisible(false)}
      />
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
    </View>
  );
};

export default AdminSettings;
