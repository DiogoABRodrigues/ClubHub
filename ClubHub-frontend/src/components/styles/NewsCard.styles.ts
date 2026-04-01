import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: 180,
  },

  placeholder: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderEmoji: {
    fontSize: 48,
  },

  content: {
    padding: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    justifyContent: "space-between",
  },

  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  categoryText: {
    fontSize: 10,
    textTransform: "uppercase",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.textPrimary,
  },

  excerpt: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  authorText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 2,
  },
});
