import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Send,
  Bell,
  Target,
  Trophy,
  Newspaper,
} from "lucide-react-native";
import { styles } from "./AdminNotifications.styles";

export const AdminNotifications: React.FC = () => {
  const navigation = useNavigation();
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
      title: "GOAL! FC Titans",
      message: "Fernando Pereira scores! FC Titans 2-1 United Sports",
      timestamp: "2 hours ago",
      recipients: 1234,
    },
    {
      id: "2",
      type: "match_start",
      title: "Match Starting Soon",
      message: "FC Titans vs United Sports kicks off in 15 minutes",
      timestamp: "3 hours ago",
      recipients: 2100,
    },
    {
      id: "3",
      type: "news",
      title: "New Article Published",
      message: "Young Talent João Silva Signs New Contract",
      timestamp: "1 day ago",
      recipients: 1890,
    },
  ];

  const handleSendManual = () => {
    console.log("Sending manual notification:", {
      title: manualTitle,
      message: manualMessage,
      type: selectedType,
    });
    setManualTitle("");
    setManualMessage("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate("AdminDashboard" as never)}
        >
          <ArrowLeft width={20} height={20} color="#999" />
        </Pressable>
        <Text style={styles.headerTitle}>Send Notifications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabList}>
        <Pressable
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
            Manual Notification
          </Text>
        </Pressable>
        <Pressable
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
            Automatic Events
          </Text>
        </Pressable>
      </View>

      {/* Manual Notification */}
      {activeTab === "manual" && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Create Custom Notification</Text>

          {/* Target Audience */}
          <Text style={styles.label}>Target Audience</Text>
          <TextInput
            value={selectedType}
            onChangeText={setSelectedType}
            style={styles.input}
            placeholder="all, senior, u19, u17..."
            placeholderTextColor="#999"
          />

          {/* Title */}
          <Text style={styles.label}>Notification Title</Text>
          <TextInput
            value={manualTitle}
            onChangeText={setManualTitle}
            style={styles.input}
            placeholder="Enter notification title..."
            placeholderTextColor="#999"
          />

          {/* Message */}
          <Text style={styles.label}>Message</Text>
          <TextInput
            value={manualMessage}
            onChangeText={setManualMessage}
            style={[styles.input, { height: 80 }]}
            placeholder="Enter your message..."
            placeholderTextColor="#999"
            multiline
          />

          {/* Preview */}
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewIcon}>
                <Bell width={16} height={16} color="#0ea5e9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewTitle}>
                  {manualTitle || "Notification Title"}
                </Text>
                <Text style={styles.previewMessage}>
                  {manualMessage || "Your message will appear here..."}
                </Text>
              </View>
            </View>
          </View>

          {/* Send Button */}
          <Pressable
            onPress={handleSendManual}
            disabled={!manualTitle || !manualMessage}
            style={[
              styles.sendButton,
              (!manualTitle || !manualMessage) && { opacity: 0.5 },
            ]}
          >
            <Send width={16} height={16} color="#fff" />
            <Text style={styles.sendButtonText}>Send Notification</Text>
          </Pressable>
        </View>
      )}

      {/* Automatic Events */}
      {activeTab === "automatic" && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>
            Automated Notification Settings
          </Text>

          {[
            {
              key: "matchStart",
              title: "Match Start",
              description:
                "Automatically notify users 15 minutes before kickoff",
              icon: Trophy,
            },
            {
              key: "goalScored",
              title: "Goal Scored",
              description: "Instant notifications when a goal is scored",
              icon: Target,
            },
            {
              key: "matchFinished",
              title: "Match Finished",
              description: "Notify users when a match ends with final score",
              icon: Trophy,
            },
            {
              key: "newsPublished",
              title: "News Published",
              description: "Alert users when new articles are published",
              icon: Newspaper,
            },
          ].map((item) => (
            <View key={item.key} style={styles.autoItem}>
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View style={styles.autoIcon}>
                  <item.icon width={16} height={16} color="#0ea5e9" />
                </View>
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.autoTitle}>{item.title}</Text>
                  <Text style={styles.autoDesc}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={autoSettings[item.key as keyof typeof autoSettings]}
                onValueChange={(val) =>
                  setAutoSettings((prev) => ({ ...prev, [item.key]: val }))
                }
              />
            </View>
          ))}
        </View>
      )}

      {/* Notification History */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notificationHistory.map((notification) => (
          <View key={notification.id} style={styles.historyItem}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text style={styles.historyTitle}>{notification.title}</Text>
              <Text style={styles.historyTimestamp}>
                {notification.timestamp}
              </Text>
            </View>
            <Text style={styles.historyMessage}>{notification.message}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Bell width={12} height={12} color="#999" />
              <Text style={styles.historyRecipients}>
                {notification.recipients} recipients
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
