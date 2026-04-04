import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  titleContainer: {
    justifyContent: "center",
    marginBottom: 0, // 🔥 remove qualquer offset vertical
  },

  backButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 16,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },

  // ── Imagem de destaque (full-bleed) ───────────────────────────────────────
  featuredImage: {
    width: screenWidth,
    height: 240,
    borderRadius: 0,
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.md,
    resizeMode: "cover",
  },

  placeholderImage: {
    width: screenWidth,
    height: 240,
    borderRadius: 0,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.md,
  },

  logoEmoji: {
    fontSize: FONT_SIZE.xl,
  },

  // ── Badge de categoria ────────────────────────────────────────────────────
  categoryBadgeContainer: {
    marginBottom: SPACING.sm,
  },

  categoryBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.xs,
    alignSelf: "flex-start",
    overflow: "hidden",
  },

  // ── Título e meta ─────────────────────────────────────────────────────────
  newsTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 30,
    letterSpacing: -0.4,
  },

  metaRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },

  // ── Corpo do artigo ───────────────────────────────────────────────────────
  excerpt: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 24,
    fontWeight: "500",
  },

  contentText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },

  // ── Artigos relacionados ──────────────────────────────────────────────────
  relatedContainer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  relatedTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    letterSpacing: -0.2,
  },

  relatedCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },

  relatedImage: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    flexShrink: 0,
  },

  relatedTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  relatedNewsTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },

  relatedDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },

  // ── Empty / erro ──────────────────────────────────────────────────────────
  noNewsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
  },

  noNewsText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },

  backLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: SPACING.xs,
  },
});
