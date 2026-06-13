import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/LeagueTableRow.styles";
import { COLORS } from "../theme/colors";
import { Standing } from "../models/Standing";
import { useTeams } from "../hooks/useTeams";
import { teamConfig } from "../config/teamConfig";
import { ZZImage } from "./ZZImage";

interface Props {
  standing: Standing;
  isUserTeam?: boolean;
}

const COLS = {
  position: 1,
  team: 5,
  played: 1,
  goalDiff: 1,
  points: 1,
};

// ─── Logo helper ──────────────────────────────────────────────────────────────

const TeamLogo = ({ uri }: { uri?: string }) => {
  const [failed, setFailed] = useState(false);

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

// ─── Main component ───────────────────────────────────────────────────────────

export const LeagueTableRow = React.memo(
  ({ standing, isUserTeam = false }: Props) => {
    const { teams } = useTeams();
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded((prev) => !prev);
    }, []);

    const teamMap = useMemo(() => {
      const map: Record<string, any> = {};
      teams.forEach((t) => {
        map[t.name.trim().toLowerCase()] = t;
      });
      return map;
    }, [teams]);

    const normalizedName = standing.teamName.trim().toLowerCase();
    const teamLogo = teamMap[normalizedName]?.logoUrl;

    //const appTeamName = teamConfig.name.trim().toLowerCase();
    //const isAppTeam = normalizedName === appTeamName;

    const rowBackgroundColor = useMemo(() => {
      //if (isAppTeam) return COLORS.tercearyLight;
      if (standing.rowColor) {
        // Adiciona transparência à cor do zerozero (30% opacidade)
        return standing.rowColor + "4D";
      }
      return COLORS.background;
    }, [standing.rowColor /*isAppTeam*/]);

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={toggleExpand}>
        <View
          style={[
            styles.row,
            { backgroundColor: rowBackgroundColor },
            isUserTeam && styles.userRow,
          ]}
        >
          {/* POSITION */}
          <View style={[styles.cell, { flex: COLS.position }]}>
            <Text style={[styles.text, { color: COLORS.textSecondary }]}>
              {standing.position}
            </Text>
          </View>

          {/* TEAM NAME + LOGO */}
          <View style={[styles.teamRow, { flex: COLS.team }]}>
            <TeamLogo uri={teamLogo} />
            <Text
              style={[styles.text, isUserTeam && styles.bold]}
              numberOfLines={1}
            >
              {standing.teamName}
            </Text>
          </View>

          {/* PLAYED */}
          <View
            style={[styles.cell, { flex: COLS.played, alignItems: "center" }]}
          >
            <Text style={styles.mutedText}>{standing.played}</Text>
          </View>

          {/* GOAL DIFFERENCE */}
          <View
            style={[styles.cell, { flex: COLS.goalDiff, alignItems: "center" }]}
          >
            <Text style={styles.text}>
              {standing.goalDiff > 0 ? "+" : ""}
              {standing.goalDiff}
            </Text>
          </View>

          {/* POINTS */}
          <View
            style={[styles.cell, { flex: COLS.points, alignItems: "flex-end" }]}
          >
            <Text
              style={[styles.text, isUserTeam && { color: COLORS.primary }]}
            >
              {standing.points}
            </Text>
          </View>
        </View>

        {expanded && (
          <View style={styles.expandedStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>V:</Text>
              <Text style={styles.statValue}>{standing.wins}</Text>
              <Text style={styles.statLabel}>E:</Text>
              <Text style={styles.statValue}>{standing.draws}</Text>
              <Text style={styles.statLabel}>D:</Text>
              <Text style={styles.statValue}>{standing.losses}</Text>
              <Text style={styles.statLabel}>GM:</Text>
              <Text style={styles.statValue}>{standing.goalsFor}</Text>
              <Text style={styles.statLabel}>GS:</Text>
              <Text style={styles.statValue}>{standing.goalsAgainst}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);
