import { StyleSheet, Platform } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../theme/colors";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const adminStyles = StyleSheet.create({
  // ── Botões de controlo no header ──────────────────────────────────────────
  adminActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },

  adminBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs + 2,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },

  adminBtnText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },

  // ── Bottom sheet — base ───────────────────────────────────────────────────
  overlay: {
    flex: 1,
  },

  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  sheet: {
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "88%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  sheetTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  sheetSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  sheetContent: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },

  sheetTall: {
    height: height * 0.75,
  },

  // ── Chips de seleção ──────────────────────────────────────────────────────
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: "transparent",
  },

  chipWide: {
    flex: 1,
    justifyContent: "center",
  },

  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  chipEmoji: {
    fontSize: FONT_SIZE.sm,
  },

  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  chipTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // ── Fields / inputs ───────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },

  input: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  textArea: {
    minHeight: 70,
    paddingTop: SPACING.sm,
    textAlignVertical: "top",
  },

  textAreaLarge: {
    minHeight: 140,
    paddingTop: SPACING.sm,
    textAlignVertical: "top",
  },

  // ── Botão guardar ─────────────────────────────────────────────────────────
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },

  saveBtnDisabled: {
    opacity: 0.55,
  },

  saveBtnText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },

  saveBtnSecondary: {
    width: "20%",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginTop: SPACING.sm,
  },

  saveBtnSecondaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },

  saveBtnFlex: {
    flex: 1,
  },

  // ── Modal ─────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.md,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  modalTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  modalCancelText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: "600",
  },

  modalBackText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: "600",
  },

  dateTimePicker: {
    width: "100%",
    backgroundColor: COLORS.surface,
  },

  // ── Indicador de fase (stepper) ───────────────────────────────────────────
  phaseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },

  phaseStep: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: "transparent",
  },

  phaseStepActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  phaseStepText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  phaseStepTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  phaseDivider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    padding: 0,
  },

  // ── Grid de jogadores ─────────────────────────────────────────────────────
  playerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.xl,
  },

  playerCard: {
    width: "22%",
    alignItems: "center",
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: "transparent",
    position: "relative",
  },

  playerCardSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  playerCardPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: SPACING.xs,
  },

  playerCardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },

  playerCardAvatarText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  playerCardName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },

  playerCardNameSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  playerCardCheck: {
    position: "absolute",
    top: 4,
    right: 4,
  },

  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: 40,
    width: "100%",
  },

  // ── Footer do sheet ───────────────────────────────────────────────────────
  sheetFooter: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  footerRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  // ── Formação (lineup) ─────────────────────────────────────────────────────
  lineupSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
  },

  lineupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    minHeight: 44,
    borderBottomWidth: 0.8,
    borderBottomColor: "#E5E7EB",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },

  lineupPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  lineupAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  lineupAvatarText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  lineupName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  lineupPosition: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  // ── Switch row ────────────────────────────────────────────────────────────
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    borderColor: COLORS.border,
  },

  switchSubtext: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // ── Substituição ─────────────────────────────────────────────────────────
  substitutionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },

  substitutionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  substitutionDividerText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
