import { StyleSheet } from "react-native";
import { COLORS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.destructive,
  },

  text: {
    fontSize: 10,
    color: COLORS.destructive,
    fontWeight: "600",
  },
}));
