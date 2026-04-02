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
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  // ── Scroll content ────────────────────────────────────────────────────────
  content: {
    paddingBottom: SPACING.xl,
  },

  // ── Tabs segmented control ────────────────────────────────────────────────
  tabList: {
    flexDirection: "row",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 3,
  },

  tabButton: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    alignItems: "center",
    borderRadius: RADIUS.sm,
  },

  tabButtonActive: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },

  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },

  // ── Tab content ───────────────────────────────────────────────────────────
  tabContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },

  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: SPACING.sm,
  },

  // ── Preview da notificação ────────────────────────────────────────────────
  preview: {
    marginBottom: SPACING.md,
  },

  previewLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },

  previewIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  previewTitle: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
    marginBottom: 2,
  },

  previewMessage: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 17,
  },

  // ── Botão enviar ──────────────────────────────────────────────────────────
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.xs + 2,
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },

  // ── Items automáticos ─────────────────────────────────────────────────────
  autoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  autoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SPACING.sm,
  },

  autoIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  autoItemText: {
    flex: 1,
    gap: 2,
  },

  autoTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  autoDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 17,
  },

  // ── Histórico ─────────────────────────────────────────────────────────────
  historySection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },

  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },

  historyTitle: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },

  historyTimestamp: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    flexShrink: 0,
  },

  historyMessage: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 17,
  },

  historyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  historyRecipients: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
});
