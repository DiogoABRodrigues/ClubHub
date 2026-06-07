import { StyleSheet, Platform } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";

export const styles = StyleSheet.create({
overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg + 4,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    // sombra Android
    elevation: 12,
  },

  closeBtn: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  closeBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },

  // ── Layout ──
  body: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  // ── Coluna foto ──
  photoCol: {
    width: 120,
    alignItems: "center",
  },

  numberBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 5,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  numberBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: FONT_SIZE.xs,
  },

  photo: {
    width: 110,
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: SPACING.xs,
  },

  firstName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  lastName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },

  positionBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },

  positionText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  // ── Coluna stats ──
  statsCol: {
    flex: 1,
  },

  statsTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },

  statsHeader: {
    flexDirection: "row",
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 2,
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
  },

  seasonLabel: {
    flex: 2,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  statCell: {
    alignItems: "center",
    width: 44,
  },

  statValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  goalsHighlight: {
    color: COLORS.success,
  },

  statLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  colCenter: {
    width: 44,
    textAlign: "center",
  },

  noStats: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: "#9CA3AF",
    textAlign: "center",
  },
});