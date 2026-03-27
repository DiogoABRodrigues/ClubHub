import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  logoEmoji: {
    fontSize: 22,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  newsCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  newsImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  newsEmoji: {
    fontSize: 24,
  },

  newsContent: {
    flex: 1,
  },

  newsTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },

  newsExcerpt: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  relatedImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  relatedDate: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
});
