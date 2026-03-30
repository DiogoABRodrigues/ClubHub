import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors"; // ou ajusta para o teu constants

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mutedText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  primaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
  },
  header: {
    backgroundColor: COLORS.surfaceLight,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  backButton: {
    position: "absolute",
    left: SPACING.md,
    top: SPACING.lg,
    padding: 8,
  },
  title: {
    textAlign: "center",
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  upcomingBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  fulltimeBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
  },
  teamContainer: {
    flex: 1,
    alignItems: "center",
  },
  teamCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  teamEmoji: {
    fontSize: 28,
  },
  teamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  colon: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  matchInfo: {
    justifyContent: "space-around",
    marginTop: SPACING.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  // Tabs
  tabsContainer: {
    marginHorizontal: SPACING.md,
  },
  tabsList: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.md,
  },
  tabTrigger: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  tabContent: {
    gap: SPACING.md,
  },

  // Timeline Events
  eventCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  eventMinute: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  eventInfo: {
    flex: 1,
  },
  eventTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  eventTypeText: {
    fontSize: FONT_SIZE.sm,
    textTransform: "capitalize",
  },
  eventDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },
  statsLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  possessionBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
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
    backgroundColor: COLORS.textSecondary,
    height: "100%",
  },

  teamLogo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  lineupSectionTitle: {
  fontSize: 13,
  fontWeight: "600",
  color: COLORS.textSecondary,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginTop: 16,
  marginBottom: 8,
  paddingHorizontal: 4,
},
lineupRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.border,
  gap: 10,
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
  backgroundColor: COLORS.surface,
  justifyContent: "center",
  alignItems: "center",
},
lineupAvatarText: {
  fontSize: 12,
  fontWeight: "600",
  color: COLORS.textSecondary,
},
lineupName: {
  flex: 1,
  fontSize: 14,
  fontWeight: "500",
  color: COLORS.textPrimary,
},
lineupPosition: {
  fontSize: 12,
  color: COLORS.textSecondary,
},
// Timeline Events
halfHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 14,
  paddingVertical: 8,
  backgroundColor: COLORS.surface,
  marginBottom: 2,
},
halfHeaderText: {
  fontSize: 11,
  fontWeight: "500",
  color: COLORS.textSecondary,
  textTransform: "uppercase",
  letterSpacing: 0.4,
},
halfHeaderScore: {
  fontSize: 11,
  fontWeight: "600",
  color: COLORS.textSecondary,
},
eventRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 14,
  paddingVertical: 7,
  minHeight: 36,
  borderBottomWidth: 0.5,
  borderBottomColor: COLORS.border,
  gap: 6,
},
eventMinuteTextRight: {
  fontSize: 12,
  color: COLORS.textSecondary,
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
  fontWeight: "500",
  color: COLORS.textPrimary,
},
eventAssist: {
  fontSize: 12,
  color: COLORS.textSecondary,
},
eventScore: {
  fontSize: 12,
  fontWeight: "600",
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
emptyState: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 48,
},
});

export const pickerStyles = {
  progressRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  step: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  stepActive: {
    backgroundColor: COLORS.primary + "20",
  },
  stepText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: COLORS.primary,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.surface,
  },
};

// ─── Estilos do picker de jogadores ──────────────────────────────────────────
export const eventStyles = {
  searchRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  playerList: {
    borderRadius: 10,
    overflow: "hidden" as const,
    backgroundColor: COLORS.surface,
    maxHeight: 220,
  },
  playerItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  playerItemActive: {
    backgroundColor: COLORS.primary + "12",
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + "22",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  playerAvatarText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: COLORS.primary,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500" as const,
  },
  playerNameActive: {
    color: COLORS.primary,
    fontWeight: "600" as const,
  },
  noResults: {
    textAlign: "center" as const,
    padding: 16,
    color: COLORS.muted,
    fontSize: 13,
  },
  selectedBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.primary + "12",
    borderRadius: 8,
    alignSelf: "flex-start" as const,
  },
  selectedBadgeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600" as const,
  },
};

