import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header — espelha o AdminMatches ──────────────────────────────────────
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
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // ── Wrapper de card com ações ─────────────────────────────────────────────
  newsWrapper: {
    marginBottom: SPACING.sm,
    position: "relative",
  },

  newsActions: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.xl,
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

  // ── Loading ───────────────────────────────────────────────────────────────
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
});