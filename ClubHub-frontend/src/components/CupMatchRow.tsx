import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Match } from "../models/Match";
import { COLORS } from "../theme/colors";
import { teamConfig } from "../config/teamConfig";
import { Ionicons } from "@expo/vector-icons";
import { useTeams } from "../hooks/useTeams";
import { ZZImage } from "./ZZImage";
import { getPenaltyDisplayScore } from "../utils/dateUtils";
import { styles } from "./styles/CupMatchRow.styles";
import { TouchableOpacity } from "react-native";

interface Props {
  match: Match;
  onPress: () => void;
}

const TeamLogo = ({ uri }: { uri?: string }) => {
  const [failed, setFailed] = React.useState(false);

  if (uri && !failed) {
    return (
      <ZZImage
        uri={uri}
        style={styles.teamLogo}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.teamLogo,
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.05)",
          borderRadius: 4,
        },
      ]}
    >
      <Ionicons name="shield-outline" size={14} color={COLORS.textMuted} />
    </View>
  );
};

export const CupMatchRow = React.memo(({ match, onPress }: Props) => {
  const { teams } = useTeams();
  const appTeamName = teamConfig.name.trim().toLowerCase();

  const homeTeam = match.homeOrAway === "C" ? match.teamName : match.opponent;
  const awayTeam = match.homeOrAway === "F" ? match.teamName : match.opponent;

  const [homeScore, awayScore] = useMemo(() => {
    if (!match.result) return [null, null];
    const penaltyDisplay = getPenaltyDisplayScore(
      match.result,
      match.outcome,
      match.homeOrAway,
      match.decidedByPenalties,
    );
    if (penaltyDisplay) return penaltyDisplay;
    const parts = match.result.split("-");
    return parts.length >= 2 ? [parts[0], parts[1]] : [null, null];
  }, [match.result, match.outcome, match.homeOrAway, match.decidedByPenalties]);

  const teamMap = useMemo(() => {
    const map: Record<string, any> = {};

    teams.forEach((t) => {
      map[t.name.trim().toLowerCase()] = t;
    });

    return map;
  }, [teams]);

  const homeLogo = teamMap[homeTeam.trim().toLowerCase()]?.logoUrl;

  const awayLogo = teamMap[awayTeam.trim().toLowerCase()]?.logoUrl;

  const isFinished = match.status === "finished";

  // Determina o vencedor para realçar o nome
  const homeWon = useMemo(() => {
    if (!isFinished) return false;
    if (match.decidedByPenalties && match.outcome) {
      const weAreHome = match.homeOrAway === "C";
      return match.outcome === "V" ? weAreHome : !weAreHome;
    }
    if (homeScore === null || awayScore === null) return false;
    return parseInt(homeScore) > parseInt(awayScore);
  }, [
    isFinished,
    homeScore,
    awayScore,
    match.decidedByPenalties,
    match.outcome,
    match.homeOrAway,
  ]);

  const awayWon = useMemo(() => {
    if (!isFinished) return false;
    if (match.decidedByPenalties && match.outcome) {
      const weAreHome = match.homeOrAway === "C";
      return match.outcome === "V" ? !weAreHome : weAreHome;
    }
    if (homeScore === null || awayScore === null) return false;
    return parseInt(awayScore) > parseInt(homeScore);
  }, [
    isFinished,
    homeScore,
    awayScore,
    match.decidedByPenalties,
    match.outcome,
    match.homeOrAway,
  ]);

  // Formata a data curta: "15 jun"
  const shortDate = useMemo(() => {
    const d = new Date(match.date);
    return d.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
  }, [match.date]);

  // Verifica se a equipa da app está envolvida (para realçar)
  const isHomeAppTeam = homeTeam.trim().toLowerCase() === appTeamName;
  const isAwayAppTeam = awayTeam.trim().toLowerCase() === appTeamName;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.row}>
        {/* Casa */}
        <View style={styles.teamContainer}>
          <TeamLogo uri={homeLogo} />

          <Text
            style={[
              styles.teamName,
              homeWon && styles.winner,
              !homeWon && isFinished && styles.loser,
              isHomeAppTeam && styles.appTeam,
            ]}
            numberOfLines={1}
          >
            {homeTeam}
          </Text>
        </View>

        {/* Marcador / data */}
        <View style={styles.scoreBox}>
          {isFinished && homeScore !== null ? (
            <>
              <Text style={styles.scoreText}>
                {homeScore} - {awayScore}
              </Text>
              {match.decidedByPenalties && (
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.textMuted,
                    textAlign: "center",
                  }}
                >
                  após g.p.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.dateText}>{shortDate}</Text>
          )}
        </View>

        {/* Fora */}
        <View style={styles.teamContainerRight}>
          <Text
            style={[
              styles.teamName,
              styles.teamNameRight,
              awayWon && styles.winner,
              !awayWon && isFinished && styles.loser,
              isAwayAppTeam && styles.appTeam,
            ]}
            numberOfLines={1}
          >
            {awayTeam}
          </Text>

          <TeamLogo uri={awayLogo} />
        </View>
      </View>

      {/* Meta: data + round info */}
      {(isFinished || match.time) && (
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {isFinished ? shortDate : `${shortDate} · ${match.time ?? ""}`}
            {match.round ? ` · ${match.round}` : ""}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});
