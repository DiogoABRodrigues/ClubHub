import React, { useMemo, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import { useStandings } from "../../contexts/StandingsContext";
import { LeagueTableRow } from "../../components/LeagueTableRow";
import { styles } from "./Standings.styles";

const GREEN_ZONE = 2;
const RED_ZONE = 19;

export const Standings: React.FC = () => {
  const { standings, loading } = useStandings();

  const sorted = useMemo(() => {
    const arr = standings ? [...standings] : [];
    arr.sort((a, b) => a.position - b.position);
    return arr;
  }, [standings]);

const renderItem = useCallback(
  ({ item }: { item: any }) => (
    <LeagueTableRow
      standing={item}
      green={GREEN_ZONE}
      red={RED_ZONE}
    />
  ),
  []
);

  const keyExtractor = useCallback((item: any) => item.id, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          A carregar classificação...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            {/* TABLE HEADER (UI igual ao teu original) */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.col1]}>#</Text>
              <Text style={[styles.tableCell, styles.col5]}>Equipa</Text>
              <Text style={[styles.tableCell, styles.col2, styles.centerText]}>
                J
              </Text>
              <Text style={[styles.tableCell, styles.col2, styles.centerText]}>
                DG
              </Text>
              <Text style={[styles.tableCell, styles.col2, styles.rightText]}>
                PTS
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Legenda</Text>

            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#47d406" }]}
                />
                <Text style={styles.legendText}>
                  Campeão - Promoção à 1ª Divisão Sabseg
                </Text>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#0ee950" }]}
                />
                <Text style={styles.legendText}>
                  Promoção à 1ª Divisão Sabseg
                </Text>
              </View>
            </View>
          </View>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
};