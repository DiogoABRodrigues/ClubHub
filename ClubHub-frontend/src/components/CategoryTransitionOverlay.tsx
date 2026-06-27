import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ActivityIndicator } from "react-native";
import { COLORS, createThemedStyles } from "../theme/colors";

interface CategoryTransitionOverlayProps {
  visible: boolean;
}

/**
 * Overlay semitransparente que aparece durante a troca de categoria/season.
 * Faz fade-in rápido quando `visible=true` e fade-out quando volta a false.
 * Impede que o utilizador veja os flashes de re-render dos dados.
 */
export const CategoryTransitionOverlay: React.FC<
  CategoryTransitionOverlayProps
> = ({ visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const pointerRef = useRef<"none" | "box-none">("none");

  useEffect(() => {
    if (visible) {
      pointerRef.current = "box-none";
      Animated.timing(opacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        pointerRef.current = "none";
      });
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? "box-none" : "none"}
      style={[styles.overlay, { opacity }]}
    >
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </Animated.View>
  );
};

const styles = createThemedStyles(() => ({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.backgrounds.screen,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
}));
