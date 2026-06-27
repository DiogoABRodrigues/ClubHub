import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE, createThemedStyles } from "../../theme/colors";

export const styles = createThemedStyles(() => ({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.app,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    marginBottom: 2,
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

  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: FONT_SIZE.xl * 1.1,
  },

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  loadingCard: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borders.default,
  },

  // ── Banner informativo ────────────────────────────────────────────────────
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    backgroundColor: COLORS.brand.tint,
    borderWidth: 1,
    borderColor: COLORS.brand.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 3,
  },

  infoDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    lineHeight: 17,
  },

  // ── Secções ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text.blackWhite,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: SPACING.sm,
    paddingHorizontal: 4,
  },

  // ── Toggle cards ─────────────────────────────────────────────────────────
  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borders.default,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SPACING.md,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.blackWhite,
    marginBottom: 2,
  },

  toggleDescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    lineHeight: 17,
    paddingRight: SPACING.md,
  },

  themeSwitcher: {
    width: "20%",
    height: 42,
    flexDirection: "row",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borders.default,
    backgroundColor: COLORS.backgrounds.muted,
    padding: 3,
    gap: 3,
  },
  themeSwitcherOption: {
    flex: 1,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  themeSwitcherOptionActive: {
    backgroundColor: COLORS.primary,
  },

  // ── Card de equipa ────────────────────────────────────────────────────────
  teamCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borders.default,
  },

  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },

  teamTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.primary,
  },

  teamSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },

  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.lg,
  },

  saveButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
    letterSpacing: 0.2,
  },

  // ── Modal Admin ───────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.backgrounds.overlay,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.surfaceLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.backgrounds.subtle,
    padding: 12,
    borderRadius: 10,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnText: { color: COLORS.white, fontWeight: "700", fontSize: FONT_SIZE.sm },
  cancelText: {
    textAlign: "center",
    color: COLORS.text.muted,
    paddingVertical: 8,
    fontSize: FONT_SIZE.sm,
  },

  // ── Links do clube ────────────────────────────────────────────────────────
  clubLinks: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
    alignItems: "center",
  },
  clubLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    gap: 8,
    width: "60%",
    paddingVertical: 13,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.warning,
  },
  clubLinkBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
    letterSpacing: 0.3,
  },
  dataDisclaimer: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 17,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    textAlign: "center",
  },
  dataSourceLink: {
    color: COLORS.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
}));
