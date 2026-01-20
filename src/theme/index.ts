export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./effects";

// Re-export commonly used theme utilities
export {
  createGlassMaterial,
  createColoredGlass,
  glassMaterials,
} from "./colors";

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

// Theme configuration object
export const theme = {
  // Import all theme modules
  colors: {} as import("./colors").Colors,
  typography: {} as import("./typography").Typography,
  spacing: {} as import("./spacing").Spacing,
  effects: {} as typeof import("./effects").glassEffects,
  animations: {} as typeof import("./effects").animations,
  lightEffects: {} as typeof import("./effects").lightEffects,

  // Common breakpoints
  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Z-index layers
  zIndex: {
    background: -1,
    base: 0,
    content: 1,
    card: 10,
    overlay: 50,
    modal: 100,
    popover: 200,
    tooltip: 300,
    toast: 400,
    maximum: 999,
  },
} as const;

export type Theme = typeof theme;
