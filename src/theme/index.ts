export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./effects";

// Export theme context
export {
  ThemeProvider,
  useTheme,
  useThemedStyles,
} from "../context/ThemeContext";

// Re-export commonly used theme utilities
export {
  createGlassMaterial,
  createColoredGlass,
  glassMaterials,
  getThemeColors,
  weatherGradients,
  type ThemeColors,
  type ColorScheme,
} from "./colors";

// Import glassMaterials for use in utilities
import { glassMaterials } from "./colors";

export {
  glassEffects,
  animations,
  lightEffects,
  glassUtilities,
  type GlassMaterial,
  type ShadowType,
  type BorderType,
  type TintType,
  type AnimationType,
  type LightEffect,
} from "./effects";

// Legacy export for backward compatibility
import { getThemeColors } from "./colors";
export const colors = getThemeColors("light");

// Theme configuration object
export const theme = {
  // Common breakpoints
  breakpoints: {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  // Z-index layers
  zIndex: {
    background: -1,
    base: 0,
    content: 1,
    card: 10,
    dropdown: 20,
    overlay: 50,
    modal: 100,
    popover: 200,
    tooltip: 300,
    toast: 400,
    maximum: 999,
  },

  // Animation durations
  duration: {
    fastest: 150,
    fast: 200,
    normal: 300,
    slow: 500,
    slowest: 700,
  },

  // Common border radius values
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    "3xl": 32,
    full: 9999,
  },

  // Elevation/shadow levels
  elevation: {
    none: 0,
    xs: 1,
    sm: 2,
    base: 3,
    md: 4,
    lg: 6,
    xl: 8,
    "2xl": 12,
    "3xl": 16,
  },

  // Glass blur intensity levels
  blur: {
    none: 0,
    xs: 4,
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 40,
    "3xl": 64,
  },
} as const;

export type Theme = typeof theme;

// Theme utilities
export const themeUtils = {
  // Get responsive value based on screen width
  getResponsiveValue: <T>(
    values: Record<keyof typeof theme.breakpoints, T>,
    screenWidth: number,
  ): T => {
    const breakpoints = theme.breakpoints;
    if (screenWidth >= breakpoints.xxl) return values.xxl || values.xl;
    if (screenWidth >= breakpoints.xl) return values.xl || values.lg;
    if (screenWidth >= breakpoints.lg) return values.lg || values.md;
    if (screenWidth >= breakpoints.md) return values.md || values.sm;
    if (screenWidth >= breakpoints.sm) return values.sm || values.xs;
    return values.xs;
  },

  // Convert elevation to shadow style
  elevationToShadow: (elevation: number, isDark = false) => {
    const shadowColor = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";
    return {
      shadowColor,
      shadowOffset: {
        width: 0,
        height: Math.max(1, Math.floor(elevation / 2)),
      },
      shadowOpacity: Math.min(0.3, elevation * 0.05),
      shadowRadius: Math.max(1, elevation),
      elevation: elevation,
    };
  },

  // Convert blur intensity to style
  blurToStyle: (intensity: number) => ({
    backdropFilter: `blur(${intensity}px)`,
  }),

  // Create glassmorphism style
  createGlassStyle: (
    material: keyof typeof glassMaterials = "regular",
    borderRadius = theme.borderRadius.lg,
    elevation = theme.elevation.sm,
    isDark = false,
  ) => ({
    backgroundColor: `rgba(255, 255, 255, ${glassMaterials[material]})`,
    borderRadius,
    borderWidth: 1,
    borderColor: isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.2)",
    ...themeUtils.elevationToShadow(elevation, isDark),
  }),
} as const;
