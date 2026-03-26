import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  userRow: {
    backgroundColor: COLORS.primary + '10', // leve highlight
  },

  position: {
    width: '10%',
  },

  team: {
    width: '40%',
  },

  center: {
    width: '15%',
    alignItems: 'center',
  },

  centerRow: {
    width: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  points: {
    width: '20%',
    alignItems: 'flex-end',
  },

  text: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  mutedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  bold: {
    fontWeight: '600',
  },
});