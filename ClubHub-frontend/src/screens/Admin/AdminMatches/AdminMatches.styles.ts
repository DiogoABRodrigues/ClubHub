import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header — igual ao Matches público ────────────────────────────────────
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },

  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  // ── Botão adicionar ───────────────────────────────────────────────────────
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.xs + 2,
    alignSelf: "flex-start",
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchIcon: {
    marginRight: SPACING.xs,
  },

  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    padding: 0,
  },

  // ── Filtros de categoria ──────────────────────────────────────────────────
  categoryScroll: {
    marginBottom: SPACING.sm,
  },

  categoryButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
    fontSize: FONT_SIZE.sm,
  },

  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 50,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },

  // ── Secções ───────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  seeAllText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // ── Wrapper de card com ações ─────────────────────────────────────────────
  matchWrapper: {
    marginBottom: SPACING.sm,
    position: "relative",
  },

  matchActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: SPACING.sm,
  },

  editButton: {
    padding: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  deleteButton: {
    padding: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xl + SPACING.lg,
    gap: SPACING.sm,
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },

  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },

  backButton: {
    padding: SPACING.xs,
  },
});