import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Trophy,
  Newspaper,
  Bell,
  Users,
  TrendingUp,
  Target,
  Calendar,
} from "lucide-react-native";
import { mockMatches, mockNews } from "../../../data/mockData";
import { styles } from "./AdminDashboard.styles";

export const AdminDashboard: React.FC = () => {
  const navigation = useNavigation();

  const stats = [
    {
      label: "Total Matches",
      value: mockMatches.length,
      icon: Trophy,
      color: "#0ea5e9", // primary
      bgColor: "rgba(14,165,233,0.1)",
    },
    {
      label: "Live Matches",
      value: mockMatches.filter((m) => m.status === "live").length,
      icon: Target,
      color: "#ef4444", // destructive
      bgColor: "rgba(239,68,68,0.1)",
    },
    {
      label: "News Articles",
      value: mockNews.length,
      icon: Newspaper,
      color: "#06b6d4", // chart-2
      bgColor: "rgba(6,182,212,0.1)",
    },
    {
      label: "Upcoming",
      value: mockMatches.filter((m) => m.status === "upcoming").length,
      icon: Calendar,
      color: "#8b5cf6", // chart-3
      bgColor: "rgba(139,92,246,0.1)",
    },
  ];

  const quickActions = [
    {
      title: "Manage Matches",
      description: "Add, edit, or remove matches",
      icon: Trophy,
      screen: "Matches",
      color: "#0ea5e9",
    },
    {
      title: "Manage News",
      description: "Create and publish news articles",
      icon: Newspaper,
      screen: "News",
      color: "#06b6d4",
    },
    {
      title: "Send Notifications",
      description: "Broadcast alerts to fans",
      icon: Bell,
      screen: "Notifications",
      color: "#8b5cf6",
    },
    {
      title: "Manage Teams",
      description: "Update team rosters and categories",
      icon: Users,
      screen: "Teams",
      color: "#22c55e",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              FC Titans Management Portal
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Stats Grid */}
        <View style={{ marginBottom: 16 }}>
          <View style={styles.sectionHeader}>
            <TrendingUp width={20} height={20} color="#0ea5e9" />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <View
                  style={[styles.statIcon, { backgroundColor: stat.bgColor }]}
                >
                  <stat.icon width={24} height={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.title}
                onPress={() => navigation.navigate(action.screen as never)}
                style={styles.quickActionCard}
              >
                <View style={styles.quickActionContent}>
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: `${action.color}1A` },
                    ]}
                  >
                    <action.icon width={24} height={24} color={action.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionDesc}>
                      {action.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
            Recent Activity
          </Text>
          <View style={styles.recentActivity}>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: "rgba(6,182,212,0.1)" },
                ]}
              >
                <Trophy width={16} height={16} color="#06b6d4" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  Match result updated: FC Titans 2-1 United Sports
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: "rgba(14,165,233,0.1)" },
                ]}
              >
                <Newspaper width={16} height={16} color="#0ea5e9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  New article published: Young Talent Signs Contract
                </Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: "rgba(139,92,246,0.1)" },
                ]}
              >
                <Bell width={16} height={16} color="#8b5cf6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>
                  Notification sent: Match starting in 1 hour
                </Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
