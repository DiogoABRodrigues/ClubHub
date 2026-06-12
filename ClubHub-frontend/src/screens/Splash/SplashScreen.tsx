import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";

// Screens a pré-aquecer
import { Home } from "../Home/Home";
import { Matches } from "../Matches/Matches";
import { SeasonScreen } from "../Season/SeasonScreen";
import { News } from "../News/News";
import { NotificationSettings } from "../NotificationSettings/NotificationSettings";

// Hooks de dados
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

/**
 * Mock de navigation para o pre-warm.
 * Os screens são renderizados com opacity:0, por isso nunca são interactivos.
 * Este mock evita crashes em screens que chamam navigation.navigate() no mount.
 */
const noopNavigation = {
  navigate: () => {},
  goBack: () => {},
  push: () => {},
  replace: () => {},
  dispatch: () => {},
  setOptions: () => {},
  addListener: () => () => {},
  removeListener: () => {},
  isFocused: () => false,
  canGoBack: () => false,
  getParent: () => null,
  getState: () => null,
};

/**
 * SplashScreen com pre-warming duplo:
 *
 * 1. DATA PRE-FETCH: todos os hooks de dados disparam os pedidos à API
 *    enquanto o splash está visível.
 *
 * 2. COMPONENT PRE-WARM: todos os screens principais são renderizados com
 *    opacity:0 e width/height:0, forçando o React Native a construir e
 *    montar os componentes antes do utilizador os ver.
 */
export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  // ── Data pre-fetch ────────────────────────────────────────────────────────
  useMatches();
  useTeams();
  useStandings();
  useNews();
  useCompetitions();
  usePlayers();
  useSeasons();
  useStatements();
  useStats();
  useAppSetting("notifications_enabled");

  // ── Animação ──────────────────────────────────────────────────────────────
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const [animationDone, setAnimationDone] = useState(false);

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
    ]).start(() => setAnimationDone(true));
  }, []);

  useEffect(() => {
    if (animationDone) {
      onFinish();
    }
  }, [animationDone]);

  return (
    <View style={styles.container}>
      {/* Logo animado */}
      <Animated.Image
        source={require("../../../assets/icon.png")}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
      />

      {/*
       * Pre-warm: screens completamente invisíveis e não interactivos.
       *
       * - opacity: 0         → invisíveis
       * - width/height: 0    → não ocupam espaço
       * - pointerEvents:"none" → não recebem toques
       * - accessibilityElementsHidden → ignorados por leitores de ecrã
       *
       * O React Native constrói os componentes, aplica estilos e faz o layout
       * enquanto o splash está visível. Quando o utilizador navega para qualquer
       * tab pela primeira vez, os componentes já estão aquecidos - render instantâneo.
       */}
      <View
        style={{ position: "absolute", opacity: 0, width: 0, height: 0, overflow: "hidden" }}
        pointerEvents="none"
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={{ width: 390, height: 844 }}>
          <Home navigation={noopNavigation as any} />
        </View>
        <View style={{ width: 390, height: 844 }}>
          <Matches navigation={noopNavigation as any} />
        </View>
        <View style={{ width: 390, height: 844 }}>
          <SeasonScreen navigation={noopNavigation as any} />
        </View>
        <View style={{ width: 390, height: 844 }}>
          <News navigation={noopNavigation as any} />
        </View>
        <View style={{ width: 390, height: 844 }}>
          <NotificationSettings navigation={noopNavigation as any} />
        </View>
      </View>
    </View>
  );
};
