import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.textPrimary },

  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl * 2 },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoTitle: { fontSize: FONT_SIZE.sm, fontWeight: '600', marginBottom: 2, color: COLORS.textPrimary },
  infoDescription: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },

  section: { marginBottom: SPACING.lg },

  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.md },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  toggleTitle: { fontSize: FONT_SIZE.sm, fontWeight: '600', marginBottom: 2, color: COLORS.textPrimary },
  toggleDescription: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },

  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', marginBottom: SPACING.sm, color: COLORS.textPrimary },
  teamCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  teamRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  teamTitle: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textPrimary },
  teamSubtitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },

  saveButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  saveButtonText: { color: COLORS.background, fontWeight: '600', fontSize: FONT_SIZE.md },
});