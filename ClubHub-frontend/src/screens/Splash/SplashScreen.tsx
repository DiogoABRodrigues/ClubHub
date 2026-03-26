import { View, Animated } from "react-native";
import { styles } from "./Splash.styles";
import { useSplashAnimation } from "./Splash.logic";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { opacity, scale } = useSplashAnimation(onFinish);

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
    </View>
  );
}