import { COLORS, SPACING, RADIUS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Shared logo ───────────────────────────────────────────────────────────
  logo: {
    width: 40,
    height: 40,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

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
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borders.muted,
  },

  // ── LIVE card (variante D — consistente com baseCard) ────────────────────
  liveCard: {
    backgroundColor: COLORS.backgrounds.screen,
    borderRadius: RADIUS.lg,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: COLORS.borders.inverse,
    borderTopWidth: 2.5,
    borderTopColor: COLORS.primary,
    padding: 14,
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  liveDecor: {},
  liveComp: {
    fontSize: 10,
    color: COLORS.text.info,
    letterSpacing: 0.4,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  liveTeamName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    textAlign: "center",
  },
  liveScoreCol: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  liveScoreText: {
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.text.info,
    letterSpacing: -2,
    lineHeight: 40,
  },
  liveScoreSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  liveFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
  },

  // ── Base card (upcoming + finished) — variante C ──────────────────────────
  baseCard: {
    backgroundColor: COLORS.backgrounds.screen,
    elevation: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.borders.inverse,
    borderTopWidth: 2.5,
    borderTopColor: COLORS.primary,
    padding: 14,
    marginBottom: SPACING.sm,
  },
  baseComp: {
    fontSize: 10,
    color: COLORS.text.info,
    letterSpacing: 0.4,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  baseTeamName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    textAlign: "center",
  },
  baseFooterText: {
    fontSize: 11,
    color: COLORS.text.subtle,
    flex: 1,
  },

  // ── Upcoming ──────────────────────────────────────────────────────────────
  upBadge: {
    backgroundColor: COLORS.brand.tint,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  upBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.text.info,
  },
  upCenterCol: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text.muted,
    letterSpacing: -1,
  },
  upTime: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
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
    color: COLORS.text.subtle,
  },
  finCenterCol: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
  },
  finScoreText: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text.info,
    letterSpacing: -1.5,
    lineHeight: 34,
  },
  finResultText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
}));