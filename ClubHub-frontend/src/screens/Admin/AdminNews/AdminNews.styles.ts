import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl + 8, // espaço para status bar
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    marginBottom: 2,
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
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
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
    color: COLORS.white,
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
}));
