import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Shared logo ───────────────────────────────────────────────────────────
  logo: {
    width: 40,
    height: 40,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logoDark: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  logoLight: {},
  logoEmoji: {
    fontSize: 18,
  },

  // ── Shared layout ─────────────────────────────────────────────────────────
  cardTop: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  // ── LIVE card ─────────────────────────────────────────────────────────────
  liveCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  // decorative background circle
  liveDecor: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  liveComp: {
    fontSize: 10,
    color: COLORS.textPrimary,
    letterSpacing: 0.4,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
    marginBottom: SPACING.xs,
  },
  liveTeamName: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  liveScoreCol: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  liveScoreText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 40,
  },
  liveScoreSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
  },
  liveFooterText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    flex: 1,
  },

  // ── Base card (upcoming + finished) ──────────────────────────────────────
  baseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: SPACING.sm,
  },
  baseComp: {
    fontSize: 10,
    color: COLORS.textPrimary,
    letterSpacing: 0.4,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
    marginBottom: SPACING.xs,
  },
  baseTeamName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  baseFooterText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    flex: 1,
  },

  // ── Upcoming ──────────────────────────────────────────────────────────────
  upBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  upBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  upCenterCol: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.border,
    letterSpacing: -1,
  },
  upTime: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  // ── Finished ──────────────────────────────────────────────────────────────
  finBadge: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  finBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  finCenterCol: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
  },
  finScoreText: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 34,
  },
  finResultText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
