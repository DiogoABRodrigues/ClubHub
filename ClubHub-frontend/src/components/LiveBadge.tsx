import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { styles } from "./styles/LiveBadge.styles";

export const LiveBadge = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(1);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity }]} />
      <Text style={styles.text}>Em direto</Text>
    </View>
  );
};
