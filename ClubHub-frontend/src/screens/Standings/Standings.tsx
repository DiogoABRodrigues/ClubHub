import React, { useMemo, useCallback, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useStandings } from "../../hooks/useStandings";
import { LeagueTableRow } from "../../components/LeagueTableRow";
import { styles } from "./Standings.styles";

const GREEN_ZONE = 2;
const RED_ZONE = 19;

const COLS = {
  position: 1,
  team: 5,
  played: 1,
  goalDiff: 1,
  points: 1,
};

export const Standings = React.memo(function Standings() {
  useEffect(() => {
    console.log("MOUNT Standings");
  }, []);
  const { standings, loading } = useStandings();

  const sorted = useMemo(() => {
    const arr = standings ? [...standings] : [];
    arr.sort((a, b) => a.position - b.position);
    return arr;
  }, [standings]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <LeagueTableRow standing={item} green={GREEN_ZONE} red={RED_ZONE} />
    ),
    [],
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
            {/* TABLE HEADER */}
            <View style={styles.tableHeader}>
              {/* Position */}
              <View style={[styles.headerCell, { flex: COLS.position }]}>
                <Text style={styles.headerText}></Text>
              </View>

              {/* Team */}
              <View style={[styles.headerCell, { flex: COLS.team }]}>
                <Text style={styles.headerText}></Text>
              </View>

              {/* Played */}
              <View
                style={[
                  styles.headerCell,
                  { flex: COLS.played, alignItems: "center" },
                ]}
              >
                <Text style={styles.headerText}>J</Text>
              </View>

              {/* Goal Diff */}
              <View
                style={[
                  styles.headerCell,
                  { flex: COLS.goalDiff, alignItems: "center" },
                ]}
              >
                <Text style={styles.headerText}>DG</Text>
              </View>

              {/* Points */}
              <View
                style={[
                  styles.headerCell,
                  { flex: COLS.points, alignItems: "flex-end" },
                ]}
              >
                <Text style={styles.headerText}>PTS</Text>
              </View>
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
});
