import { StyleSheet } from "react-native";
import { COLORS, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
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
    color: COLORS.white,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.overlayImage,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.status.errorLight,
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
    color: COLORS.text.blackWhite,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    color: COLORS.text.blackWhite,
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
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
}));
