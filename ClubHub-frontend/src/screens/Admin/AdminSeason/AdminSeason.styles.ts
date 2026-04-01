import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    padding: SPACING.xs,
    borderRadius: RADIUS.md,
  },

  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  placeholder: {
    width: 32,
  },

  // ── Tabs ─────────────────────────────────────────────────────────────────
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.xs,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.xs + 2,
    borderRadius: RADIUS.md,
  },

  tabActive: {
    backgroundColor: COLORS.primaryLight,
  },

  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },

  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // ── Conteúdo ─────────────────────────────────────────────────────────────
  content: {
    flex: 1,
  },
});