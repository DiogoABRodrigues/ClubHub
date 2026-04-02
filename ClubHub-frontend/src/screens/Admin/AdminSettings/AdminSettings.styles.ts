import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../../theme/colors";

export const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
  },
  cardTextBlock: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
    color: COLORS.textPrimary,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  // ── Info Banner ────────────────────────────────────────────────
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
  },
  infoBannerText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 17,
  },

  // ── Action Button ────────────────────────────────────────────────
  actionButton: {
    backgroundColor: "#800000",
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.textPrimary,
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
