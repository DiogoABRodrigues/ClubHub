import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../theme/colors";

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },

  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
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
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
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
