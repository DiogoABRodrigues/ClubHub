import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },

  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: RADIUS.sm,
    marginHorizontal: 2,
  },

  stepContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji: {
    fontSize: 40,
  },

  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  section: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 6,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },

  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamCard: {
    width: '48%',
    padding: SPACING.md,
    borderWidth: 2,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  teamCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  teamEmoji: {
    fontSize: 24,
  },
  teamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  teamLevel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: FONT_SIZE.md,
  },

  backButton: {
    width: '100%',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.textSecondary,
  },

  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  notificationTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  notificationSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});