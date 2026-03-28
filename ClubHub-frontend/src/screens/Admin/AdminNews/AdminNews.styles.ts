import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: 4,
    width: 100, 
    height: 36,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  // ── Search ────────────────────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
    height: 40,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
  },

  // ── Category filter ───────────────────────────────────────
  categoryScroll: {
    marginBottom: SPACING.xs,
  },
  categoryButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.secondary,
    marginRight: SPACING.xs,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
    fontSize: FONT_SIZE.sm,
  },
  categoryTextActive: {
    color: COLORS.background,
    fontWeight: "600",
  },

  // ── Content ───────────────────────────────────────────────
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    color: COLORS.textSecondary,
  },
  newsList: {
    flexDirection: "column",
    gap: SPACING.sm,
  },

  // ── News row ──────────────────────────────────────────────
  newsWrapper: {
    position: "relative",
  },
  newsActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
  },

  // ── Empty state ───────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
});