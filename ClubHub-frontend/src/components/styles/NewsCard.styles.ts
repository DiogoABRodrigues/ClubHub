import { StyleSheet } from "react-native";
import { COLORS, createThemedStyles, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = createThemedStyles(() => ({
  // ── Featured (primeira notícia) ───────────────────────────────────────────
  featuredCard: {
    backgroundColor: COLORS.backgrounds.elevated,
    borderRadius: 12,
    border: 0.5,
    borderColor: COLORS.borders.default,
    overflow: "hidden",
    marginBottom: SPACING.md,
    borderWidth: 0.5,
  },

  featuredImage: {
    width: "100%",
    height: 180,
  },

  featuredPlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  featuredBody: {
    padding: SPACING.sm + 4,
    gap: 4,
  },

  featuredDate: {
    fontSize: 11,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  featuredTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    lineHeight: 22,
    letterSpacing: -0.2,
  },

  featuredExcerpt: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    lineHeight: 17,
  },

  // ── Compact (restantes) ───────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borders.default,
    gap: SPACING.sm + 2,
    alignItems: "flex-start",
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    flexShrink: 0,
  },

  placeholder: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  placeholderEmoji: {
    fontSize: 20,
  },

  content: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  dateText: {
    fontSize: 11,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  title: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    lineHeight: 18,
  },

  excerpt: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    lineHeight: 17,
  },

  // unused legacy
  topRow: {},
  dateRow: {},
  categoryBadge: {},
  categoryText: {},
  authorRow: {},
  authorText: {},
}));