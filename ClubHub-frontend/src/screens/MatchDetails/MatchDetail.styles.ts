import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../theme/colors'; // ou ajusta para o teu constants

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
    position: 'absolute',
    left: SPACING.md,
    top: SPACING.lg,
    padding: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  teamEmoji: {
    fontSize: 28,
  },
  teamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  colon: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  matchInfo: {
    justifyContent: 'space-around',
    marginTop: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabContent: {
    gap: SPACING.md,
  },

  // Timeline Events
  eventCard: {
    flexDirection: 'row',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  eventMinuteText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  eventInfo: {
    flex: 1,
  },
  eventTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  eventTypeText: {
    fontSize: FONT_SIZE.sm,
    textTransform: 'capitalize',
  },
  eventPlayer: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardIcon: {
    width: 12,
    height: 16,
    borderRadius: 2,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },

  // Stats
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  statsLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  possessionBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceLight,
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  possessionHome: {
    backgroundColor: COLORS.primary,
    height: '100%',
  },
  possessionAway: {
    backgroundColor: COLORS.textSecondary,
    height: '100%',
  },

  teamLogo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});