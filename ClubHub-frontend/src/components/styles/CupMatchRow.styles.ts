import { COLORS, FONT_SIZE, RADIUS, SPACING, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background.app
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
    fontWeight: "500",
  },

  loser: {
    color: COLORS.textSecondary,
  },

  appTeam: {
    color: COLORS.primary,
  },

  scoreBox: {
    backgroundColor: COLORS.background.app,
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
    color: COLORS.text.blackWhite,
    letterSpacing: 0.5,
  },

  dateText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.blackWhite,
    fontWeight: "400",
  },

  meta: {
    marginTop: SPACING.xs,
  },

  metaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.blackWhite,
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
}));
