import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function useSplashAnimation(onFinish: () => void) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onFinish, 1600);

    return () => clearTimeout(timer);
  }, []);

  return { opacity, scale };
}