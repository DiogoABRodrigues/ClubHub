import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getThemeColors,
  setActiveThemeColors,
  ThemeColors,
  ThemeMode,
  ThemePreference,
} from "../theme/colors";

const STORAGE_KEY = "themePreference";

type ThemeContextValue = {
  colors: ThemeColors;
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: getThemeColors("light"),
  mode: "light",
  preference: "light",
  setPreference: async () => {},
  isReady: false,
});

const resolveMode = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName,
): ThemeMode => {
  if (preference !== "system") return preference;
  return systemScheme === "dark" ? "dark" : "light";
};

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<ThemePreference>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isThemePreference(stored)) {
          setPreferenceState(stored);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const setPreference = async (nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    await AsyncStorage.setItem(STORAGE_KEY, nextPreference);
  };

  const mode = resolveMode(preference, systemScheme);
  const colors = getThemeColors(mode);
  setActiveThemeColors(mode);

  const value = useMemo(
    () => ({
      colors,
      mode,
      preference,
      setPreference,
      isReady,
    }),
    [colors, mode, preference, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
