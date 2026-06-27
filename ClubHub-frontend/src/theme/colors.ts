import { StyleSheet } from "react-native";

const CLUB_MAROON = "#800000";
const CLUB_GOLD = "#E4D54E";

const basePalette = {
  maroon: CLUB_MAROON,
  black: "#000000",
  white: "#FFFFFF",
  whiteAlpha90: "#ffffffbd",
  gold: CLUB_GOLD,
  amber: "#EAB308",
  amber50: "#FEF3C7",
  amber100: "#FEF9C3",
  amber200: "#FDE68A",
  amber900: "#78350F",
  red: "#DC2626",
  red50: "#FEF2F2",
  red100: "#FEE2E2",
  red200: "#FECACA",
  red500: "#EF4444",
  green: "#16A34A",
  green100: "#DCFCE7",
  green500: "#06f05c",
  blue: "#3b82f6",
  blueTint: "#3B82F620",
  blackSteal: "#161616",
  blackStealLight: "rgba(26, 26, 26, 0.7)",
  yellowCard: "#F5C518",
  gray50: "#FAFAFA",
  gray75: "#F9F9F9",
  gray100: "#F9FAFB",
  gray150: "#F4F4F6",
  gray200: "#F3F4F6",
  gray250: "#F1F5F9",
  gray300: "#E5E7EB",
  gray350: "#E2E6EA",
  gray400: "#CCCCCC",
  gray500: "#9CA3AF",
  gray600: "#888888",
  gray700: "#6B7280",
  gray750: "#666666",
  gray900: "#111827c7",
  night50: "#F8FAFC",
  night100: "#CBD5E1",
  night200: "#94A3B8",
  night300: "#64748B",
  night500: "#272f3a",
  night600: "#1F2937",
  night700: "#111827",
  night800: "#0F172A",
  night900: "#090E19",
};

const withLegacyAliases = <T extends Record<string, any>>(tokens: T) => ({
  ...tokens,
  primary: tokens.brand.primary,
  primaryDark: tokens.brand.primaryDark,
  primaryLight: tokens.brand.primaryLight,
  secondaryLight: tokens.brand.secondaryTint,
  tercearyLight: tokens.brand.tertiaryTint,
  tertiaryLight: tokens.brand.tertiaryTint,
  background: tokens.backgrounds.screen,
  backgroundWhite: tokens.backgrounds.elevated,
  surface: tokens.backgrounds.brandSurface,
  surfaceLight: tokens.backgrounds.subtle,
  textPrimary: tokens.text.primary,
  textSecondary: tokens.text.secondary,
  textDark: tokens.text.dark,
  textMuted: tokens.text.muted,
  borderColor: tokens.borders.brandSoft,
  border: tokens.borders.brandSoft,
  muted: tokens.backgrounds.disabled,
  success: tokens.status.successBright,
  successLight: tokens.status.successLight,
  error: tokens.status.error,
  errorLight: tokens.status.errorLight,
  warning: tokens.status.warning,
  warningLight: tokens.status.warningLight,
  destructive: tokens.status.destructive,
  chart2: tokens.chart.positive,
  chart3: tokens.chart.warning,
  secondary: tokens.brand.primary,
  tertiary: tokens.brand.tertiary,
  white: tokens.palette.white,
  black: tokens.text.dark,
  night500: tokens.palette.night500,
  night600: tokens.palette.night600,
  night: tokens.palette.night700,
  transparentWhite: tokens.palette.whiteAlpha90,
  gray50: tokens.palette.gray50,
  gray75: tokens.palette.gray75,
  gray100: tokens.palette.gray100,
  gray150: tokens.palette.gray150,
  gray200: tokens.palette.gray200,
  gray250: tokens.palette.gray250,
  gray300: tokens.palette.gray300,
  gray350: tokens.palette.gray350,
  gray400: tokens.palette.gray400,
  gray500: tokens.palette.gray500,
  gray600: tokens.palette.gray600,
  gray700: tokens.palette.gray700,
  gray750: tokens.palette.gray750,
  gray900: tokens.palette.gray900,
  blue: tokens.palette.blue,
  blueTint: tokens.palette.blueTint,
});

export const LIGHT_COLORS = withLegacyAliases({
  mode: "light",
  palette: basePalette,
  brand: {
    primary: CLUB_MAROON,
    primaryDark: basePalette.black,
    primaryLight: CLUB_GOLD,
    primaryContrast: basePalette.white,
    gold: CLUB_GOLD,
    tint: "rgba(128,0,0,0.08)",
    border: "rgba(128,0,0,0.15)",
    secondaryTint: "#8000004B",
    tertiaryTint: "#80000031",
  },
  backgrounds: {
    app: basePalette.gray150,
    screen: basePalette.whiteAlpha90,
    elevated: basePalette.white,
    brandSurface: CLUB_MAROON,
    subtle: basePalette.gray200,
    muted: basePalette.gray100,
    soft: basePalette.gray50,
    disabled: basePalette.gray350,
    overlay: "rgba(0,0,0,0.5)",
    overlayStrong: "rgba(0,0,0,0.72)",
    overlaySolid: "rgba(0,0,0,0.9)",
    overlayExtraStrong: "rgba(0,0,0,0.92)",
    overlayImage: "rgba(0, 0, 0, 0.55)",
  },
  text: {
    primary: basePalette.white,
    dark: basePalette.black,
    secondary: basePalette.gray700,
    muted: basePalette.gray400,
    subtle: basePalette.gray750,
    inverse: basePalette.white,
    night: basePalette.night700,
    inverseMuted: "rgba(255,255,255,0.7)",
    inverseSoft: "rgba(255,255,255,0.9)",
    inverseFaint: "rgba(255,255,255,0.5)",
    blackWhite: basePalette.black,
    whiteBlack: basePalette.white,
  },
  borders: {
    default: basePalette.gray300,
    subtle: basePalette.gray200,
    muted: basePalette.gray400,
    inverse: basePalette.white,
    brandSoft: "#F7D7CA87",
  },
  status: {
    success: basePalette.green,
    successLight: basePalette.green100,
    successBright: basePalette.green500,
    error: basePalette.red,
    errorLight: basePalette.red100,
    errorSoft: basePalette.red50,
    errorBorder: basePalette.red200,
    errorBright: basePalette.red500,
    destructive: "#FD0101",
    warning: basePalette.amber,
    warningLight: basePalette.amber50,
    warningSoft: basePalette.amber100,
    warningBorder: basePalette.amber200,
    warningText: basePalette.amber900,
    yellowCard: basePalette.yellowCard,
    left: "#F59E0B",
  },
  effect: {
    shadow: basePalette.black,
    whiteSoft: "rgba(255,255,255,0.12)",
    whiteMedium: "rgba(255,255,255,0.15)",
    whiteStrong: "rgba(255,255,255,0.18)",
    blackSoft: "rgba(0,0,0,0.05)",
    blackSubtle: "rgba(0,0,0,0.08)",
    blackClose: "rgba(0,0,0,0.55)",
    live: "rgba(244, 67, 54, 0.24)",
  },
  chart: {
    positive: basePalette.green,
    warning: basePalette.amber,
  },
} as const);

export const DARK_COLORS = withLegacyAliases({
  mode: "dark",
  palette: basePalette,
  brand: {
    primary: CLUB_MAROON,
    primaryDark: basePalette.black,
    primaryLight: CLUB_GOLD,
    primaryContrast: basePalette.white,
    gold: CLUB_GOLD,
    tint: "rgba(128,0,0,0.24)",
    border: "rgba(228,213,78,0.32)",
    secondaryTint: "rgba(128,0,0,0.42)",
    tertiaryTint: "rgba(228,213,78,0.18)",
    tertiary: "#da2020",
  },
  backgrounds: {
    app: basePalette.blackSteal,
    screen: basePalette.blackStealLight,
    elevated: basePalette.blackSteal,
    brandSurface: CLUB_MAROON,
    subtle: basePalette.night500,
    muted: basePalette.night600,
    soft: "#172033",
    disabled: basePalette.night300,
    overlay: "rgba(0,0,0,0.65)",
    overlayStrong: "rgba(0,0,0,0.78)",
    overlaySolid: "rgba(0,0,0,0.92)",
    overlayExtraStrong: "rgba(0,0,0,0.95)",
    overlayImage: "rgba(0, 0, 0, 0.62)",
  },
  text: {
    primary: basePalette.white,
    secondary: basePalette.white,
    muted: basePalette.gray350,
    dark: basePalette.gray400,
    subtle: basePalette.night300,
    inverse: basePalette.white,
    inverseMuted: "rgba(255,255,255,0.72)",
    inverseSoft: "rgba(255,255,255,0.92)",
    inverseFaint: "rgba(255,255,255,0.56)",
    blackWhite: basePalette.gray100,
    whiteBlack: basePalette.black,
  },
  borders: {
    default: "#253044",
    subtle: "#1D2738",
    muted: basePalette.night300,
    inverse: basePalette.white,
    brandSoft: "rgba(228,213,78,0.24)",
  },
  status: {
    success: "#4ADE80",
    successLight: "rgba(22,163,74,0.22)",
    successBright: "#22C55E",
    error: "#F87171",
    errorLight: "rgba(220,38,38,0.22)",
    errorSoft: "rgba(220,38,38,0.14)",
    errorBorder: "rgba(248,113,113,0.38)",
    errorBright: "#EF4444",
    destructive: "#FF4D4D",
    warning: basePalette.amber,
    warningLight: "rgba(228,213,78,0.22)",
    warningSoft: "rgba(228,213,78,0.16)",
    warningBorder: "rgba(228,213,78,0.34)",
    warningText: CLUB_GOLD,
    yellowCard: basePalette.yellowCard,
    left: "#F59E0B",
  },
  effect: {
    shadow: basePalette.black,
    whiteSoft: "rgba(255,255,255,0.10)",
    whiteMedium: "rgba(255,255,255,0.14)",
    whiteStrong: "rgba(255,255,255,0.18)",
    blackSoft: "rgba(255,255,255,0.06)",
    blackSubtle: "rgba(255,255,255,0.08)",
    blackClose: "rgba(0,0,0,0.62)",
    live: "rgba(244, 67, 54, 0.30)",
  },
  chart: {
    positive: "#4ADE80",
    warning: CLUB_GOLD,
  },
} as const);

export type ThemeColors = typeof LIGHT_COLORS | typeof DARK_COLORS;
export type ThemeMode = "light" | "dark";
export type ThemePreference = "system" | ThemeMode;

export const COLORS = { ...LIGHT_COLORS } as ThemeColors;
let activeThemeMode: ThemeMode = "light";
let activeThemeVersion = 0;

export const getThemeColors = (mode: ThemeMode): ThemeColors =>
  mode === "dark" ? DARK_COLORS : LIGHT_COLORS;

export const setActiveThemeColors = (mode: ThemeMode) => {
  if (activeThemeMode === mode) return;
  activeThemeMode = mode;
  Object.assign(COLORS, getThemeColors(mode));
  activeThemeVersion += 1;
};

export const createThemedStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  factory: () => T,
): T => {
  let cachedVersion = -1;
  let cachedStyles: T | null = null;

  const getStyles = () => {
    if (!cachedStyles || cachedVersion !== activeThemeVersion) {
      cachedStyles = StyleSheet.create(factory());
      cachedVersion = activeThemeVersion;
    }
    return cachedStyles;
  };

  return new Proxy({} as T, {
    get(_target, prop) {
      return getStyles()[prop as keyof T];
    },
  });
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
};
