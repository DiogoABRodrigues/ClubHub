import React, { useMemo, useCallback, useState } from "react";
import { View, Text, SectionList, RefreshControl } from "react-native";
import { COLORS } from "../../theme/colors";
import { useStandings } from "../../hooks/useStandings";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useMatches } from "../../hooks/useMatches";
import { LeagueTableRow } from "../../components/LeagueTableRow";
import { CupMatchRow } from "../../components/CupMatchRow";
import { styles } from "./Standings.styles";
import { LegendItem } from "../../models/Competition";
import { useSelectedSeason } from "../../contexts/Selectedseasoncontext";
import { Match } from "../../models/Match";
import { useAuth } from "../../contexts/AuthContext";
import { EmptyState } from "../../components/EmptyState";
import { useTeams } from "../../hooks/useTeams";
import { useTheme } from "../../contexts/ThemeContext";

type LeagueSection = {
  type: "league";
  competitionId: number;
  competitionName: string;
  legend: LegendItem[];
  data: any[];
};

type CupRound = {
  round: string;
  matches: Match[];
};

type CupSection = {
  type: "cup";
  competitionId: number;
  competitionName: string;
  rounds: CupRound[];
  data: CupRound[];
};

type Section = LeagueSection | CupSection;

const COLS = {
  position: 1,
  team: 5,
  played: 1,
  goalDiff: 1,
  points: 1,
};

function sortRounds(a: CupRound, b: CupRound): number {
  const aRound = a.round.trim().toUpperCase();
  const bRound = b.round.trim().toUpperCase();

  const order = ["F", "MF", "QF", "1/8", "1/16"];
  const aIdx = order.indexOf(aRound);
  const bIdx = order.indexOf(bRound);

  return aIdx - bIdx;
}

export const Standings = React.memo(function Standings({ navigation }: any) {
  const { adminMode } = useAuth();
  const { mode } = useTheme();
  const { standings, loading: standingsLoading, refreshStandings } = useStandings();
  const { competitions, loading: competitionsLoading, refreshCompetitions } = useCompetitions();
  const { matches } = useMatches();
  const { teams } = useTeams();
  const { selectedSeason: currentSeason } = useSelectedSeason();

  const navigateToMatchDetail = (matchId: number) => {
    navigation.navigate(adminMode ? "AdminMatchDetail" : "MatchDetail", {
      id: matchId,
    });
  };

  const [refreshing, setRefreshing] = useState(false);

  const teamLogos = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      map.set(team.name.trim().toLowerCase(), team.logoUrl ?? "");
    }
    return map;
  }, [teams]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshStandings(), refreshCompetitions()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshStandings, refreshCompetitions]);

  const sections = useMemo<Section[]>(() => {
    if (!currentSeason || !competitions.length) return [];

    const seasonCompetitions = competitions.filter(
      (c) => c.seasonId === currentSeason.id,
    );

    const result: Section[] = [];

    for (const comp of seasonCompetitions) {
      const isCup = comp.name.toLowerCase().includes("taça");

      if (isCup) {
        const competitionMatches = matches.filter(
          (m) => m.competitionId === comp.id,
        );

        if (competitionMatches.length === 0) continue;

        const roundMap = new Map<string, Match[]>();

        competitionMatches.forEach((match) => {
          const round = match.round ?? "Sem ronda";

          if (!roundMap.has(round)) {
            roundMap.set(round, []);
          }

          roundMap.get(round)!.push(match);
        });

        const rounds: CupRound[] = Array.from(roundMap.entries())
          .map(([round, roundMatches]) => ({
            round,
            matches: roundMatches.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            ),
          }))
          .sort(sortRounds);

        result.push({
          type: "cup",
          competitionId: comp.id,
          competitionName: comp.name,
          rounds,
          data: rounds,
        });
      } else {
        const competitionStandings = standings
          .filter((s) => s.competitionId === comp.id)
          .sort((a, b) => a.position - b.position);

        if (competitionStandings.length === 0) continue;

        result.push({
          type: "league",
          competitionId: comp.id,
          competitionName: comp.name,
          legend: comp.legend ?? [],
          data: competitionStandings,
        });
      }
    }

    return result;
  }, [competitions, standings, matches, currentSeason]);

  const renderItem = ({ item, section }: { item: any; section: Section }) => {
    if (section.type === "league") {
      return (
        <LeagueTableRow
          standing={item}
          teamLogo={teamLogos.get(item.teamName.trim().toLowerCase())}
        />
      );
    }

    const round = item as CupRound;

    return (
      <View style={styles.cupRoundBlock}>
        <Text style={styles.roundLabel}>{round.round}</Text>

        {round.matches.map((match) => (
          <CupMatchRow
            onPress={() => navigateToMatchDetail(match.id)}
            key={match.id}
            match={match}
          />
        ))}
      </View>
    );
  };

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => (
      <View>
        <Text style={styles.sectionTitle}>{section.competitionName}</Text>

        {section.type === "league" && (
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, { flex: COLS.position }]}>
              <Text style={styles.headerText}></Text>
            </View>

            <View style={[styles.headerCell, { flex: COLS.team }]}>
              <Text style={styles.headerText}></Text>
            </View>

            <View
              style={[
                styles.headerCell,
                {
                  flex: COLS.played,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={styles.headerText}>J</Text>
            </View>

            <View
              style={[
                styles.headerCell,
                {
                  flex: COLS.goalDiff,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={styles.headerText}>DG</Text>
            </View>

            <View
              style={[
                styles.headerCell,
                {
                  flex: COLS.points,
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text style={styles.headerText}>PTS</Text>
            </View>
          </View>
        )}
      </View>
    ),
    [],
  );

  const renderSectionFooter = useCallback(
    ({ section }: { section: Section }) => {
      if (section.type !== "league" || section.legend.length === 0) {
        return null;
      }

      return (
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda</Text>

          <View style={styles.legendItems}>
            {section.legend.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    {
                      backgroundColor: item.color,
                    },
                  ]}
                />

                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.sectionSeparator} />
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item?.id?.toString() ?? item?.round ?? String(index),
    [],
  );

  const isLoading = standingsLoading || competitionsLoading;

  if (!isLoading && sections.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <EmptyState
          title="Não foi possível encontrar informação"
          message="Por favor tenta novamente mais tarde."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        extraData={mode}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
});
