export const spacing = {
  // Base spacing scale (4px increments)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
  '6xl': 128,

  // Border radius scale
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },

  // Border width scale
  borderWidth: {
    none: 0,
    hairline: 0.5,
    thin: 1,
    thick: 2,
    heavy: 4,
  },

  // Shadow offset scale
  shadowOffset: {
    xs: { width: 0, height: 1 },
    sm: { width: 0, height: 2 },
    md: { width: 0, height: 4 },
    lg: { width: 0, height: 8 },
    xl: { width: 0, height: 16 },
  },
} as const;

export type Spacing = typeof spacing;