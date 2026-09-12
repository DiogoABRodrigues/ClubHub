import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Match } from "../../models/Match";
import { LiveBadge } from "../../components/LiveBadge";
import { COLORS, createThemedStyles } from "../../theme/colors";
import { formatDateWithWeekdayPT } from "../../utils/dateUtils";

export const MATCH_HEADER_HEIGHT = 280;
const COMPACT_HEIGHT = 80;
export const MATCH_HEADER_COLLAPSE = MATCH_HEADER_HEIGHT - COMPACT_HEIGHT;

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
  onBack: () => void;
}

export function CollapsibleMatchHeader({
  scrollY, match, homeName, awayName, homeLogo, awayLogo,
  homeScore, awayScore, competitionName, onBack,
}: Props) {
  const between = (expanded: number, compact: number) => scrollY.interpolate({
    inputRange: [0, MATCH_HEADER_COLLAPSE],
    outputRange: [expanded, compact],
    extrapolate: "clamp",
  });
  const detailOpacity = scrollY.interpolate({
    inputRange: [0, MATCH_HEADER_COLLAPSE * 0.1, MATCH_HEADER_COLLAPSE * 0.4],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  const namesOpacity = scrollY.interpolate({
    inputRange: [0, MATCH_HEADER_COLLAPSE * 0.25, MATCH_HEADER_COLLAPSE * 0.75],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  // Reclaim the details first; keep the score lower until that space closes.
  const scoreTop = scrollY.interpolate({
    inputRange: [0, MATCH_HEADER_COLLAPSE * 0.55, MATCH_HEADER_COLLAPSE],
    outputRange: [72, 52, 10],
    extrapolate: "clamp",
  });
  const scoreHeight = between(76, 60);
  const namesTop = Animated.add(Animated.add(scoreTop, scoreHeight), 4);
  const phaseLabels: Record<string, string> = {
    "1st": "1ª Parte", interval: "Intervalo", "2nd": "2ª Parte",
    extra: "Prolongamento", penalties: "Penáltis",
  };
  const phase = phaseLabels[match.statusTime ?? ""] ?? "";

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[headerStyles.header, { height: between(MATCH_HEADER_HEIGHT, COMPACT_HEIGHT) }]}
    >
      <Animated.View pointerEvents="none" style={[
        headerStyles.competition,
        { opacity: detailOpacity, transform: [{ translateY: between(0, -24) }] },
      ]}>
        <Text numberOfLines={2} style={headerStyles.competitionText}>
          {competitionName}{match.round ? ` · ${match.round}` : ""}
        </Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[
        headerStyles.scoreRow,
        { top: scoreTop, height: scoreHeight, paddingHorizontal: between(16, 48) },
      ]}>
        <View style={headerStyles.teamSide}>
          <Animated.Image
            source={homeLogo ? { uri: homeLogo } : undefined}
            accessibilityLabel={homeName}
            resizeMode="contain"
            style={{ width: between(50, 38), height: between(50, 38) }}
          />
        </View>
        <View style={headerStyles.scoreColumn}>
          <Animated.Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}
            style={[headerStyles.score, { fontSize: between(44, 22), lineHeight: between(52, 28) }]}>
            {homeScore} - {awayScore}
          </Animated.Text>
          {match.status === "live" ? (
            <LiveBadge interval={match.statusTime === "interval"} />
          ) : (
            <Text style={headerStyles.status}>
              {match.status === "finished" ? "Terminado" : "Agendado"}
              {match.decidedByPenalties ? " · Após g.p." : ""}
            </Text>
          )}
        </View>
        <View style={headerStyles.teamSide}>
          <Animated.Image
            source={awayLogo ? { uri: awayLogo } : undefined}
            accessibilityLabel={awayName}
            resizeMode="contain"
            style={{ width: between(50, 38), height: between(50, 38) }}
          />
        </View>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[
        headerStyles.namesRow,
        { opacity: namesOpacity, top: namesTop },
      ]}>
        <Text numberOfLines={2} style={headerStyles.teamName}>{homeName}</Text>
        <Text numberOfLines={2} style={headerStyles.phase}>{match.status === "live" ? phase : ""}</Text>
        <Text numberOfLines={2} style={headerStyles.teamName}>{awayName}</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[
        headerStyles.details,
        { opacity: detailOpacity, top: between(210, 95) },
      ]}>
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
        style={headerStyles.back}>
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
  competition: { position: "absolute", top: 48, left: 56, right: 56 },
  competitionText: {
    color: COLORS.text.info, fontSize: 11, fontWeight: "600",
    textAlign: "center", textTransform: "uppercase",
  },
  scoreRow: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center" },
  teamSide: { flex: 1, alignItems: "center" },
  scoreColumn: { width: 120, alignItems: "center", justifyContent: "center" },
  score: { color: COLORS.text.info, fontWeight: "800", textAlign: "center" },
  status: { color: COLORS.text.subtle, fontSize: 10, lineHeight: 16, textAlign: "center" },
  namesRow: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "flex-start" },
  teamName: { flex: 1, color: COLORS.text.blackWhite, fontWeight: "600", fontSize: 13, textAlign: "center" },
  phase: { width: 120, color: COLORS.text.subtle, fontSize: 11, textAlign: "center" },
  details: { position: "absolute", left: 16, right: 16, gap: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  info: { flex: 1, color: COLORS.text.subtle, fontSize: 11, lineHeight: 16, textAlign: "left" },
}));
