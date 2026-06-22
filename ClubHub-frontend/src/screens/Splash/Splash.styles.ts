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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorIconText: {
    color: COLORS.error,
    fontSize: 28,
    fontWeight: "800",
  },
  errorTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 13,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
