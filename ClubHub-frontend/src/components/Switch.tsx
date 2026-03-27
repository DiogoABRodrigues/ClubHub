import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

interface SwitchProps {
  value: boolean;
  onValueChange?: (val: boolean) => void;
  disabled?: boolean;
  size?: number;
}

export const Switch: React.FC<SwitchProps> = React.memo(
  ({ value, onValueChange, disabled = false, size = 32 }) => {
    const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      Animated.spring(translateX, {
        toValue: value ? 1 : 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    }, [value]);

    const toggle = useCallback(() => {
      if (disabled) return;
      onValueChange?.(!value);
    }, [value, disabled, onValueChange]);

    const { thumbSize, trackHeight, trackWidth } = useMemo(() => {
      const thumb = size * 0.6;
      return {
        thumbSize: thumb,
        trackHeight: thumb + 8, // padding de 4px em cima e em baixo
        trackWidth: size * 1.3, // thumb + padding de 4px em cada lado
      };
    }, [size]);

    const translate = useMemo(() => {
      return translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [4, trackWidth - thumbSize - 4],
        extrapolate: "clamp",
      });
    }, [translateX, trackWidth, thumbSize]);

    return (
      <Pressable
        onPress={toggle}
        disabled={disabled}
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: value ? COLORS.primary : COLORS.muted,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX: translate }],
              backgroundColor: COLORS.background,
            },
          ]}
        />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  track: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thumb: {
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
});
