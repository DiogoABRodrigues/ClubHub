import { StyleSheet, Platform } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../theme/colors";

export const adminStyles = StyleSheet.create({
  // Botões admin no header
  adminActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  adminBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  adminBtnText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  // Bottom sheet shared
  overlay: {
    flex: 1,
  },
  sheetWrapper: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "88%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.muted,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
    opacity: 0.4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sheetContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 8,
  },

  // Chips
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipWide: {
    flex: 1,
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: COLORS.primary + "18",
    borderColor: COLORS.primary,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Fields
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 70,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    minHeight: 140,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  // Save button
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalCancelText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  modalBackText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  dateTimePicker: {
    width: '100%',
    backgroundColor: COLORS.surface,
  },
});