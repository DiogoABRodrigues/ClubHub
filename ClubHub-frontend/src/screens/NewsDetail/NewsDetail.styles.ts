import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../theme/colors';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  content: { paddingHorizontal: SPACING.md},

  featuredImage: {
    width: screenWidth, // ocupa toda a tela
    height: 250,
    borderRadius: 0,
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.md, // cancela o padding do ScrollView
  },
  placeholderImage: {
    width: screenWidth,
    height: 250,
    borderRadius: 0,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.md,
  },
  logoEmoji: { fontSize: FONT_SIZE.xl },

  categoryBadgeContainer: { marginBottom: SPACING.sm },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    color: COLORS.background,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },

  newsTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', marginBottom: SPACING.sm },

  metaRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  metaText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },

  excerpt: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginBottom: SPACING.md },
  contentText: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, lineHeight: 20 },

  relatedContainer: { marginTop: SPACING.lg },
  relatedTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', marginBottom: SPACING.sm },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  relatedImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  relatedTextContainer: { flex: 1, minWidth: 0 },
  relatedNewsTitle: { fontSize: FONT_SIZE.sm, fontWeight: '600', marginBottom: SPACING.xs },
  relatedDate: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },

  noNewsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noNewsText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  backLink: { fontSize: FONT_SIZE.sm, color: COLORS.primary, marginTop: SPACING.sm },
});