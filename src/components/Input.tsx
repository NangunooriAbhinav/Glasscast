import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.glass.secondary, colors.accent.primary],
  });

  const labelPosition = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [typography.size.base, typography.size.sm],
  });

  const containerStyle: ViewStyle = {
    marginBottom: spacing.lg,
    ...style,
  };

  const inputContainerStyle: ViewStyle = {
    backgroundColor: colors.glass.primary,
    borderWidth: 0.5,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    justifyContent: 'center',
    shadowColor: colors.base.black,
    shadowOffset: spacing.shadowOffset.xs,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderColor: error ? colors.accent.error : borderColor,
  };

  const inputStyleDefault: TextStyle = {
    color: colors.text.primary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    paddingRight: secureTextEntry ? spacing.xl : 0,
    ...inputStyle,
  };

  const labelStyle: TextStyle = {
    position: 'absolute',
    left: spacing.md,
    color: isFocused || value ? colors.accent.primary : colors.text.secondary,
    fontSize: labelSize,
    fontWeight: typography.weight.medium,
    backgroundColor: colors.base.transparent,
    paddingHorizontal: spacing.xs,
    transform: [{ translateY: labelPosition }],
  };

  return (
    <View style={containerStyle}>
      <Animated.View style={inputContainerStyle}>
        {label && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={inputStyleDefault}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: spacing.md,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{
              color: colors.text.secondary,
              fontSize: typography.size.sm,
            }}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Text style={{
          color: colors.accent.error,
          fontSize: typography.size.sm,
          marginTop: spacing.xs,
          marginLeft: spacing.xs,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};