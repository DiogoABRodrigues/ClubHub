import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
  halfHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    marginBottom: 2,
  },
  halfHeaderText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  halfHeaderScore: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    minHeight: 36,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    gap: 6,
  },
  eventMinuteText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 26,
  },
  eventMinuteTextRight: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 26,
    textAlign: "right",
  },
  eventSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  eventSideRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  eventPlayer: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  eventAssist: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  eventScore: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.success,
  },
  eventIconText: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },
  cardIcon: {
    width: 10,
    height: 14,
    borderRadius: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
});
