import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Content
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },

  // Image
  imageSection: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  imagePreview: {
    width: "100%",
    height: 200,
  },
  imagePlaceholder: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: COLORS.muted,
  },

  // Category chips
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + "18",
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Field
  field: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldOptional: {
    fontSize: 11,
    color: COLORS.muted,
    fontStyle: "italic",
  },
  fieldError: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 2,
  },

  // Input
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    minHeight: 200,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: COLORS.muted,
    alignSelf: "flex-end",
    marginTop: 2,
  },

  // Bottom save button
  bottomSaveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  bottomSaveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  imagePickerBtn: {
  backgroundColor: COLORS.primary,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 8,
},
});