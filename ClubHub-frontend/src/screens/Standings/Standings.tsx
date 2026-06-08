import React, { useMemo, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import { useStandings } from "../../hooks/useStandings";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useCurrentSeason } from "../../hooks/useCurrentSeason";
import { LeagueTableRow } from "../../components/LeagueTableRow";
import { styles } from "./Standings.styles";
import { LegendItem } from "../../models/Competition";

const COLS = {
  position: 1,
  team: 5,
  played: 1,
  goalDiff: 1,
  points: 1,
};

export const Standings = React.memo(function Standings() {
  const { standings, loading } = useStandings();
  const { competitions } = useCompetitions();
  console.log("Standings render", { standings, competitions });
  const { currentSeasonId } = useCurrentSeason();

  const sorted = useMemo(() => {
    const arr = standings ? [...standings] : [];
    arr.sort((a, b) => a.position - b.position);
    return arr;
  }, [standings]);

  // Pega a legenda da competição da época atual
  const legend = useMemo<LegendItem[]>(() => {
    if (standings.length === 0) return [];
    const { seasonId, competitionId } = standings[0];
    const competition = competitions.find(
      (c) => c.seasonId === seasonId && c.id === competitionId,
    );
    return competition?.legend ?? [];
  }, [competitions, standings]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <LeagueTableRow standing={item} />
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
            <View style={styles.tableHeader}>
              <View style={[styles.headerCell, { flex: COLS.position }]}>
                <Text style={styles.headerText}></Text>
              </View>
              <View style={[styles.headerCell, { flex: COLS.team }]}>
                <Text style={styles.headerText}></Text>
              </View>
              <View style={[styles.headerCell, { flex: COLS.played, alignItems: "center" }]}>
                <Text style={styles.headerText}>J</Text>
              </View>
              <View style={[styles.headerCell, { flex: COLS.goalDiff, alignItems: "center" }]}>
                <Text style={styles.headerText}>DG</Text>
              </View>
              <View style={[styles.headerCell, { flex: COLS.points, alignItems: "flex-end" }]}>
                <Text style={styles.headerText}>PTS</Text>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          legend.length > 0 ? (
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Legenda</Text>
              <View style={styles.legendItems}>
                {legend.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[styles.legendColor, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.legendText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null
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