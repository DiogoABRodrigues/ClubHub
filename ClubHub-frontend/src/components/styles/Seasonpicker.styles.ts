import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  triggerText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  sheet: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  optionSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  optionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  optionTextSelected: {
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
}));
