import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
    padding: 8,
    borderRadius: 8,
  },
  addCategoryText: { color: "#fff", marginLeft: 4 },

  teamCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  teamInfo: { flexDirection: "row", alignItems: "center" },
  teamIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(14,165,233,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  teamName: { color: "#fff", fontWeight: "600" },
  teamCategory: { color: "#999", fontSize: 12 },

  teamStats: { flexDirection: "row", marginBottom: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: { color: "#999", fontSize: 12 },

  manageRosterButton: {
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  manageRosterText: { color: "#fff", fontWeight: "600" },

  sectionTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },

  playerCard: { backgroundColor: "#1f1f1f", borderRadius: 12, padding: 12 },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    marginRight: 8,
  },
  addPlayerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
    padding: 8,
    borderRadius: 8,
  },
  addPlayerText: { color: "#fff", marginLeft: 4 },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tableHeaderText: { color: "#999", fontSize: 12, fontWeight: "600" },

  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(14,165,233,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  playerText: { color: "#fff", fontSize: 14 },
  playerTextMuted: { color: "#999", fontSize: 14 },
  playerStatus: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: "center",
  },
  statusActive: { backgroundColor: "rgba(34,197,94,0.2)", color: "#22c55e" },
  statusInjured: { backgroundColor: "rgba(239,68,68,0.2)", color: "#ef4444" },
});
