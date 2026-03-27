import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  upcoming: {
    fontSize: 12,
    color: COLORS.secondary,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  finished: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: "#EEE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  teams: {
    gap: 10,
  },

  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  teamLogo: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  teamLogoAlt: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },

  teamName: {
    color: COLORS.textPrimary,
    flex: 1,
  },

  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 8,
    gap: 6,
  },

  venue: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  category: {
    marginLeft: "auto",
    fontSize: 11,
    backgroundColor: "#EEE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
