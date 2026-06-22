import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 240,
    height: 240,
  },
  preWarm: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
    overflow: "hidden",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 72,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  errorContainer: {
    position: "absolute",
    bottom: 56,
    width: "84%",
    alignItems: "center",
  },
  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
});
