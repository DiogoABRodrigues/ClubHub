import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../theme/colors";

export const styles = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.backgroundWhite,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  teamName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },

  teamNameRight: {
    textAlign: "right",
  },

  winner: {
    color: COLORS.textSecondary,
    fontWeight: "700",
  },

  loser: {
    color: COLORS.textSecondary,
    opacity: 0.45,
  },

  appTeam: {
    color: COLORS.primary,
  },

  scoreBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm + 2,
    marginHorizontal: SPACING.sm,
    minWidth: 60,
    alignItems: "center",
  },

  scoreText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  dateText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },

  meta: {
    marginTop: SPACING.xs,
  },

  metaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    opacity: 0.6,
  },

  teamLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    margin: 10,
  },
  teamContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  teamContainerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
