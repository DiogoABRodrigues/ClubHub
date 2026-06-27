import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  // ── Secções ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: SPACING.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.1,
  },

  showMoreInline: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.tertiary,
  },

  showMore: {
    textAlign: "center",
    marginTop: 10,
    color: COLORS.tertiary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  noMatches: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
  },

  noMatchesText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },

  // ── Utilitários (mantidos por compat.) ────────────────────────────────────
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  logoEmoji: {
    fontSize: FONT_SIZE.xl,
  },

  // ── Category filters (se usares no futuro) ───────────────────────────────
  categoryContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
  },

  categoryButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  categoryTextActive: {
    color: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl + 8, // espaço para status bar
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: SPACING.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.destructive,
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
}));
