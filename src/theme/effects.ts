export const blurIntensity = {
  none: 0,
  subtle: 10,
  light: 20,
  medium: 30,
  heavy: 50,
  extreme: 80,
} as const;

export const glassEffects = {
  // Blur configurations for different materials
  blur: {
    ultraLight: 5,
    light: 15,
    regular: 25,
    medium: 35,
    heavy: 50,
    frosted: 60,
    crystal: 80,
  },

  // Shadow configurations for depth
  shadows: {
    subtle: {
      shadowColor: "rgba(0, 0, 0, 0.05)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    light: {
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "rgba(0, 0, 0, 0.15)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    heavy: {
      shadowColor: "rgba(0, 0, 0, 0.2)",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 8,
    },
    dramatic: {
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 12,
    },
    colored: {
      shadowColor: "rgba(139, 92, 246, 0.3)",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 6,
    },
  },

  // Border configurations for glass edges
  borders: {
    none: {
      borderWidth: 0,
    },
    subtle: {
      borderWidth: 0.5,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    light: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
    medium: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    strong: {
      borderWidth: 1.5,
      borderColor: "rgba(255, 255, 255, 0.25)",
    },
    gradient: {
      borderWidth: 1,
      borderColor: "rgba(139, 92, 246, 0.3)",
    },
  },

  // Backdrop filters and tints
  tints: {
    clear: "light",
    warm: "light",
    cool: "light",
    dark: "dark",
    extraLight: "extraLight",
    regular: "regular",
    prominent: "prominent",
    systemUltraThinMaterial: "systemUltraThinMaterial",
    systemThinMaterial: "systemThinMaterial",
    systemMaterial: "systemMaterial",
    systemThickMaterial: "systemThickMaterial",
    systemChromeMaterial: "systemChromeMaterial",
  } as const,

  // Glass material presets
  materials: {
    ultraLight: {
      blur: 5,
      opacity: 0.02,
      border: "none",
      shadow: "subtle",
      tint: "clear",
    },
    light: {
      blur: 15,
      opacity: 0.05,
      border: "subtle",
      shadow: "light",
      tint: "clear",
    },
    regular: {
      blur: 25,
      opacity: 0.1,
      border: "light",
      shadow: "medium",
      tint: "light",
    },
    medium: {
      blur: 35,
      opacity: 0.15,
      border: "medium",
      shadow: "medium",
      tint: "regular",
    },
    heavy: {
      blur: 50,
      opacity: 0.2,
      border: "strong",
      shadow: "heavy",
      tint: "prominent",
    },
    frosted: {
      blur: 60,
      opacity: 0.15,
      border: "light",
      shadow: "medium",
      tint: "systemThinMaterial",
    },
    crystal: {
      blur: 80,
      opacity: 0.06,
      border: "subtle",
      shadow: "colored",
      tint: "extraLight",
    },
    mirror: {
      blur: 20,
      opacity: 0.25,
      border: "gradient",
      shadow: "dramatic",
      tint: "systemChromeMaterial",
    },
  },
} as const;

export const animations = {
  // Timing presets
  timing: {
    instant: 0,
    quick: 150,
    fast: 250,
    medium: 350,
    slow: 500,
    slower: 750,
    slowest: 1000,
  },

  // Easing curves
  easing: {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    bounceIn: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
    bounceOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    spring: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
    gentle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  },

  // Glass-specific animations
  glassTransitions: {
    materialChange: {
      duration: 350,
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },
    blurChange: {
      duration: 500,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    opacityChange: {
      duration: 250,
      easing: "ease-in-out",
    },
    scaleChange: {
      duration: 200,
      easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    slideIn: {
      duration: 400,
      easing: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
    },
    slideOut: {
      duration: 300,
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },
  },

  // Micro-interactions
  microInteractions: {
    tap: {
      scale: 0.95,
      duration: 100,
      easing: "ease-out",
    },
    hover: {
      scale: 1.02,
      duration: 200,
      easing: "ease-out",
    },
    focus: {
      scale: 1.01,
      duration: 150,
      easing: "ease-in-out",
    },
    press: {
      scale: 0.98,
      duration: 50,
      easing: "ease-in",
    },
  },

  // Loading animations
  loading: {
    pulse: {
      duration: 1000,
      easing: "ease-in-out",
      iterations: "infinite",
      direction: "alternate",
    },
    shimmer: {
      duration: 1500,
      easing: "linear",
      iterations: "infinite",
    },
    breathe: {
      duration: 2000,
      easing: "ease-in-out",
      iterations: "infinite",
      direction: "alternate",
    },
  },
} as const;

// Light effects for dynamic glass appearance
export const lightEffects = {
  // Ambient light configurations
  ambient: {
    soft: {
      intensity: 0.3,
      color: "rgba(255, 255, 255, 0.1)",
      blur: 20,
    },
    medium: {
      intensity: 0.5,
      color: "rgba(255, 255, 255, 0.15)",
      blur: 30,
    },
    bright: {
      intensity: 0.7,
      color: "rgba(255, 255, 255, 0.2)",
      blur: 40,
    },
  },

  // Directional light effects
  directional: {
    topLeft: {
      angle: 135,
      intensity: 0.4,
      spread: 20,
    },
    topRight: {
      angle: 45,
      intensity: 0.4,
      spread: 20,
    },
    bottomLeft: {
      angle: 225,
      intensity: 0.3,
      spread: 15,
    },
    bottomRight: {
      angle: 315,
      intensity: 0.3,
      spread: 15,
    },
  },

  // Highlight effects
  highlights: {
    subtle: "rgba(255, 255, 255, 0.05)",
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.15)",
    strong: "rgba(255, 255, 255, 0.2)",
    dramatic: "rgba(255, 255, 255, 0.3)",
  },

  // Reflection effects
  reflections: {
    none: "transparent",
    subtle:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
    light:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 60%)",
    medium:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
    strong:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 80%)",
  },
} as const;

// Depth layers for z-index management
export const depthLayers = {
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
} as const;

// Responsive breakpoints for glass effects
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Glass effect utilities
export const glassUtilities = {
  // Create a glass style object
  createGlassStyle: (material: keyof typeof glassEffects.materials) => {
    const config = glassEffects.materials[material];
    const borderConfig = glassEffects.borders[config.border];
    return {
      backgroundColor: `rgba(255, 255, 255, ${config.opacity})`,
      borderRadius: 16,
      borderWidth: borderConfig.borderWidth || 0,
      borderColor:
        "borderColor" in borderConfig
          ? borderConfig.borderColor
          : "transparent",
      ...glassEffects.shadows[config.shadow],
    };
  },

  // Create animated glass style
  createAnimatedGlassStyle: (
    material: keyof typeof glassEffects.materials,
    animationType: keyof typeof animations.glassTransitions,
  ) => ({
    ...glassUtilities.createGlassStyle(material),
    transition: `all ${animations.glassTransitions[animationType].duration}ms ${animations.glassTransitions[animationType].easing}`,
  }),

  // Create glass with custom properties
  createCustomGlass: (
    opacity: number,
    blur: number,
    borderOpacity: number = 0.1,
  ) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
    backdropFilter: `blur(${blur}px)`,
    ...glassEffects.shadows.medium,
  }),
} as const;

export type GlassMaterial = keyof typeof glassEffects.materials;
export type ShadowType = keyof typeof glassEffects.shadows;
export type BorderType = keyof typeof glassEffects.borders;
export type TintType = keyof typeof glassEffects.tints;
export type AnimationType = keyof typeof animations.glassTransitions;
export type LightEffect = keyof typeof lightEffects.ambient;
