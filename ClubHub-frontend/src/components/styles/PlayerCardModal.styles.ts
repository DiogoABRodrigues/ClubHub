import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../theme/colors";

const SCREEN_W = Dimensions.get("window").width;
// Em ecrãs pequenos (<380px) a foto fica mais pequena
const PHOTO_COL_W = SCREEN_W < 380 ? 100 : 115;

export const styles = createThemedStyles(() => ({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg + 4,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    elevation: 1,
  },

  closeBtn: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  closeBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },

  // ── Layout ──
  body: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  // ── Coluna foto ──
  photoCol: {
    width: PHOTO_COL_W,
    alignItems: "center",
  },

  numberBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 5,
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  numberBadgeText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.xs,
  },

  photo: {
    width: PHOTO_COL_W - 10,
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: SPACING.xs,
  },

  firstName: {
    fontSize: FONT_SIZE.xs + 1,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    textAlign: "center",
  },

  lastName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },

  positionBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginTop: 2,
  },

  positionText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  // ── Coluna stats ──
  statsCol: {
    flex: 1,
    minWidth: 0, // permite shrink em ecrãs pequenos
  },

  statsTitle: {
    fontSize: FONT_SIZE.xs + 1,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },

  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderColor: COLORS.muted,
    marginBottom: 2,
  },

  // Agrupa a linha da época + (opcionalmente) as sub-linhas por escalão
  seasonGroup: {},

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs + 1,
    borderBottomWidth: 0.5,
    borderColor: COLORS.muted,
  },

  // Caixa fixa para a seta ">" - garante alinhamento igual em todas as linhas,
  // tenham ou não seta (ver PlayerCardModal.tsx)
  chevronBox: {
    width: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // Seta fina ">" - propositadamente leve, não um ícone preenchido
  chevronText: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.primary,
    lineHeight: 14,
  },

  // Época - ocupa o espaço restante e permite wrap
  seasonLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    flexWrap: "nowrap",
    paddingLeft: 4,
  },

  // Época com vários escalões (linha agregada/clicável)
  seasonLabelMulti: {
    fontWeight: "700",
  },

  // Contentor das sub-linhas por escalão, quando a época está expandida
  subRows: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    marginBottom: 2,
    overflow: "hidden",
  },

  subRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    paddingLeft: 20, // alinhado com o texto da época acima (chevronBox + label padding)
    paddingRight: 0,
  },

  subRowDivider: {
    borderTopWidth: 0.5,
    borderColor: COLORS.muted,
  },

  subTagWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  subDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.brand.gold,
  },

  subTagText: {
    fontSize: 10.5,
    fontWeight: "500",
    color: COLORS.text.secondary,
  },

  subStatValue: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },

  // Células numéricas - largura fixa mais pequena
  statCell: {
    alignItems: "center",
    width: 36,
  },

  statValue: {
    fontSize: FONT_SIZE.xs + 1,
    color: COLORS.text.blackWhite,
  },

  goalsHighlight: {
    color: COLORS.success,
  },

  statLabel: {
    fontSize: 10,
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    textAlign: "center",
  },

  // Header label para colunas numéricas
  colCenter: {
    width: 36,
    textAlign: "center",
  },

  noStats: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.muted,
    textAlign: "center",
  },
}));