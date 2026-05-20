import React, { useMemo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/MatchCard.styles";
import { COLORS } from "../theme/colors";
import { Match } from "../models/Match";
import { LiveBadge } from "./LiveBadge";
import { formatDateWithWeekdayPT } from "../utils/dateUtils";
import * as Clipboard from "expo-clipboard";
import { Competition } from "../models/Competition";

interface MatchCardProps {
  match: Match;
  homeLogo: string;
  awayLogo: string;
  onPress?: () => void;
  competition?: Competition;
}

// ─── Logo helper ─────────────────────────────────────────────────────────────

const TeamLogo = ({ uri, variant }: { uri: string; variant: "dark" | "light" }) => {
  const [failed, setFailed] = useState(false);
  const logoStyle = variant === "dark" ? styles.logoDark : styles.logoLight;

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.logo,
        logoStyle,
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            variant === "dark"
              ? "rgba(0,0,0,0.08)"
              : "rgba(255,255,255,0.12)",
          borderRadius: 4,
        },
      ]}
    >
      <Ionicons
        name="shield-outline"
        size={20}
        color={variant === "dark" ? COLORS.textMuted : "rgba(255,255,255,0.5)"}
      />
    </View>
  );
};

// ─── Result helper ────────────────────────────────────────────────────────────

function getResult(match: Match): { label: string; color: string } | null {
  if (!match.result) return null;
  const parts = match.result.split("-");
  if (parts.length < 2) return null;
  if (match.outcome === "V") return { label: "VITÓRIA", color: COLORS.success };
  if (match.outcome === "D")
    return { label: "DERROTA", color: COLORS.destructive };
  return { label: "EMPATE", color: COLORS.textMuted };
}

// ─── Main component ───────────────────────────────────────────────────────────

export const MatchCard = React.memo(
  ({ match, homeLogo, awayLogo, onPress, competition }: MatchCardProps) => {
    const homeTeam = match.homeOrAway === "C" ? match.teamName : match.opponent;
    const awayTeam = match.homeOrAway === "F" ? match.teamName : match.opponent;
    const [homeScore, awayScore] = useMemo(() => {
      if (!match.result) return [null, null];
      const parts = match.result.split("-");
      return parts.length >= 2 ? [parts[0], parts[1]] : [null, null];
    }, [match.result]);

    const formattedDate = useMemo(
      () => `${formatDateWithWeekdayPT(match.date)} · ${match.time}`,
      [match.date, match.time],
    );

    const compLabel = useMemo(() => {
      if (!competition?.name) return "";
      return match.round
        ? `${competition.name} · ${match.round}`
        : competition.name;
    }, [competition, match.round]);

    const location = match.location;

    const copyLocation = useCallback(async () => {
      await Clipboard.setStringAsync(location || "Localização não disponível");
      Alert.alert("Localização copiada!", location);
    }, [location]);

    const result = useMemo(() => getResult(match), [match]);

    // ── LIVE ─────────────────────────────────────────────────────────────────
    if (match.status === "live") {
      return (
        <TouchableOpacity
          style={styles.liveCard}
          onPress={onPress}
          activeOpacity={0.88}
        >
          <View style={styles.liveDecor} pointerEvents="none" />

          <View style={styles.cardTop}>
            <Text style={styles.liveComp} numberOfLines={1}>
              {compLabel}
            </Text>
            <LiveBadge interval={match.statusTime === "interval"} />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.teamCol}>
              <TeamLogo uri={homeLogo} variant="light" />
              <Text style={styles.liveTeamName} numberOfLines={2}>
                {homeTeam}
              </Text>
            </View>

            <View style={styles.liveScoreCol}>
              <Text style={styles.liveScoreText}>
                {homeScore ?? "–"}–{awayScore ?? "–"}
              </Text>
            </View>

            <View style={styles.teamCol}>
              <TeamLogo uri={awayLogo} variant="light" />
              <Text style={styles.liveTeamName} numberOfLines={2}>
                {awayTeam}
              </Text>
            </View>
          </View>

          {location ? (
            <View style={styles.cardFooter}>
              <Ionicons
                name="location-outline"
                size={11}
                color={COLORS.textPrimary}
              />
              <Text style={styles.liveFooterText} numberOfLines={1}>
                {location}
              </Text>
              <TouchableOpacity
                onPress={copyLocation}
                style={{ marginLeft: 6 }}
              >
                <Ionicons
                  name="copy-outline"
                  size={13}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </TouchableOpacity>
      );
    }

    // ── UPCOMING ──────────────────────────────────────────────────────────────
    if (match.status === "upcoming") {
      return (
        <TouchableOpacity
          style={styles.baseCard}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <View style={styles.cardTop}>
            <Text style={styles.baseComp} numberOfLines={1}>
              {compLabel}
            </Text>
            <View style={styles.upBadge}>
              <Text style={styles.upBadgeText}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.teamCol}>
              <TeamLogo uri={homeLogo} variant="light" />
              <Text style={styles.baseTeamName} numberOfLines={2}>
                {homeTeam}
              </Text>
            </View>

            <View style={styles.upCenterCol}>
              <Text style={styles.vsText}>VS</Text>
              {match.time ? (
                <Text style={styles.upTime}>{match.time}</Text>
              ) : null}
            </View>

            <View style={styles.teamCol}>
              <TeamLogo uri={awayLogo} variant="light" />
              <Text style={styles.baseTeamName} numberOfLines={2}>
                {awayTeam}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Ionicons
              name="location-outline"
              size={11}
              color={COLORS.textMuted}
            />
            <Text style={styles.baseFooterText} numberOfLines={1}>
              {location ? location : "Localização não disponível"}
            </Text>
            <TouchableOpacity onPress={copyLocation} style={{ marginLeft: 6 }}>
              <Ionicons
                name="copy-outline"
                size={13}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }

    // ── FINISHED ──────────────────────────────────────────────────────────────
    return (
      <TouchableOpacity
        style={styles.baseCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          <Text style={styles.baseComp} numberOfLines={1}>
            {compLabel}
          </Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.teamCol}>
            <TeamLogo uri={homeLogo} variant="light" />
            <Text style={styles.baseTeamName} numberOfLines={2}>
              {homeTeam}
            </Text>
          </View>

          <View style={styles.finCenterCol}>
            <Text style={styles.finScoreText}>
              {homeScore ?? "–"}–{awayScore ?? "–"}
            </Text>
            {result ? (
              <Text style={[styles.finResultText, { color: result.color }]}>
                {result.label}
              </Text>
            ) : null}
          </View>

          <View style={styles.teamCol}>
            <TeamLogo uri={awayLogo} variant="light" />
            <Text style={styles.baseTeamName} numberOfLines={2}>
              {awayTeam}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Ionicons
            name="calendar-outline"
            size={11}
            color={COLORS.textMuted}
          />
          <Text style={styles.baseFooterText} numberOfLines={1}>
            {formattedDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);