export const colors = {
  // Advanced Glassmorphism Materials
  glass: {
    // Primary glass surfaces with varying opacity
    primary: "rgba(255, 255, 255, 0.12)",
    secondary: "rgba(255, 255, 255, 0.08)",
    tertiary: "rgba(255, 255, 255, 0.05)",
    accent: "rgba(255, 255, 255, 0.18)",

    // Material variants
    frosted: "rgba(255, 255, 255, 0.15)",
    crystal: "rgba(255, 255, 255, 0.06)",
    mirror: "rgba(255, 255, 255, 0.25)",
    subtle: "rgba(255, 255, 255, 0.03)",

    // Interactive states
    hover: "rgba(255, 255, 255, 0.2)",
    pressed: "rgba(255, 255, 255, 0.25)",
    focused: "rgba(255, 255, 255, 0.15)",
    disabled: "rgba(255, 255, 255, 0.04)",
  },

  // Dark glass materials for contrast
  darkGlass: {
    primary: "rgba(0, 0, 0, 0.12)",
    secondary: "rgba(0, 0, 0, 0.08)",
    tertiary: "rgba(0, 0, 0, 0.05)",
    accent: "rgba(0, 0, 0, 0.18)",
    frosted: "rgba(0, 0, 0, 0.15)",
  },

  // Gradient backgrounds with glassmorphism
  gradient: {
    // Sky gradients
    clearSky: [
      "rgba(135, 206, 235, 0.6)",
      "rgba(173, 216, 230, 0.4)",
      "rgba(240, 248, 255, 0.2)",
    ] as string[],
    cloudy: [
      "rgba(105, 105, 105, 0.5)",
      "rgba(169, 169, 169, 0.3)",
      "rgba(211, 211, 211, 0.2)",
    ] as string[],
    sunset: [
      "rgba(255, 94, 77, 0.6)",
      "rgba(255, 154, 0, 0.4)",
      "rgba(255, 206, 84, 0.3)",
    ] as string[],
    night: [
      "rgba(25, 25, 112, 0.7)",
      "rgba(72, 61, 139, 0.5)",
      "rgba(106, 90, 205, 0.3)",
    ] as string[],
    storm: [
      "rgba(47, 79, 79, 0.7)",
      "rgba(105, 105, 105, 0.5)",
      "rgba(169, 169, 169, 0.3)",
    ] as string[],

    // App theme gradients
    primary: [
      "rgba(147, 51, 234, 0.15)",
      "rgba(59, 130, 246, 0.12)",
      "rgba(16, 185, 129, 0.08)",
    ] as string[],
    secondary: [
      "rgba(236, 72, 153, 0.12)",
      "rgba(251, 146, 60, 0.10)",
      "rgba(34, 197, 94, 0.08)",
    ] as string[],
    accent: [
      "rgba(168, 85, 247, 0.15)",
      "rgba(59, 130, 246, 0.12)",
      "rgba(14, 165, 233, 0.10)",
    ] as string[],
  },

  // Enhanced text colors for glass surfaces
  text: {
    primary: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.85)",
    tertiary: "rgba(255, 255, 255, 0.65)",
    muted: "rgba(255, 255, 255, 0.45)",
    caption: "rgba(255, 255, 255, 0.35)",
    placeholder: "rgba(255, 255, 255, 0.25)",

    // High contrast variants
    highContrast: "#ffffff",
    mediumContrast: "rgba(255, 255, 255, 0.9)",
    lowContrast: "rgba(255, 255, 255, 0.7)",
  },

  // Accent colors with transparency variants
  accent: {
    primary: "#8b5cf6",
    primaryAlpha: "rgba(139, 92, 246, 0.8)",
    primaryLight: "rgba(139, 92, 246, 0.3)",
    primarySubtle: "rgba(139, 92, 246, 0.15)",

    secondary: "#3b82f6",
    secondaryAlpha: "rgba(59, 130, 246, 0.8)",
    secondaryLight: "rgba(59, 130, 246, 0.3)",
    secondarySubtle: "rgba(59, 130, 246, 0.15)",

    success: "#22c55e",
    successAlpha: "rgba(34, 197, 94, 0.8)",
    successLight: "rgba(34, 197, 94, 0.3)",
    successSubtle: "rgba(34, 197, 94, 0.15)",

    warning: "#f59e0b",
    warningAlpha: "rgba(245, 158, 11, 0.8)",
    warningLight: "rgba(245, 158, 11, 0.3)",
    warningSubtle: "rgba(245, 158, 11, 0.15)",

    error: "#ef4444",
    errorAlpha: "rgba(239, 68, 68, 0.8)",
    errorLight: "rgba(239, 68, 68, 0.3)",
    errorSubtle: "rgba(239, 68, 68, 0.15)",

    info: "#06b6d4",
    infoAlpha: "rgba(6, 182, 212, 0.8)",
    infoLight: "rgba(6, 182, 212, 0.3)",
    infoSubtle: "rgba(6, 182, 212, 0.15)",
  },

  // Border colors for glass effects
  border: {
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.15)",
    strong: "rgba(255, 255, 255, 0.25)",
    accent: "rgba(139, 92, 246, 0.3)",
    success: "rgba(34, 197, 94, 0.3)",
    warning: "rgba(245, 158, 11, 0.3)",
    error: "rgba(239, 68, 68, 0.3)",
  },

  // Shadow colors for depth
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.2)",
    strong: "rgba(0, 0, 0, 0.3)",
    colored: "rgba(139, 92, 246, 0.2)",
  },

  // Base utility colors
  base: {
    transparent: "transparent",
    white: "#ffffff",
    black: "#000000",
    whiteAlpha: "rgba(255, 255, 255, 0.1)",
    blackAlpha: "rgba(0, 0, 0, 0.1)",
  },

  // Weather-specific colors
  weather: {
    sunny: {
      primary: "rgba(255, 193, 7, 0.8)",
      secondary: "rgba(255, 235, 59, 0.6)",
      background: "rgba(255, 193, 7, 0.1)",
    },
    cloudy: {
      primary: "rgba(158, 158, 158, 0.8)",
      secondary: "rgba(189, 189, 189, 0.6)",
      background: "rgba(158, 158, 158, 0.1)",
    },
    rainy: {
      primary: "rgba(33, 150, 243, 0.8)",
      secondary: "rgba(100, 181, 246, 0.6)",
      background: "rgba(33, 150, 243, 0.1)",
    },
    snowy: {
      primary: "rgba(224, 224, 224, 0.8)",
      secondary: "rgba(245, 245, 245, 0.6)",
      background: "rgba(224, 224, 224, 0.1)",
    },
    stormy: {
      primary: "rgba(96, 125, 139, 0.8)",
      secondary: "rgba(144, 164, 174, 0.6)",
      background: "rgba(96, 125, 139, 0.1)",
    },
  },
} as const;

export type Colors = typeof colors;

// Helper function to create glass material with custom opacity
export const createGlassMaterial = (opacity: number) =>
  `rgba(255, 255, 255, ${opacity})`;

// Helper function to create colored glass material
export const createColoredGlass = (
  r: number,
  g: number,
  b: number,
  opacity: number,
) => `rgba(${r}, ${g}, ${b}, ${opacity})`;

// Predefined glass material presets
export const glassMaterials = {
  ultraLight: createGlassMaterial(0.02),
  light: createGlassMaterial(0.05),
  regular: createGlassMaterial(0.1),
  medium: createGlassMaterial(0.15),
  heavy: createGlassMaterial(0.2),
  ultraHeavy: createGlassMaterial(0.3),
} as const;
