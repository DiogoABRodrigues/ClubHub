import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.md,
  },

  // ── Header da tabela ──────────────────────────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.xs,
  },

  headerCell: {
    // Flex será aplicado dinamicamente
  },

  headerText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Texto de apoio ────────────────────────────────────────────────────────
  statsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginVertical: SPACING.sm,
  },

  // ── Legenda ───────────────────────────────────────────────────────────────
  legend: {
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceLight,
    marginTop: SPACING.md,
  },

  legendTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    marginBottom: SPACING.sm,
  },

  legendItems: {
    gap: SPACING.sm,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.sm,
  },

  legendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.blackWhite,
    flex: 1,
  },

  // ── Empty / loading ───────────────────────────────────────────────────────
  noMatches: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },

  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  logoEmoji: {
    fontSize: FONT_SIZE.xl,
  },

  noMatchesText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },

  // ── Category pills (se usares filtros) ───────────────────────────────────
  categoryContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
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
    paddingVertical: 10,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
  },

  // ── Tabela completa (wrapper) ──────────────────────────────────────────────
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },

  // ── Taça: bloco de ronda ───────────────────────────────────────────────────
  cupRoundBlock: {
    marginBottom: SPACING.sm,
  },

  roundLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: COLORS.borders.brandSoft,
    marginTop: SPACING.md,
  },
}));
