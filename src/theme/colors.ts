export const colors = {
  // Glassmorphism colors with transparency
  glass: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    tertiary: 'rgba(255, 255, 255, 0.03)',
    accent: 'rgba(255, 255, 255, 0.15)',
  },

  // Background gradients
  gradient: {
    primary: ['rgba(147, 51, 234, 0.1)', 'rgba(59, 130, 246, 0.1)'],
    secondary: ['rgba(236, 72, 153, 0.1)', 'rgba(139, 69, 19, 0.1)'],
    accent: ['rgba(34, 197, 94, 0.1)', 'rgba(59, 130, 246, 0.1)'],
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
  },

  // Accent colors
  accent: {
    primary: '#8b5cf6',
    secondary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },

  // Base colors
  base: {
    transparent: 'transparent',
    white: '#ffffff',
    black: '#000000',
  },
} as const;

export type Colors = typeof colors;