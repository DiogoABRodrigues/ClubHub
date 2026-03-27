import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },

  header: { paddingHorizontal: 16, paddingTop: 16 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: { padding: 8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "600", marginLeft: 4 },

  searchContainer: { position: "relative", marginBottom: 12 },
  searchIcon: {
    position: "absolute",
    left: 8,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  searchInput: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    paddingLeft: 36,
    paddingRight: 12,
    height: 40,
    color: "#fff",
  },

  categoryScroll: { marginBottom: 12 },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1f1f1f",
    marginRight: 8,
  },
  categoryButtonSelected: { backgroundColor: "#0ea5e9" },
  categoryText: { color: "#999", fontSize: 12 },
  categoryTextSelected: { color: "#fff", fontWeight: "600" },

  newsContainer: { paddingBottom: 24 },
  newsWrapper: { marginBottom: 12, position: "relative" },
  newsActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  editButton: { padding: 6, backgroundColor: "#1f1f1f", borderRadius: 8 },
  deleteButton: { padding: 6, backgroundColor: "#1f1f1f", borderRadius: 8 },

  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyText: { color: "#999", marginBottom: 12 },
  createButton: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: { color: "#fff", fontWeight: "600" },
});
