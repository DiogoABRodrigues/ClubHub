import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, FONT_SIZE } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },

  backText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    marginBottom: SPACING.xs,
  },

  // ── Filtros de categoria ──────────────────────────────────────────────────
  categoryScroll: {
    flexDirection: "row",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },

  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },

  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // ── Toggle vista (grelha / lista) ─────────────────────────────────────────
  viewToggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },

  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
  },

  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },

  toggleText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },

  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // ── Lista ─────────────────────────────────────────────────────────────────
  squadList: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xl,
  },

  // ── Card de jogador (grelha) ──────────────────────────────────────────────
  card: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  playerPhotoWrapper: {
    position: "relative",
    marginBottom: SPACING.xs,
  },

  playerPhoto: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
  },

  statsPhoto: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
  },

  // ── Badge com número ──────────────────────────────────────────────────────
  numberBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  numberBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.xs,
  },

  // ── Info do jogador ───────────────────────────────────────────────────────
  playerName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
  },

  playerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  position: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },

  // ── Separador de posição ──────────────────────────────────────────────────
  positionHeader: {
    width: "100%",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.sm,
  },

  positionHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  // ── Tabela de estatísticas (vista lista) ──────────────────────────────────
  statsTable: {
    marginHorizontal: SPACING.md,
  },

  statsHeader: {
    flexDirection: "row",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
  },

  statsHeaderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },

  statsHeaderText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  statsRow: {
    flexDirection: "row",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },

  playerInfo: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  statsText: {
    flex: 1,
    textAlign: "center",
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  goalsText: {
    flex: 1,
    textAlign: "center",
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // ── Modal de imagem ───────────────────────────────────────────────────────
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "90%",
    height: "70%",
  },
});