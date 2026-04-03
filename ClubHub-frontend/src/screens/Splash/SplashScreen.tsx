import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Text } from "react-native";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../hooks/useTeams";
import { useStandings } from "../../hooks/useStandings";
import { useNews } from "../../hooks/useNews";
import { useAppSetting } from "../../hooks/useAppSettings";
import { useCompetitions } from "../../hooks/useCompetitions";
import { usePlayers } from "../../hooks/usePlayers";
import { useSeasons } from "../../hooks/useSeasons";
import { useStatements } from "../../hooks/useStatements";
import { useStats } from "../../hooks/useStats";
import { styles } from "./Splash.styles";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { loading: matchesLoading } = useMatches();
  const { loading: teamsLoading } = useTeams();
  const { loading: standingsLoading } = useStandings();
  const { loading: newsLoading } = useNews();
  const { loading: competitionsLoading } = useCompetitions();
  const { loading: playersLoading } = usePlayers();
  const { loading: seasonsLoading } = useSeasons();
  const { loading: statementsLoading } = useStatements();
  const { loading: statsLoading } = useStats();
  const { loading: appSettingsLoading } = useAppSetting(
    "notifications_enabled",
  );

  // Animação
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  // Estado para controlar se animação terminou
  const [animationDone, setAnimationDone] = useState(false);

  // Executa animação
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => setAnimationDone(true)); // marca animação como terminada
  }, []);

  // Fecha splash só quando animação terminou e dados estão carregados
  useEffect(() => {
    if (animationDone) {
      onFinish();
    }
  }, [animationDone]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../../assets/icon.png")}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
      />
    </View>
  );
};
