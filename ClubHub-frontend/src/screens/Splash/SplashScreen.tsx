import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, Animated, Dimensions } from "react-native";

import { Home } from "../Home/Home";
import { Matches } from "../Matches/Matches";
import { SeasonScreen } from "../Season/SeasonScreen";
import { News } from "../News/News";

import { useCategory } from "../../contexts/CategoryContext";

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
      style={{
        position: "absolute",
        opacity: 0,
        width: 0,
        height: 0,
        overflow: "hidden",
      }}
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
        <SeasonScreen navigation={noopNavigation as any} />
      </View>

      <View style={{ width, height }}>
        <News navigation={nav as any} />
      </View>

    </View>
  );
};

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { isReady } = useCategory();

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
    if (animationDone) onFinish();
  }, [animationDone, onFinish]);

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

      {isReady && <PreWarm />}
    </View>
  );
};
