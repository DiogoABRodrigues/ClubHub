import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";

import { Home } from "../Home/Home";
import { Matches } from "../Matches/Matches";
import { SeasonScreen } from "../Season/SeasonScreen";
import { News } from "../News/News";
import { useCategory } from "../../contexts/CategoryContext";
import { healthApi } from "../../services/api";
import { styles } from "./Splash.styles";

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get("window");

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

const PreWarm = () => {
  const nav = useMemo(() => noopNavigation, []);

  return (
    <View
      style={styles.preWarm}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={{ width, height }}>
        <Home navigation={nav as any} />
      </View>
      <View style={{ width, height }}>
        <Matches navigation={nav as any} />
      </View>
      <View style={{ width, height }}>
        <SeasonScreen navigation={nav as any} />
      </View>
      <View style={{ width, height }}>
        <News navigation={nav as any} />
      </View>
    </View>
  );
};

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { isReady } = useCategory();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const [animationDone, setAnimationDone] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

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
  }, [opacity, scale]);

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    const wakeBackend = async () => {
      setHasError(false);
      setBackendReady(false);
      setDataReady(false);

      try {
        await healthApi.get("/health", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (cancelled) return;

        await queryClient.resetQueries({
          predicate: (query) => query.state.status === "error",
        });
        if (!cancelled) setBackendReady(true);
      } catch {
        if (!cancelled) setHasError(true);
      }
    };

    void wakeBackend();

    return () => {
      cancelled = true;
    };
  }, [attempt, isReady, queryClient]);

  useEffect(() => {
    if (!backendReady || hasError || dataReady || isFetching > 0) return;

    // Dá tempo às queries dependentes (por exemplo, época -> jogos) para arrancarem.
    const settleTimer = setTimeout(() => {
      const failedQuery = queryClient
        .getQueryCache()
        .getAll()
        .some((query) => query.state.status === "error");

      if (failedQuery) {
        setHasError(true);
      } else {
        setDataReady(true);
      }
    }, 400);

    return () => clearTimeout(settleTimer);
  }, [backendReady, dataReady, hasError, isFetching, queryClient]);

  useEffect(() => {
    if (animationDone && dataReady) onFinish();
  }, [animationDone, dataReady, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../../assets/icon.png")}
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />

      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Alguma coisa não correu bem</Text>
          <Text style={styles.errorMessage}>
            Os dados solicitados não puderam ser carregados.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setAttempt((current) => current + 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.loadingText}>A carregar...</Text>
        </View>
      )}

      {backendReady && !hasError && <PreWarm />}
    </View>
  );
};
