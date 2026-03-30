import React, { useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { styles } from "./styles/MatchCard.styles";
import { COLORS } from "../theme/colors";
import { Match } from "../models/Match";
import { LiveBadge } from "./LiveBadge";
import { Ionicons } from "@expo/vector-icons";
import { formatDateWithWeekdayPT } from "../utils/dateUtils";
import * as Clipboard from "expo-clipboard";
import { teamConfig } from "../config/teamConfig";
import { Season } from "../models/Season";
import { Competition } from "../models/Competition";

interface MatchCardProps {
  match: Match;
  homeLogo: string;
  awayLogo: string;
  onPress?: () => void;
  competition?: Competition;
}

export const MatchCard = React.memo(
  ({ match, homeLogo, awayLogo, onPress, competition }: MatchCardProps) => {
    const formattedDate = useMemo(
      () => `${formatDateWithWeekdayPT(match.date)} • ${match.time}`,
      [match.date, match.time],
    );

    const [homeScore, awayScore] = useMemo(() => {
      if (!match.result) return ["-", "-"];
      return match.result.split("-");
    }, [match.result]);

    const homeTeam = match.homeOrAway === "C" ? match.teamName : match.opponent;
    const awayTeam = match.homeOrAway === "F" ? match.teamName : match.opponent;

    const location = useMemo(() => { return match.location }, [match.location]);

    const copyLocation = useCallback(async () => {
      await Clipboard.setStringAsync(location || "Localização não disponível");
      Alert.alert("Localização copiada!", location);
    }, [location]);

    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {/* HEADER */}
        <View style={styles.header}>
<View style={styles.headerInfo}>
  <Text style={styles.date}>{formattedDate}</Text>
  <Text style={styles.competition}>
    {competition?.name || ""} {match.round ? `- ${match.round}` : ""}
  </Text>
</View>
          {match.status === "live" && (
            <LiveBadge interval={match.statusTime === "interval"} />
          )}
          {match.status === "upcoming" && (
            <Text style={styles.upcoming}>Agendado</Text>
          )}
          {match.status === "finished" && (
            <Text style={styles.finished}>Terminado</Text>
          )}
        </View>

        {/* TEAMS */}
        <View style={styles.teams}>
          <View style={styles.teamRow}>
            <View style={styles.teamInfo}>
              <View style={styles.teamLogo}>
                {homeLogo ? (
                  <Image
                    source={{ uri: homeLogo }}
                    style={{ width: 24, height: 24 }}
                  />
                ) : (
                  <Text>🏆</Text>
                )}
              </View>
              <Text style={styles.teamName}>{homeTeam}</Text>
            </View>
            <Text
              style={[
                styles.score,
                match.status === "live" && { color: COLORS.secondary },
              ]}
            >
              {homeScore}
            </Text>
          </View>

          <View style={styles.teamRow}>
            <View style={styles.teamInfo}>
              <View style={styles.teamLogo}>
                {awayLogo ? (
                  <Image
                    source={{ uri: awayLogo }}
                    style={{ width: 24, height: 24 }}
                  />
                ) : (
                  <Text>🏆</Text>
                )}
              </View>
              <Text style={styles.teamName}>{awayTeam}</Text>
            </View>
            <Text
              style={[
                styles.score,
                match.status === "live" && { color: COLORS.secondary },
              ]}
            >
              {awayScore}
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Ionicons
            name="location-outline"
            size={14}
            color={COLORS.textSecondary}
          />

          {location && (
            <>
              <Text style={styles.venue}>{location}</Text>
              <TouchableOpacity
                onPress={copyLocation}
                style={{ marginLeft: 8 }}
              >
                <Ionicons
                  name="copy-outline"
                  size={16}
                  color={COLORS.secondary}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);
