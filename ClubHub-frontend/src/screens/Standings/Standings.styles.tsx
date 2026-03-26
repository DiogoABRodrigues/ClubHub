import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { borderBottomWidth: 1, borderBottomColor: '#333' },
  headerContent: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },

  categoryScroll: { paddingHorizontal: 16, paddingBottom: 8 },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  categorySelected: { backgroundColor: '#0ea5e9' },
  categoryUnselected: { backgroundColor: '#333' },
  categoryTextSelected: { color: '#fff' },
  categoryTextUnselected: { color: '#999' },

  content: { padding: 16 },
  leagueHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  leagueTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },

  table: { borderWidth: 1, borderColor: '#333', borderRadius: 12, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1f1f1f', padding: 8 },
  tableCell: { fontSize: 12, color: '#999' },
  col1: { flex: 1 },
  col5: { flex: 5 },
  col2: { flex: 2 },
  centerText: { textAlign: 'center' },
  rightText: { textAlign: 'right' },

  legend: { marginTop: 16, borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 12 },
  legendTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 8 },
  legendItems: { gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendColor: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, color: '#999' },

  statsText: { fontSize: 12, color: '#999', marginTop: 8 },

  noData: { padding: 24, alignItems: 'center' },
  noDataText: { fontSize: 14, color: '#999' },
});