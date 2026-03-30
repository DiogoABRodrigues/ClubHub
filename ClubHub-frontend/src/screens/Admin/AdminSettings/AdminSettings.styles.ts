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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  // ── Content ────────────────────────────────────────────────
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl * 2,
  },

  // ── Section ────────────────────────────────────────────────
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },

  // ── Card ────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + "12",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  cardTextBlock: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  cardTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // ── Info Banner ────────────────────────────────────────────────
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: COLORS.primary + "0D",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + "20",
  },
  infoBannerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 17,
  },

  // ── Action Button ────────────────────────────────────────────────
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.primary + "60",
  },
  actionButtonDone: {
    backgroundColor: "#22c55e",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 7,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  spinIcon: {
    opacity: 0.9,
  },
});
