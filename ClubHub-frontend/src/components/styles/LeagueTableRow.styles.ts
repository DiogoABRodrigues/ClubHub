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

  centerColumn: {
    flex: 2,                 
    justifyContent: 'center',
    alignItems: 'center',    
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

expandedStats: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  backgroundColor: '#f2f2f2',
},
statRow: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginBottom: 4,
},
statLabel: {
  marginRight: 7,
  color: COLORS.textSecondary,
},
statValue: {
  marginRight: 12,
  color: COLORS.textPrimary,
},

teamRow: {
  flex: 5,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
teamLogo: {
  width: 24,
  height: 24,
  borderRadius: 12,
},
});