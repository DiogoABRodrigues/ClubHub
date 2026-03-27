import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: SPACING.md,
  },
  teamName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  positionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 140,
    marginBottom: SPACING.sm,
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },
  playerPosition: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});
