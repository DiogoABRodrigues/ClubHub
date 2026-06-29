import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../theme/colors";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
  },

  scrollContent: {
    // sem padding aqui — a imagem featured vai full-bleed
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  
  titleContainer: {
    justifyContent: "center",
    marginBottom: 0,
  },

  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
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

  // ── Imagem de destaque (full-bleed, altura dinâmica) ─────────────────────
  featuredImage: {
    width: screenWidth,
    // height é definida dinamicamente no componente via Image.getSize
    marginBottom: SPACING.md,
  },

  placeholderImage: {
    width: screenWidth,
    height: 240,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
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
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.xs,
    alignSelf: "flex-start",
    overflow: "hidden",
  },

  // ── Título e meta ─────────────────────────────────────────────────────────
  newsTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
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
    fontSize: FONT_SIZE.md,
    color: COLORS.text.blackWhite,
    lineHeight: 22,
  },

  // ── Artigos relacionados ──────────────────────────────────────────────────
  relatedContainer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borders.default,
  },

  relatedTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.tertiary,
    letterSpacing: 0.1,
    textTransform: "uppercase",
  },

  relatedCard: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borders.default,
    alignItems: "flex-start",
    gap: SPACING.sm,
  },

  relatedImage: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    overflow: "hidden",
  },

  relatedTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  relatedNewsTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },

  newsExcerpt: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    lineHeight: 17,
  },

  relatedDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    fontWeight: "500",
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
}));