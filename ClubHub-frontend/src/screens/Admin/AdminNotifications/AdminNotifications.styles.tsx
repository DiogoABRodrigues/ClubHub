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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  // ── Scroll content ────────────────────────────────────────
  content: {
    paddingBottom: SPACING.lg,
  },

  // ── Tabs ──────────────────────────────────────────────────
  tabList: {
    flexDirection: "row",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.xs,
    alignItems: "center",
    borderRadius: RADIUS.sm,
  },
  tabButtonActive: {
    backgroundColor: COLORS.surface,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },

  // ── Tab content ───────────────────────────────────────────
  tabContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },

  // ── Preview ───────────────────────────────────────────────
  preview: {
    marginBottom: SPACING.md,
  },
  previewLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  previewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  previewTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
  previewMessage: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },

  // ── Send button ───────────────────────────────────────────
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  // ── Auto items ────────────────────────────────────────────
  autoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  autoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  autoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  autoItemText: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  autoTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
  autoDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },

  // ── History ───────────────────────────────────────────────
  historySection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  historyItem: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historyTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
  historyTimestamp: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  historyMessage: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
  },
  historyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyRecipients: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
});
