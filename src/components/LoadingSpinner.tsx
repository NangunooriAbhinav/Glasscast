import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { GlassContainer } from './Glass/GlassContainer';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.text.primary,
  message,
  style,
  textStyle,
  overlay = false,
}) => {
  const spinnerSize = size === 'large' ? 'large' : 'small';

  const containerStyle: ViewStyle = {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: size === 'large' ? 120 : 80,
    ...style,
  };

  const textStyleDefault: TextStyle = {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    marginTop: spacing.md,
    textAlign: 'center',
    ...textStyle,
  };

  if (overlay) {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.glass.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <GlassContainer
          blurIntensity={30}
          borderRadius={spacing.radius.xl}
          style={containerStyle}
        >
          <ActivityIndicator size={spinnerSize} color={color} />
          {message && <Text style={textStyleDefault}>{message}</Text>}
        </GlassContainer>
      </View>
    );
  }

  return (
    <GlassContainer
      blurIntensity={20}
      borderRadius={spacing.radius.lg}
      style={containerStyle}
    >
      <ActivityIndicator size={spinnerSize} color={color} />
      {message && <Text style={textStyleDefault}>{message}</Text>}
    </GlassContainer>
  );
};