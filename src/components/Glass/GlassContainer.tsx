import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface GlassContainerProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  opacity?: number;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  blurIntensity = 20,
  borderRadius = spacing.radius.lg,
  opacity = 0.8,
  style,
  padding = 'md',
  margin,
}) => {
  const containerStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    shadowColor: colors.base.black,
    shadowOffset: spacing.shadowOffset.sm,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.glass.secondary,
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
        }}
      >
        {children}
      </BlurView>
    </View>
  );
};