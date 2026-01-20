import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  opacity?: number;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  elevation?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = 30,
  borderRadius = spacing.radius.xl,
  opacity = 0.9,
  style,
  padding = 'lg',
  margin,
  elevation = 'medium',
}) => {
  const getElevationStyles = (level: typeof elevation) => {
    switch (level) {
      case 'low':
        return {
          shadowOffset: spacing.shadowOffset.sm,
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        };
      case 'high':
        return {
          shadowOffset: spacing.shadowOffset.md,
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        };
      default: // medium
        return {
          shadowOffset: spacing.shadowOffset.sm,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    shadowColor: colors.base.black,
    ...getElevationStyles(elevation),
    borderWidth: 0.5,
    borderColor: colors.glass.tertiary,
    ...(padding && { padding: spacing[padding] }),
    ...(margin && { margin: spacing[margin] }),
    ...style,
  };

  return (
    <View style={containerStyle}>
      <BlurView
        intensity={blurIntensity}
        tint="light"
        style={{
          flex: 1,
          opacity,
          borderRadius,
        }}
      >
        {children}
      </BlurView>
    </View>
  );
};