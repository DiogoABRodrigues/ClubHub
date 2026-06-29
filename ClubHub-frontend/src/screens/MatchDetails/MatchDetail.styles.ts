import { COLORS, SPACING, FONT_SIZE, RADIUS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
  },

  mutedText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },

  primaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
  },

  // ── Header — variante C (tint rosado + linha maroon no topo) ─────────────
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borders.subtle,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  backButton: {
    position: "absolute",
    left: SPACING.md,
    top: SPACING.xl,
    padding: 8,
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    marginBottom: SPACING.xs,
  },

  // ── Status badges ─────────────────────────────────────────────────────────
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },

  upcomingBadge: {
    backgroundColor: COLORS.brand.tint,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  phaseBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    width: 120,
    alignItems: "center",
  },

  phaseBadgeText: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 6,
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.blackWhite,
    fontWeight: "700",
  },

  fulltimeBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 10,
    color: COLORS.text.info,
    fontWeight: "700",
  },

  fulltimeBadgeText: {
    fontSize: 10,
    color: COLORS.text.subtle,
    fontWeight: "600",
  },

  competition: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.info,
    textAlign: "center",
    marginBottom: SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "600",
  },

  // ── Score card ───────────────────────────────────────────────────────────
scoreCard: {
  marginBottom: SPACING.md,
},

scoreRow: {
  flexDirection: "row",
  alignItems: "center",
},

teamNamesRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginTop: SPACING.xs + 2,
},

teamSide: {
  flex: 1,
  alignItems: "center",
},

scoreContainer: {
  width: 120,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
},

scoreSpacer: {
  width: 120,
},

teamLogo: {
  width: 50,
  height: 50,
},

teamName: {
  fontSize: FONT_SIZE.sm,
  fontWeight: "600",
  color: COLORS.text.blackWhite,
  textAlign: "center",
},


  scoreText: {
    fontSize: 44,
    fontWeight: "800",
    color: COLORS.text.info,
  },

  colon: {
    fontSize: 28,
    color: COLORS.text.info,
    marginHorizontal: 4,
  },

  // ── Match info row ────────────────────────────────────────────────────────
  matchInfo: {
    justifyContent: "center",
    gap: SPACING.lg * 0.25,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  infoText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.subtle,
  },

  // ── Tabs ─────────────────────────────────────────────────────────────────
  tabsContainer: {
    marginHorizontal: 0,
  },

  tabsList: {
    flexDirection: "row",
    backgroundColor: COLORS.backgrounds.screen,
    borderBottomColor: COLORS.border,
  },

  tabTrigger: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    color: COLORS.primary,
  },

  activeTab: {
    borderBottomColor: COLORS.text.blackWhite,
    borderBottomWidth: 2,
  },

  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  tabContent: {
    borderTopColor: COLORS.textSecondary,
    borderTopWidth: 1,
  },

  // ── Timeline ──────────────────────────────────────────────────────────────
  halfHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
  },

  halfHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  halfHeaderScore: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    minHeight: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borders.subtle,
    gap: 6,
    backgroundColor: COLORS.backgrounds.elevated,
  },

  eventMinuteText: {
    fontSize: 12,
    color: COLORS.textMuted,
    width: 26,
  },

  eventMinuteTextRight: {
    fontSize: 12,
    color: COLORS.textMuted,
    width: 26,
    textAlign: "right",
  },

  eventSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  eventSideRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },

  eventPlayer: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
  },

  eventAssist: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  eventScore: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
  },

  eventIconText: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },

  cardIcon: {
    width: 10,
    height: 14,
    borderRadius: 2,
  },

  lineupSection: {
    width: "100%",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
  },

  // ── Formação ──────────────────────────────────────────────────────────────
  lineupSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
  },

  lineupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    minHeight: 44,
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.borders.default,
    gap: 10,
    backgroundColor: COLORS.backgrounds.screen,
  },

  lineupPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  lineupAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  lineupAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  lineupName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
  },

  lineupPosition: {
    fontSize: 12,
    color: COLORS.text.blackWhite,
  },

  // ── Stats ─────────────────────────────────────────────────────────────────
  statsCard: {
    backgroundColor: COLORS.backgrounds.elevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.borders.default,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
  },

  statsLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  possessionBar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceLight,
    marginTop: 4,
    marginBottom: SPACING.sm,
  },

  possessionHome: {
    backgroundColor: COLORS.primary,
    height: "100%",
  },

  possessionAway: {
    backgroundColor: COLORS.border,
    height: "100%",
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    gap: SPACING.sm,
  },
}));

// ─── Picker de jogadores ────────────────────────────────────────────────────
export const pickerStyles = {
  progressRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: SPACING.sm,
  },
  step: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
  },
  stepActive: {
    backgroundColor: COLORS.primaryLight,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: COLORS.primary,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
};

export const eventStyles = {
  searchRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    padding: 0,
  },
  playerList: {
    borderRadius: RADIUS.lg,
    overflow: "hidden" as const,
    backgroundColor: COLORS.surface,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playerItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: SPACING.md,
    paddingVertical: 11,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  playerItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  playerAvatarText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: COLORS.primaryDark,
  },
  playerName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.blackWhite,
    fontWeight: "500" as const,
  },
  playerNameActive: {
    color: COLORS.primary,
    fontWeight: "700" as const,
  },
  noResults: {
    textAlign: "center" as const,
    padding: SPACING.md,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  selectedBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start" as const,
  },
  selectedBadgeText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: "700" as const,
  },
};
