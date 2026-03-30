import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 32, // equilibra o backButton para centrar o título
  },

  // ── Tabs ──────────────────────────────────────────────────
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // ── Content ───────────────────────────────────────────────
  content: {
    flex: 1,
  },
});
