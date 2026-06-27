import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export function withThemeUpdates<P extends object>(
  Component: React.ComponentType<P>,
) {
  const ThemedScreen = (props: P) => {
    useTheme();
    return <Component {...props} />;
  };

  ThemedScreen.displayName = `WithThemeUpdates(${
    Component.displayName || Component.name || "Screen"
  })`;

  return ThemedScreen;
}
