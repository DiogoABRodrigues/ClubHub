import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },

  // ── Header da tabela ──────────────────────────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  tableCell: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // ── Colunas (proporções) ──────────────────────────────────────────────────
  col1: { flex: 1 },
  col5: { flex: 5 },
  col2: { flex: 2 },
  centerText: { textAlign: "center" },
  rightText: { textAlign: "right" },

  // ── Texto de apoio ────────────────────────────────────────────────────────
  statsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginVertical: SPACING.sm,
  },

  // ── Legenda ───────────────────────────────────────────────────────────────
  legend: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
  },

  legendTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
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
    color: "#FFFFFF",
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
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
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
});