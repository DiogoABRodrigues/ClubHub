import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Separador de parte ────────────────────────────────────────────────────
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
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  halfHeaderScore: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  // ── Linha de evento ───────────────────────────────────────────────────────
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    minHeight: 40,
    borderBottomColor: COLORS.border,
    gap: 6,
    backgroundColor: COLORS.surface,
  },

  // ── Minuto ────────────────────────────────────────────────────────────────
  eventMinuteText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
    width: 26,
  },

  eventMinuteTextRight: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
    width: 26,
    textAlign: "right",
  },

  // ── Lados (casa / fora) ───────────────────────────────────────────────────
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

  // ── Texto ─────────────────────────────────────────────────────────────────
  eventPlayer: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  eventAssist: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // ── Resultado parcial ─────────────────────────────────────────────────────
  eventScore: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,     // verde — golo a favor
  },

  // ── Ícone de evento ───────────────────────────────────────────────────────
  eventIconText: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },

  // ── Cartão físico (amarelo / vermelho) ────────────────────────────────────
  cardIcon: {
    width: 10,
    height: 14,
    borderRadius: 2,
  },

  // ── Estado vazio ─────────────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    gap: SPACING.sm,
  },
});