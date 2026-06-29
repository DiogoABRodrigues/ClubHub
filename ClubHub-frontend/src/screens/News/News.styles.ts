import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.screen,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl, // espaço para status bar
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
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

  // ── Filtros de categoria ──────────────────────────────────────────────────
  categoryContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
  },

  categoryButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  categoryTextActive: {
    color: COLORS.white,
  },

  newsList: {
    flexDirection: "column",
    gap: SPACING.sm,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  noNews: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },

  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  logoEmoji: {
    fontSize: FONT_SIZE.xl,
  },

  noNewsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
}));
