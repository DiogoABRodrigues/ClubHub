import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Send, Bell, Target, Trophy, Newspaper } from "lucide-react-native";
import { styles } from "./AdminNotifications.styles";
import { COLORS } from "../../../theme/colors";

export const AdminNotifications: React.FC = ({ navigation }: any) => {
  const [manualTitle, setManualTitle] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState<"manual" | "automatic">("manual");
  const [autoSettings, setAutoSettings] = useState({
    matchStart: true,
    goalScored: true,
    matchFinished: true,
    newsPublished: false,
  });

  const notificationHistory = [
    {
      id: "1",
      type: "goal",
      title: "GOLO! FC Titans",
      message: "Fernando Pereira marca! FC Titans 2-1 United Sports",
      timestamp: "Há 2 horas",
      recipients: 1234,
    },
    {
      id: "2",
      type: "match_start",
      title: "Jogo a começar",
      message: "FC Titans vs United Sports começa em 15 minutos",
      timestamp: "Há 3 horas",
      recipients: 2100,
    },
    {
      id: "3",
      type: "news",
      title: "Novo artigo publicado",
      message: "Jovem talento João Silva renova contrato",
      timestamp: "Há 1 dia",
      recipients: 1890,
    },
  ];

  const handleSendManual = () => {
    console.log("Enviando notificação manual:", {
      title: manualTitle,
      message: manualMessage,
      type: selectedType,
    });
    setManualTitle("");
    setManualMessage("");
  };

  const autoItems = [
    {
      key: "matchStart",
      title: "Início do jogo",
      description: "Notifica os utilizadores 15 minutos antes do jogo",
      icon: Trophy,
    },
    {
      key: "goalScored",
      title: "Golo marcado",
      description: "Notificação imediata quando é marcado um golo",
      icon: Target,
    },
    {
      key: "matchFinished",
      title: "Fim do jogo",
      description: "Notifica os utilizadores com o resultado final",
      icon: Trophy,
    },
    {
      key: "newsPublished",
      title: "Artigo publicado",
      description: "Alerta quando um novo artigo é publicado",
      icon: Newspaper,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Tabs */}
        <View style={styles.tabList}>
          <TouchableOpacity
            onPress={() => setActiveTab("manual")}
            style={[
              styles.tabButton,
              activeTab === "manual" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "manual" && styles.tabTextActive,
              ]}
            >
              Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("automatic")}
            style={[
              styles.tabButton,
              activeTab === "automatic" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "automatic" && styles.tabTextActive,
              ]}
            >
              Automático
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Notification */}
        {activeTab === "manual" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Criar notificação personalizada</Text>

            <Text style={styles.label}>Público-alvo</Text>
            <TextInput
              value={selectedType}
              onChangeText={setSelectedType}
              style={styles.input}
              placeholder="todos, sénior, u19, u17..."
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.label}>Título</Text>
            <TextInput
              value={manualTitle}
              onChangeText={setManualTitle}
              style={styles.input}
              placeholder="Título da notificação..."
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.label}>Mensagem</Text>
            <TextInput
              value={manualMessage}
              onChangeText={setManualMessage}
              style={[styles.input, styles.inputMultiline]}
              placeholder="Escreve a tua mensagem..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
            />

            {/* Preview */}
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Pré-visualização</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewIcon}>
                  <Bell width={16} height={16} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>
                    {manualTitle || "Título da notificação"}
                  </Text>
                  <Text style={styles.previewMessage}>
                    {manualMessage || "A tua mensagem vai aparecer aqui..."}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSendManual}
              disabled={!manualTitle || !manualMessage}
              style={[
                styles.sendButton,
                (!manualTitle || !manualMessage) && styles.sendButtonDisabled,
              ]}
            >
              <Send width={16} height={16} color="#fff" />
              <Text style={styles.sendButtonText}>Enviar notificação</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Automatic Events */}
        {activeTab === "automatic" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Definições automáticas</Text>
            {autoItems.map((item) => (
              <View key={item.key} style={styles.autoItem}>
                <View style={styles.autoItemLeft}>
                  <View style={styles.autoIcon}>
                    <item.icon width={16} height={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.autoItemText}>
                    <Text style={styles.autoTitle}>{item.title}</Text>
                    <Text style={styles.autoDesc}>{item.description}</Text>
                  </View>
                </View>
                <Switch
                  value={autoSettings[item.key as keyof typeof autoSettings]}
                  onValueChange={(val) =>
                    setAutoSettings((prev) => ({ ...prev, [item.key]: val }))
                  }
                  trackColor={{ false: COLORS.secondary, true: COLORS.primary }}
                />
              </View>
            ))}
          </View>
        )}

        {/* Notification History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Notificações recentes</Text>
          {notificationHistory.map((notification) => (
            <View key={notification.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>{notification.title}</Text>
                <Text style={styles.historyTimestamp}>
                  {notification.timestamp}
                </Text>
              </View>
              <Text style={styles.historyMessage}>{notification.message}</Text>
              <View style={styles.historyFooter}>
                <Bell width={12} height={12} color={COLORS.textSecondary} />
                <Text style={styles.historyRecipients}>
                  {notification.recipients} destinatários
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};  