import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../../theme/colors";

export const styles = createThemedStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.screen,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.primary, // só o header fica primary
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.text.inverseMuted,
    marginBottom: 2,
  },

  // ── Section ──────────────────────────────────────────────────────────────
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },

  // ── Card - fundo branco/neutro, sem primary ───────────────────────────────
  card: {
    backgroundColor: COLORS.surfaceLight, // branco - não primary
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borders.default, // cinza suave
    gap: SPACING.md,
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    backgroundColor: COLORS.status.errorSoft, // tint leve do primary (vermelho escuro)
    borderWidth: 1,
    borderColor: COLORS.status.errorBorder,
  },
  cardTextBlock: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text.primary, // quase preto - legível sobre branco
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary, // cinza médio
    lineHeight: 18,
  },

  // ── Info Banner ───────────────────────────────────────────────────────────
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: COLORS.status.warningSoft, // amarelo suave - informativo neutro
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.status.warningBorder,
  },
  infoBannerText: {
    fontSize: 12,
    color: COLORS.status.warningText, // castanho âmbar - contrasta no amarelo
    flex: 1,
    lineHeight: 17,
  },

  // ── Action Button ─────────────────────────────────────────────────────────
  actionButton: {
    backgroundColor: COLORS.primary, // primary só nos botões de ação
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.text.muted,
  },
  actionButtonDone: {
    backgroundColor: COLORS.status.success,
  },
  actionButtonDestructive: {
    backgroundColor: COLORS.status.error,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  spinIcon: {
    opacity: 0.9,
  },
}));
