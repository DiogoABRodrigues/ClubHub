import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  titleContainer: {
    justifyContent: "center",
    marginBottom: 0, // 🔥 remove qualquer offset vertical
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  headerBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },

  // ── Botão guardar no header ───────────────────────────────────────────────
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    minWidth: 80,
    alignItems: "center",
  },

  saveBtnDisabled: {
    opacity: 0.55,
  },

  saveBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },

  // ── Imagem ────────────────────────────────────────────────────────────────
  imageSection: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.sm,
  },

  imagePreview: {
    width: "100%",
    height: 200,
  },

  imagePlaceholder: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },

  imagePlaceholderText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  imagePickerBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },

  // ── Chips de categoria ────────────────────────────────────────────────────
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },

  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  categoryChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  categoryChipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  categoryChipTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // ── Field ─────────────────────────────────────────────────────────────────
  field: {
    gap: SPACING.xs,
  },

  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  fieldOptional: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },

  fieldError: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: 2,
  },

  // ── Input ─────────────────────────────────────────────────────────────────
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.blackWhite,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  textArea: {
    minHeight: 80,
    paddingTop: SPACING.sm,
    textAlignVertical: "top",
  },

  textAreaLarge: {
    minHeight: 200,
    paddingTop: SPACING.sm,
    textAlignVertical: "top",
  },

  charCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    alignSelf: "flex-end",
    marginTop: 2,
  },

  // ── Botão guardar (rodapé) ────────────────────────────────────────────────
  bottomSaveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },

  bottomSaveBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
}));
