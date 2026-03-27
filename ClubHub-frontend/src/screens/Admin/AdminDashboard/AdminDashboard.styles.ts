import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(14,165,233,0.1)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: { fontSize: 12, color: "#999" },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
  },

  content: { padding: 16 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statCard: {
    flexBasis: "48%",
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 24, fontWeight: "700", color: "#fff" },
  statLabel: { fontSize: 12, color: "#999" },

  quickActionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickActionCard: {
    flexBasis: "48%",
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  quickActionContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  quickActionDesc: { fontSize: 12, color: "#999" },

  recentActivity: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: { fontSize: 12, color: "#fff", marginBottom: 2 },
  activityTime: { fontSize: 10, color: "#999" },
});
