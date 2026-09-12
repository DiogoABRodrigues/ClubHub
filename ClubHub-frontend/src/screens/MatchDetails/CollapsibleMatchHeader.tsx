import React, { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Match } from "../../models/Match";
import { LiveBadge } from "../../components/LiveBadge";
import { COLORS, createThemedStyles } from "../../theme/colors";
import { formatDateWithWeekdayPT } from "../../utils/dateUtils";

export const MATCH_HEADER_HEIGHT = 240;

interface Props {
  scrollY: Animated.Value;
  match: Match;
  homeName: string;
  awayName: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore: string;
  awayScore: string;
  competitionName?: string;
  onHeightChange: (height: number) => void;
  onBack: () => void;
}

export function CollapsibleMatchHeader({
  scrollY, match, homeName, awayName, homeLogo, awayLogo,
  homeScore, awayScore, competitionName, onBack, onHeightChange,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [competitionHeight, setCompetitionHeight] = useState(26);
  const [namesHeight, setNamesHeight] = useState(32);
  const [detailsHeight, setDetailsHeight] = useState(36);
  const competitionTop = Math.max(48, insets.top + 8);
  const expandedScoreTop = competitionTop + competitionHeight + 8;
  const expandedDetailsTop = expandedScoreTop + 52 + 6 + namesHeight + 16;
  const expandedHeight = expandedDetailsTop + detailsHeight + 16;
  const compactHeight = competitionTop + 38 + 20 + 12;
  const collapseDistance = expandedHeight - compactHeight;

  useEffect(() => {
    onHeightChange(expandedHeight);
  }, [expandedHeight, onHeightChange]);

  const between = (expanded: number, compact: number) => scrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [expanded, compact],
    extrapolate: "clamp",
  });
  const detailOpacity = scrollY.interpolate({
    inputRange: [0, collapseDistance * 0.1, collapseDistance * 0.4],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  const namesOpacity = scrollY.interpolate({
    inputRange: [0, collapseDistance * 0.25, collapseDistance * 0.75],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  // Reclaim the details first; keep the score lower until that space closes.
  const scoreTop = scrollY.interpolate({
    inputRange: [0, collapseDistance * 0.55, collapseDistance],
    outputRange: [expandedScoreTop, competitionTop + 16, competitionTop],
    extrapolate: "clamp",
  });
  const scoreHeight = between(52, 38);
  const namesTop = Animated.add(Animated.add(scoreTop, scoreHeight), 6);
  const phaseLabels: Record<string, string> = {
    "1st": "1ª Parte", interval: "Intervalo", "2nd": "2ª Parte",
    extra: "Prolongamento", penalties: "Penáltis",
  };
  const phase = phaseLabels[match.statusTime ?? ""] ?? "";

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[headerStyles.header, { height: between(expandedHeight, compactHeight) }]}
    >
      <Animated.View pointerEvents="none" style={[
        headerStyles.competition,
        { top: competitionTop, opacity: detailOpacity },
      ]} onLayout={(event) => setCompetitionHeight(event.nativeEvent.layout.height)}>
        <Text numberOfLines={2} style={headerStyles.competitionText}>
          {competitionName}{match.round ? ` · ${match.round}` : ""}
        </Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[
        headerStyles.scoreRow,
        { top: scoreTop, height: scoreHeight },
      ]}>
        <Animated.View style={[headerStyles.teamSide, { width: between(Math.max(0, (width - 32 - 120) / 2), 46) }]}>
          <Animated.Image
            source={homeLogo ? { uri: homeLogo } : undefined}
            accessibilityLabel={homeName}
            resizeMode="contain"
            style={{ width: between(50, 38), height: between(50, 38) }}
          />
        </Animated.View>
        <Animated.View style={[headerStyles.scoreColumn, { width: between(120, 96) }]}>
          <Animated.Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}
            style={[headerStyles.score, { fontSize: between(44, 22), lineHeight: between(52, 28) }]}>
            {homeScore} - {awayScore}
          </Animated.Text>
          <View style={headerStyles.statusBelowScore}>
            {match.status === "live" ? (
              <LiveBadge interval={match.statusTime === "interval"} />
            ) : (
              <Text style={headerStyles.status}>
                {match.status === "finished" ? "Terminado" : "Agendado"}
                {match.decidedByPenalties ? " · Após g.p." : ""}
              </Text>
            )}
          </View>
        </Animated.View>
        <Animated.View style={[headerStyles.teamSide, { width: between(Math.max(0, (width - 32 - 120) / 2), 46) }]}>
          <Animated.Image
            source={awayLogo ? { uri: awayLogo } : undefined}
            accessibilityLabel={awayName}
            resizeMode="contain"
            style={{ width: between(50, 38), height: between(50, 38) }}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[
        headerStyles.namesRow,
        { opacity: namesOpacity, top: namesTop },
      ]} onLayout={(event) => setNamesHeight(event.nativeEvent.layout.height)}>
        <Text numberOfLines={2} style={headerStyles.teamName}>{homeName}</Text>
        <View style={headerStyles.phaseColumn}>
          {match.status === "live" && <Text numberOfLines={2} style={headerStyles.phase}>{phase}</Text>}
        </View>
        <Text numberOfLines={2} style={headerStyles.teamName}>{awayName}</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[
        headerStyles.details,
        { opacity: detailOpacity, top: between(expandedDetailsTop, compactHeight) },
      ]} onLayout={(event) => setDetailsHeight(event.nativeEvent.layout.height)}>
        <View style={headerStyles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.text.subtle} />
          <Text numberOfLines={1} style={headerStyles.info}>
            {match.date ? formatDateWithWeekdayPT(match.date) : ""}{match.time ? ` · ${match.time}` : ""}
          </Text>
        </View>
        {!!match.location && (
          <View style={headerStyles.infoRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.text.subtle} />
            <Text numberOfLines={2} style={headerStyles.info}>{match.location}</Text>
          </View>
        )}
      </Animated.View>

      <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar"
        style={[headerStyles.back, { top: Math.max(16, insets.top + 4) }]}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text.blackWhite} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const headerStyles = createThemedStyles(() => ({
  header: {
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
    overflow: "hidden", backgroundColor: COLORS.backgrounds.screen,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.borders.subtle,
  },
  back: {
    position: "absolute", top: 16, left: 8, width: 44, height: 44,
    alignItems: "center", justifyContent: "center",
  },
  competition: { position: "absolute", left: 56, right: 56 },
  competitionText: {
    color: COLORS.text.info, fontSize: 11, fontWeight: "600",
    textAlign: "center", textTransform: "uppercase",
  },
  scoreRow: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  teamSide: { alignItems: "center" },
  scoreColumn: { alignItems: "center", justifyContent: "center" },
  score: { color: COLORS.text.info, fontWeight: "800", textAlign: "center", includeFontPadding: false },
  statusBelowScore: { position: "absolute", top: "100%", left: 0, right: 0, alignItems: "center" },
  status: { color: COLORS.text.subtle, fontSize: 10, lineHeight: 16, textAlign: "center" },
  namesRow: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "flex-start" },
  teamName: { flex: 1, color: COLORS.text.blackWhite, fontWeight: "600", fontSize: 13, textAlign: "center" },
  phaseColumn: { width: 120 },
  phase: { paddingTop: 20, color: COLORS.text.subtle, fontSize: 11, textAlign: "center" },
  details: { position: "absolute", left: 16, right: 16, gap: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  info: { flex: 1, color: COLORS.text.subtle, fontSize: 11, lineHeight: 16, textAlign: "left" },
}));
