import { StyleSheet } from "react-native";
import { COLORS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.text.blackWhite,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.text.dark,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
}));
