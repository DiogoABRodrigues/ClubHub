import { StyleSheet } from "react-native";
import { COLORS, SPACING, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Linha de evento ───────────────────────────────────────────────────────
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    minHeight: 44,
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.borders.default,
    gap: 6,
    backgroundColor: COLORS.backgrounds.screen,
  },

  // ── Minuto ────────────────────────────────────────────────────────────────
  eventMinuteText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    width: 28,
    textAlign: "left",
  },

  eventMinuteTextRight: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    width: 28,
    textAlign: "right",
  },

  // ── Lados ─────────────────────────────────────────────────────────────────
  eventSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
    color: COLORS.text.blackWhite,
  },

  eventAssist: {
    fontSize: 12,
    color: COLORS.text.blackWhite,
  },

  // ── Resultado parcial ─────────────────────────────────────────────────────
  eventScore: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.status.success,
  },

  // ── Ícone de evento ───────────────────────────────────────────────────────
  eventIconText: {
    fontSize: 14,
    width: 37,
    textAlign: "center",
    color: COLORS.text.blackWhite,
  },

  // ── Cartão físico ─────────────────────────────────────────────────────────
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
}));
