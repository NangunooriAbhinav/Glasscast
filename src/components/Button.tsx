import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!loading && !disabled) {
      onPress();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.glass.secondary,
          borderColor: colors.glass.primary,
        };
      case 'accent':
        return {
          backgroundColor: colors.glass.accent,
          borderColor: colors.accent.primary,
        };
      default: // primary
        return {
          backgroundColor: colors.glass.primary,
          borderColor: colors.glass.secondary,
        };
    }
  };

  const buttonStyle: ViewStyle = {
    ...getVariantStyles(),
    borderWidth: 0.5,
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.base.black,
    shadowOffset: spacing.shadowOffset.sm,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const textStyleDefault: TextStyle = {
    color: colors.text.primary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
    ...textStyle,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading || disabled}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.text.primary} size="small" />
        ) : (
          <Text style={textStyleDefault}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};