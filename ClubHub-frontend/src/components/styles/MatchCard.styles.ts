import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Card base ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ── Header do card (data / status) ───────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  headerInfo: {
    flexDirection: "column",
    gap: 2,
  },

  date: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  competition: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // ── Badges de estado ──────────────────────────────────────────────────────
  upcoming: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },

  finished: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },

  // ── Equipas ───────────────────────────────────────────────────────────────
  teams: {
    gap: 8,
  },

  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  teamLogo: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  teamLogoAlt: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },

  teamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },

  // ── Score ─────────────────────────────────────────────────────────────────
  score: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    minWidth: 28,
    textAlign: "center",
  },

  // ── Footer (local / categoria) ────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 0.5,
    borderColor: COLORS.border,
    paddingTop: 8,
    gap: 4,
  },

  venue: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
  },

  category: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
});