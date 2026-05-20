import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, RADIUS } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Linha de evento ───────────────────────────────────────────────────────
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    minHeight: 44,
    borderBottomWidth: 0.8,
    borderBottomColor: "#E5E7EB",
    gap: 6,
    backgroundColor: "#FFFFFF",
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
    color: "#111827",
  },

  eventAssist: {
    fontSize: 12,
    color: "#6B7280",
  },

  // ── Resultado parcial ─────────────────────────────────────────────────────
  eventScore: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },

  // ── Ícone de evento ───────────────────────────────────────────────────────
  eventIconText: {
    fontSize: 14,
    width: 30,
    textAlign: "center",
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
});
