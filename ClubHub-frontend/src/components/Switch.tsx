import React from 'react';
import { View, Animated, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface SwitchProps {
  value: boolean;
  onValueChange?: (val: boolean) => void;
  disabled?: boolean;
  size?: number; // tamanho do switch
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 32,
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const toggle = () => {
    if (disabled) return;
    onValueChange && onValueChange(!value);
  };

  const thumbSize = size * 0.6;
  const trackHeight = size * 0.6;
  const trackWidth = size;

  const translate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, trackWidth - thumbSize - 2],
  });

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
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    position: 'absolute',
    top: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
});