import { StyleSheet, Platform } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../theme/colors";
import { Dimensions } from "react-native";
const { height } = Dimensions.get("window");

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
    flexDirection: "column",
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
    marginBottom: 8,
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
  sheetSubtitle: {
  fontSize: 13,
  color: COLORS.textSecondary,
  marginTop: 2,
},
sheetTall: {
  height: height * 0.75,
},
// Indicador de fase
phaseIndicator: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 10,
  gap: 8,
},
phaseStep: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  backgroundColor: COLORS.surface,
},
phaseStepActive: {
  backgroundColor: COLORS.primary + "18",
  borderWidth: 1,
  borderColor: COLORS.primary,
},
phaseStepText: {
  fontSize: 13,
  color: COLORS.textSecondary,
  fontWeight: "500",
},
phaseStepTextActive: {
  color: COLORS.primary,
  fontWeight: "600",
},
phaseDivider: {
  flex: 1,
  height: 1,
  backgroundColor: COLORS.surface,
},

// Search
searchRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginHorizontal: 20,
  marginBottom: 10,
  backgroundColor: COLORS.surface,
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
},
searchInput: {
  flex: 1,
  fontSize: 14,
  color: COLORS.textPrimary,
},

// Grid de jogadores
playerGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  padding: 16,
  gap: 10,
  paddingBottom: 30
},
playerCard: {
  width: "22%",
  alignItems: "center",
  padding: 8,
  borderRadius: 12,
  backgroundColor: COLORS.surface,
  position: "relative",
},
playerCardSelected: {
  backgroundColor: COLORS.primary + "14",
  borderWidth: 1.5,
  borderColor: COLORS.primary,
},
playerCardPhoto: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginBottom: 6,
},
playerCardAvatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: COLORS.primary + "22",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 6,
},
playerCardAvatarText: {
  fontSize: 16,
  fontWeight: "700",
  color: COLORS.primary,
},
playerCardName: {
  fontSize: 11,
  color: COLORS.textSecondary,
  textAlign: "center",
  marginTop: 2,
},
playerCardNameSelected: {
  color: COLORS.primary,
  fontWeight: "600",
},
playerCardCheck: {
  position: "absolute",
  top: 4,
  right: 4,
},
emptyText: {
  color: COLORS.muted,
  fontSize: 14,
  textAlign: "center",
  marginTop: 40,
  width: "100%",
},

// Footer
sheetFooter: {
  paddingHorizontal: 20,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: COLORS.surface,
},
footerRow: {
  flexDirection: "row",
  gap: 10,
},
saveBtnSecondary: {
  backgroundColor: "transparent",
  borderWidth: 1.5,
  borderColor: COLORS.primary,
  marginTop: 8,
},
saveBtnSecondaryText: {
  color: COLORS.primary,
  fontSize: 15,
  fontWeight: "700",
},
saveBtnFlex: {
  flex: 1,
},
lineupSectionTitle: {
  fontSize: 13,
  fontWeight: "600",
  color: COLORS.textSecondary,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginTop: 16,
  marginBottom: 8,
  paddingHorizontal: 4,
},
lineupRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.border,
  gap: 10,
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
  backgroundColor: COLORS.surface,
  justifyContent: "center",
  alignItems: "center",
},
lineupAvatarText: {
  fontSize: 12,
  fontWeight: "600",
  color: COLORS.textSecondary,
},
lineupName: {
  flex: 1,
  fontSize: 14,
  fontWeight: "500",
  color: COLORS.textPrimary,
},
lineupPosition: {
  fontSize: 12,
  color: COLORS.textSecondary,
},
 switchRow:{
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.surface,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
},
 
 switchSubtext:  {
  fontSize: 12,
  color: COLORS.muted,
  marginTop: 2,
},
 
 substitutionDivider:   {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginVertical: 4,
},
 
substitutionDividerLine:  {
  flex: 1,
  height: 1,
  backgroundColor: COLORS.surface,
},
 
 substitutionDividerText:   {
  fontSize: 12,
  fontWeight: "600",
  color: COLORS.textSecondary,
  textTransform: "uppercase",
  letterSpacing: 0.5,
}
});