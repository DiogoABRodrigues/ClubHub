import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { styles } from "./styles/LeagueTableRow.styles";
import { COLORS } from "../theme/colors";
import { Standing } from "../models/Standing";
import { useTeams } from "../contexts/TeamsContext";
import { teamConfig } from "../config/teamConfig";
import { useEffect } from "react";

interface Props {
  standing: Standing;
  isUserTeam?: boolean;
  green: number; // número de posições verdes (promoção)
  red: number; // número de posições vermelhas (descida)
}

export const LeagueTableRow = React.memo(
  ({ standing, isUserTeam = false, green, red }: Props) => {
    const { teams } = useTeams();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      if (
        Platform.OS === "android" &&
        UIManager.setLayoutAnimationEnabledExperimental
      ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }, []);

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

    const appTeamName = teamConfig.name.trim().toLowerCase();
    const isAppTeam = normalizedName === appTeamName;

    const rowBackgroundColor = useMemo(() => {
      if (isAppTeam) return COLORS.primaryLight;
      if (standing.position <= green) return COLORS.successLight;
      if (standing.position >= red) return COLORS.errorLight;
      return COLORS.background;
    }, [standing.position, isAppTeam, green, red]);

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
          <View style={styles.position}>
            <Text style={[styles.text, { color: COLORS.textSecondary }]}>
              {standing.position}
            </Text>
          </View>

          {/* TEAM NAME + LOGO */}
          <View style={styles.teamRow}>
            {teamLogo && (
              <Image
                source={{ uri: teamLogo }}
                style={styles.teamLogo}
                resizeMode="contain"
              />
            )}
            <Text
              style={[styles.text, isUserTeam && styles.bold]}
              numberOfLines={1}
            >
              {standing.teamName}
            </Text>
          </View>

          {/* PLAYED */}
          <View style={styles.center}>
            <Text style={styles.mutedText}>{standing.played}</Text>
          </View>

          {/* GOAL DIFFERENCE */}
          <View style={styles.centerRow}>
            <Text style={styles.text}>
              {standing.goalDiff > 0 ? "+" : ""}
              {standing.goalDiff}
            </Text>
          </View>

          {/* POINTS */}
          <View style={styles.points}>
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
