import { ColorSchemeName } from "react-native";

// Base color palette
const baseColors = {
  // Core brand colors
  brand: {
    primary: "#6366F1", // Indigo
    secondary: "#8B5CF6", // Purple
    tertiary: "#06B6D4", // Cyan
  },

  // Neutral colors
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#030712",
  },

  // Accent colors
  accent: {
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  // Weather colors
  weather: {
    sunny: "#FFD700",
    cloudy: "#9CA3AF",
    rainy: "#3B82F6",
    snowy: "#E5E7EB",
    stormy: "#6B7280",
  },
} as const;

// Glass material opacity levels
const glassOpacity = {
  ultraLight: 0.02,
  light: 0.05,
  regular: 0.08,
  medium: 0.12,
  heavy: 0.18,
  ultraHeavy: 0.25,
} as const;

// Create glass material helper
const createGlass = (baseColor: string, opacity: number) => {
  // Extract RGB from hex
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Light theme colors
const lightTheme = {
  // Background colors
  background: {
    primary: baseColors.neutral[50],
    secondary: baseColors.neutral[100],
    tertiary: baseColors.neutral[200],
    elevated: "#FFFFFF",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Surface colors
  surface: {
    primary: "#FFFFFF",
    secondary: baseColors.neutral[50],
    tertiary: baseColors.neutral[100],
    elevated: "#FFFFFF",
    disabled: baseColors.neutral[200],
  },

  // Text colors
  text: {
    primary: baseColors.neutral[900],
    secondary: baseColors.neutral[700],
    tertiary: baseColors.neutral[600],
    muted: baseColors.neutral[500],
    disabled: baseColors.neutral[400],
    inverse: "#FFFFFF",
    onPrimary: "#FFFFFF",
    onSecondary: baseColors.neutral[900],
  },

  // Glass materials for light theme
  glass: {
    primary: createGlass("#FFFFFF", glassOpacity.regular),
    secondary: createGlass("#FFFFFF", glassOpacity.light),
    tertiary: createGlass("#FFFFFF", glassOpacity.ultraLight),
    accent: createGlass("#FFFFFF", glassOpacity.medium),
    heavy: createGlass("#FFFFFF", glassOpacity.heavy),
    ultraHeavy: createGlass("#FFFFFF", glassOpacity.ultraHeavy),

    // Interactive states
    hover: createGlass("#FFFFFF", glassOpacity.medium),
    pressed: createGlass("#FFFFFF", glassOpacity.heavy),
    focused: createGlass(baseColors.brand.primary, glassOpacity.light),
    disabled: createGlass("#FFFFFF", glassOpacity.ultraLight),
  },

  // Dark glass for contrast on light backgrounds
  darkGlass: {
    primary: createGlass("#000000", glassOpacity.regular),
    secondary: createGlass("#000000", glassOpacity.light),
    tertiary: createGlass("#000000", glassOpacity.ultraLight),
    accent: createGlass("#000000", glassOpacity.medium),
  },

  // Border colors
  border: {
    primary: baseColors.neutral[200],
    secondary: baseColors.neutral[300],
    tertiary: baseColors.neutral[400],
    glass: createGlass("#FFFFFF", 0.2),
    darkGlass: createGlass("#000000", 0.1),
    accent: createGlass(baseColors.brand.primary, 0.3),
  },

  // Shadow colors
  shadow: {
    light: "rgba(0, 0, 0, 0.05)",
    medium: "rgba(0, 0, 0, 0.1)",
    heavy: "rgba(0, 0, 0, 0.15)",
    colored: createGlass(baseColors.brand.primary, 0.15),
  },
} as const;

// Dark theme colors
const darkTheme = {
  // Background colors
  background: {
    primary: baseColors.neutral[950],
    secondary: baseColors.neutral[900],
    tertiary: baseColors.neutral[800],
    elevated: baseColors.neutral[900],
    overlay: "rgba(0, 0, 0, 0.7)",
  },

  // Surface colors
  surface: {
    primary: baseColors.neutral[900],
    secondary: baseColors.neutral[800],
    tertiary: baseColors.neutral[700],
    elevated: baseColors.neutral[800],
    disabled: baseColors.neutral[700],
  },

  // Text colors
  text: {
    primary: "#FFFFFF",
    secondary: baseColors.neutral[200],
    tertiary: baseColors.neutral[300],
    muted: baseColors.neutral[400],
    disabled: baseColors.neutral[600],
    inverse: baseColors.neutral[900],
    onPrimary: "#FFFFFF",
    onSecondary: baseColors.neutral[900],
  },

  // Glass materials for dark theme
  glass: {
    primary: createGlass("#FFFFFF", glassOpacity.regular),
    secondary: createGlass("#FFFFFF", glassOpacity.light),
    tertiary: createGlass("#FFFFFF", glassOpacity.ultraLight),
    accent: createGlass("#FFFFFF", glassOpacity.medium),
    heavy: createGlass("#FFFFFF", glassOpacity.heavy),
    ultraHeavy: createGlass("#FFFFFF", glassOpacity.ultraHeavy),

    // Interactive states
    hover: createGlass("#FFFFFF", glassOpacity.medium),
    pressed: createGlass("#FFFFFF", glassOpacity.heavy),
    focused: createGlass(baseColors.brand.primary, glassOpacity.medium),
    disabled: createGlass("#FFFFFF", glassOpacity.ultraLight),
  },

  // Dark glass for contrast on dark backgrounds
  darkGlass: {
    primary: createGlass("#000000", glassOpacity.medium),
    secondary: createGlass("#000000", glassOpacity.regular),
    tertiary: createGlass("#000000", glassOpacity.light),
    accent: createGlass("#000000", glassOpacity.heavy),
  },

  // Border colors
  border: {
    primary: baseColors.neutral[700],
    secondary: baseColors.neutral[600],
    tertiary: baseColors.neutral[500],
    glass: createGlass("#FFFFFF", 0.15),
    darkGlass: createGlass("#000000", 0.2),
    accent: createGlass(baseColors.brand.primary, 0.4),
  },

  // Shadow colors
  shadow: {
    light: "rgba(0, 0, 0, 0.3)",
    medium: "rgba(0, 0, 0, 0.5)",
    heavy: "rgba(0, 0, 0, 0.7)",
    colored: createGlass(baseColors.brand.primary, 0.3),
  },
} as const;

// Common colors (theme-independent)
const commonColors = {
  // Brand colors
  brand: baseColors.brand,

  // Accent colors
  accent: {
    ...baseColors.accent,
    // Alpha variants
    successAlpha: createGlass(baseColors.accent.success, 0.2),
    warningAlpha: createGlass(baseColors.accent.warning, 0.2),
    errorAlpha: createGlass(baseColors.accent.error, 0.2),
    infoAlpha: createGlass(baseColors.accent.info, 0.2),

    // Light variants
    successLight: createGlass(baseColors.accent.success, 0.1),
    warningLight: createGlass(baseColors.accent.warning, 0.1),
    errorLight: createGlass(baseColors.accent.error, 0.1),
    infoLight: createGlass(baseColors.accent.info, 0.1),
  },

  // Weather colors
  weather: {
    ...baseColors.weather,
    // Weather gradients
    sunny: {
      gradient: ["#FFD700", "#FFA000", "#FF8F00"],
      background: createGlass(baseColors.weather.sunny, 0.1),
    },
    cloudy: {
      gradient: ["#9CA3AF", "#6B7280", "#4B5563"],
      background: createGlass(baseColors.weather.cloudy, 0.1),
    },
    rainy: {
      gradient: ["#3B82F6", "#1D4ED8", "#1E40AF"],
      background: createGlass(baseColors.weather.rainy, 0.1),
    },
    snowy: {
      gradient: ["#E5E7EB", "#D1D5DB", "#9CA3AF"],
      background: createGlass(baseColors.weather.snowy, 0.1),
    },
    stormy: {
      gradient: ["#6B7280", "#374151", "#1F2937"],
      background: createGlass(baseColors.weather.stormy, 0.1),
    },
  },

  // Gradient collections
  gradients: {
    primary: [baseColors.brand.primary, baseColors.brand.secondary],
    sunset: ["#FF6B6B", "#FFE66D", "#FF6B6B"],
    ocean: ["#667eea", "#764ba2"],
    aurora: ["#a8edea", "#fed6e3"],
    cosmic: ["#d299c2", "#fef9d7"],
    forest: ["#134e5e", "#71b280"],
    fire: ["#f12711", "#f5af19"],
    ice: ["#a8edea", "#fed6e3"],
  },

  // Utility colors
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#000000",
} as const;

// Theme selector
export const getThemeColors = (colorScheme: ColorSchemeName) => {
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? darkTheme : lightTheme;

  return {
    ...commonColors,
    ...themeColors,
    isDark,
  };
};

// Default export for backward compatibility
export const colors = getThemeColors("light");

// Type definitions
export type ThemeColors = ReturnType<typeof getThemeColors>;
export type ColorScheme = "light" | "dark";

// Helper functions
export const createGlassMaterial = (
  baseColor: string = "#FFFFFF",
  opacity: number = glassOpacity.regular,
) => createGlass(baseColor, opacity);

export const createColoredGlass = (
  r: number,
  g: number,
  b: number,
  opacity: number,
) => `rgba(${r}, ${g}, ${b}, ${opacity})`;

// Glass material presets
export const glassMaterials = {
  ultraLight: glassOpacity.ultraLight,
  light: glassOpacity.light,
  regular: glassOpacity.regular,
  medium: glassOpacity.medium,
  heavy: glassOpacity.heavy,
  ultraHeavy: glassOpacity.ultraHeavy,
} as const;

// Weather condition gradients
export const weatherGradients = {
  clear: {
    day: ["#87CEEB", "#98D8E8", "#F0F8FF"],
    night: ["#191970", "#483D8B", "#6A5ACD"],
  },
  cloudy: {
    day: ["#696969", "#A9A9A9", "#D3D3D3"],
    night: ["#2F4F4F", "#696969", "#A9A9A9"],
  },
  rainy: {
    day: ["#4682B4", "#87CEEB", "#B0E0E6"],
    night: ["#191970", "#4682B4", "#87CEEB"],
  },
  stormy: {
    day: ["#2F4F4F", "#696969", "#A9A9A9"],
    night: ["#000000", "#2F4F4F", "#696969"],
  },
  snowy: {
    day: ["#E0E0E0", "#F5F5F5", "#FFFFFF"],
    night: ["#4B0082", "#E0E0E6", "#F5F5F5"],
  },
} as const;
