import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: SPACING.xl,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  // O header agora tem só padding - o layout interno (eyebrow + logo)
  // é feito com localStyles em Home.tsx para não poluir este ficheiro.
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl + 8, // espaço para status bar
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },

  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.primaryLight,
  },

  logoEmoji: {
    fontSize: FONT_SIZE.xl,
  },

  // ── Banner de aviso ───────────────────────────────────────────────────────
  statementBanner: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: SPACING.md,
  },

  statementIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs + 2,
    marginBottom: 4,
  },

  statementTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  statementMessage: {
    fontSize: FONT_SIZE.xs,
    lineHeight: 18,
  },

  // ── Secções ───────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: 0.1,
    textTransform: "uppercase",
  },

  // ── Notícias ──────────────────────────────────────────────────────────────
  newsCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
    gap: SPACING.sm + 2,
  },

  relatedImage: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    overflow: "hidden",
  },

  newsContent: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },

  newsTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 19,
  },

  newsExcerpt: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    lineHeight: 17,
  },

  relatedDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // ── Utilitários ───────────────────────────────────────────────────────────
  mutedText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },

  primaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.destructive,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 9,
    alignSelf: "flex-start",
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  livePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
    marginBottom: 4,
  },
}));
