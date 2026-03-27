import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },

  tabList: { flexDirection: "row", marginHorizontal: 16, marginBottom: 12 },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: { borderBottomColor: "#0ea5e9" },
  tabText: { color: "#999" },
  tabTextActive: { color: "#fff", fontWeight: "600" },

  tabContent: { paddingHorizontal: 16, paddingBottom: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  label: { color: "#fff", marginBottom: 4 },
  input: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    marginBottom: 12,
  },

  preview: { marginBottom: 16 },
  previewLabel: { color: "#999", fontSize: 12, marginBottom: 4 },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 8,
  },
  previewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(14,165,233,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  previewTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  previewMessage: { color: "#999", fontSize: 12 },

  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0ea5e9",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  sendButtonText: { color: "#fff", fontWeight: "600" },

  autoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1f1f1f",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  autoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(14,165,233,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  autoTitle: { color: "#fff", fontWeight: "600" },
  autoDesc: { color: "#999", fontSize: 12 },

  historyItem: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  historyTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  historyTimestamp: { color: "#999", fontSize: 12 },
  historyMessage: { color: "#999", fontSize: 12, marginBottom: 4 },
  historyRecipients: { color: "#999", fontSize: 12 },
});
