import { StyleSheet } from "react-native";
import { COLORS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.effect.live,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
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
