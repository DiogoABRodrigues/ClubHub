import React, { useMemo, useCallback } from "react";
import { View, Text, SectionList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useStandings } from "../../hooks/useStandings";
import { useCompetitions } from "../../hooks/useCompetitions";
import { LeagueTableRow } from "../../components/LeagueTableRow";
import { CupMatchRow } from "../../components/CupMatchRow";
import { styles } from "./Standings.styles";
import { LegendItem } from "../../models/Competition";
import { useSelectedSeason } from "../../contexts/Selectedseasoncontext";
import { useAuth } from "../../contexts/AuthContext";
import { EmptyState } from "../../components/EmptyState";
import { MatchService, CupRound } from "../../services/MatchService";

type LeagueSection = {
  type: "league";
  competitionId: number;
  competitionName: string;
  legend: LegendItem[];
  data: any[];
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

// Hook dedicado para os jogos de uma competição de taça — uma query por competição.
// O backend já devolve os jogos agrupados e ordenados por ronda.
function useCupMatches(competitionId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["matches", "by-competition", competitionId],
    queryFn: () => MatchService.getByCompetitionId(competitionId),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export const Standings = React.memo(function Standings({ navigation }: any) {
  const { adminMode } = useAuth();
  const { standings, loading: standingsLoading } = useStandings();
  const { competitions, loading: competitionsLoading } = useCompetitions();
  const { selectedSeason: currentSeason } = useSelectedSeason();

  const navigateToMatchDetail = (matchId: number) => {
    navigation.navigate(adminMode ? "AdminMatchDetail" : "MatchDetail", {
      id: matchId,
    });
  };

  // Separar competições da época em liga e taça — não depende de matches.
  const { leagueComps, cupComps } = useMemo(() => {
    if (!currentSeason || !competitions.length)
      return { leagueComps: [], cupComps: [] };

    const seasonComps = competitions.filter(
      (c) => c.seasonId === currentSeason.id,
    );

    return {
      leagueComps: seasonComps.filter(
        (c) => !c.name.toLowerCase().includes("taça"),
      ),
      cupComps: seasonComps.filter((c) =>
        c.name.toLowerCase().includes("taça"),
      ),
    };
  }, [competitions, currentSeason]);

  // Uma query por competição de taça. Hooks têm de ser no nível do componente,
  // por isso limitamos a 3 taças (caso extremamente improvável de ter mais).
  const cupQuery0 = useCupMatches(cupComps[0]?.id ?? 0, !!cupComps[0]);
  const cupQuery1 = useCupMatches(cupComps[1]?.id ?? 0, !!cupComps[1]);
  const cupQuery2 = useCupMatches(cupComps[2]?.id ?? 0, !!cupComps[2]);

  const cupQueries = [cupQuery0, cupQuery1, cupQuery2].slice(0, cupComps.length);

  // Secções de liga — depende apenas de standings + leagueComps.
  const leagueSections = useMemo<LeagueSection[]>(() => {
    return leagueComps
      .map((comp) => {
        const competitionStandings = standings
          .filter((s) => s.competitionId === comp.id)
          .sort((a, b) => a.position - b.position);

        if (competitionStandings.length === 0) return null;

        return {
          type: "league" as const,
          competitionId: comp.id,
          competitionName: comp.name,
          legend: comp.legend ?? [],
          data: competitionStandings,
        };
      })
      .filter(Boolean) as LeagueSection[];
  }, [leagueComps, standings]);

  // Secções de taça — depende dos dados já agrupados vindos do backend.
  const cupSections = useMemo<CupSection[]>(() => {
    return cupComps
      .map((comp, i) => {
        const rounds = cupQueries[i]?.data;
        if (!rounds || rounds.length === 0) return null;

        return {
          type: "cup" as const,
          competitionId: comp.id,
          competitionName: comp.name,
          rounds,
          data: rounds,
        };
      })
      .filter(Boolean) as CupSection[];
  }, [cupComps, cupQuery0.data, cupQuery1.data, cupQuery2.data]);

  const sections: Section[] = [...leagueSections, ...cupSections];

  const renderItem = ({ item, section }: { item: any; section: Section }) => {
    if (section.type === "league") {
      return <LeagueTableRow standing={item} />;
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

  const isLoading =
    standingsLoading ||
    competitionsLoading ||
    cupQueries.some((q) => q.isLoading);

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
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
});
