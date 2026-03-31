import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Text } from "react-native";
import { useMatches } from "../../hooks/useMatches";
import { useTeams } from "../../contexts/TeamsContext";
import { useStandings } from "../../contexts/StandingsContext";
import { useNews } from "../../contexts/NewsContext";

import { styles } from "./Splash.styles";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { loading: matchesLoading } = useMatches();
  const { loading: teamsLoading } = useTeams();
  const { loading: standingsLoading } = useStandings();
  const { loading: newsLoading } = useNews();

  const allDataLoaded =
    !matchesLoading && !teamsLoading && !standingsLoading && !newsLoading;
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
    if (animationDone && allDataLoaded) {
      onFinish();
    }
  }, [animationDone, allDataLoaded]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../../assets/icon.png")}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
      />
    </View>
  );
};
