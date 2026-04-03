import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const modalStyles = StyleSheet.create({
overlay: {
  zIndex: 1,
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
    borderBottomColor: COLORS.border,
  },

  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  sheetContent: {
    padding: 20,
    gap: 12,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },

  input: {
    borderRadius: 10,
    borderColor: COLORS.surface,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  textAreaLarge: {
    minHeight: 140,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  saveBtnDisabled: {
    opacity: 0.6,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },

  chipActive: {
    backgroundColor: COLORS.primary + "20",
  },
});
