import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  // ── Header  (fundo azul escuro — dá identidade ao ecrã) ──────────────────
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },

  backButton: {
    position: "absolute",
    left: SPACING.md,
    top: SPACING.xl + 8,
    padding: 8,
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xl,
  },

  fulltimeBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xl,
  },

  badgeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },

  competition: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  // ── Score card ───────────────────────────────────────────────────────────
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
    
  },

  teamContainer: {
    flex: 1,
    alignItems: "center",
    gap: SPACING.xs + 2,
  },

  teamCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  teamEmoji: {
    fontSize: 28,
  },

  teamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  teamLogo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Score numbers ─────────────────────────────────────────────────────────
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.sm,
    gap: 2,
  },

  scoreText: {
    fontSize: 44,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -2,
  },

  colon: {
    fontSize: 28,
    color: "rgba(255,255,255,0.4)",
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
    color: COLORS.textPrimary,
  },

  // ── Tabs ─────────────────────────────────────────────────────────────────
  tabsContainer: {
    marginHorizontal: 0,
  },

  tabsList: {
    flexDirection: "row",
    backgroundColor: COLORS.textPrimary,
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
    borderBottomColor: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
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
    borderBottomColor: COLORS.border,
    gap: 6,
    backgroundColor: COLORS.surface,
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
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
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
    borderBottomColor: "#E5E7EB",
    gap: 10,
    backgroundColor: "#FFFFFF",
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
    color: COLORS.textSecondary,
  },

  lineupPosition: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // ── Stats ─────────────────────────────────────────────────────────────────
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
    fontWeight: "600",
    color: COLORS.textPrimary,
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
});

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
    color: COLORS.textSecondary,
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
