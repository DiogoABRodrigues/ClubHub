import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Linha principal ───────────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm + 2,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },

  userRow: {
    backgroundColor: COLORS.primaryLight,
  },

  // ── Células ───────────────────────────────────────────────────────────────
  cell: {
    // Flex será aplicado dinamicamente
  },

  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  teamLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  // ── Tipografia ────────────────────────────────────────────────────────────
  text: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  mutedText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  bold: {
    fontWeight: "700",
  },

  // ── Linha expandida (estatísticas detalhadas) ─────────────────────────────
  expandedStats: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  statLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "400",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  statValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
});
