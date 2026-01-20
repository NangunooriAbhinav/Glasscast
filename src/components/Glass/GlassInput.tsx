import React, { useMemo, useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
  Animated,
  Pressable,
  TextInputProps,
} from "react-native";
import { BlurView, BlurTint } from "expo-blur";
import {
  colors,
  spacing,
  typography,
  glassEffects,
  animations,
  type GlassMaterial,
  type ShadowType,
  type BorderType,
} from "../../theme";

export interface GlassInputProps extends Omit<TextInputProps, "style"> {
  // Content
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  value?: string;
  onChangeText?: (text: string) => void;

  // Input variants
  variant?: "outlined" | "filled" | "underlined" | "borderless";
  size?: "small" | "medium" | "large";

  // Material and appearance
  material?: GlassMaterial;
  customOpacity?: number;
  customBlur?: number;
  tint?: BlurTint;

  // Layout and spacing
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  borderRadius?: number | keyof typeof spacing.radius;

  // Border and shadow
  borderType?: BorderType;
  shadowType?: ShadowType;
  customBorderColor?: string;
  customBorderWidth?: number;
  focusBorderColor?: string;
  errorBorderColor?: string;

  // States
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  loading?: boolean;

  // Icons and actions
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;

  // Animation and interactions
  animated?: boolean;
  animationDuration?: number;
  enableFocusScale?: boolean;
  focusScale?: number;

  // Typography
  fontSize?: keyof typeof typography.size;
  fontWeight?: keyof typeof typography.weight;
  textColor?: string;
  placeholderColor?: string;
  labelColor?: string;
  helperColor?: string;
  errorColor?: string;

  // Advanced features
  enableGlow?: boolean;
  glowColor?: string;
  enableReflection?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCharacterCount?: boolean;

  // Events
  onFocus?: () => void;
  onBlur?: () => void;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  placeholder,
  helperText,
  errorText,
  value,
  onChangeText,
  variant = "outlined",
  size = "medium",
  material = "regular",
  customOpacity,
  customBlur,
  tint = "light",
  style,
  inputStyle,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  containerStyle,
  fullWidth = false,
  borderRadius = "lg",
  borderType,
  shadowType,
  customBorderColor,
  customBorderWidth,
  focusBorderColor,
  errorBorderColor,
  disabled = false,
  error = false,
  required = false,
  loading = false,
  leftIcon,
  rightIcon,
  clearable = false,
  onClear,
  animated = true,
  animationDuration = 200,
  enableFocusScale = false,
  focusScale = 1.02,
  fontSize,
  fontWeight = "normal",
  textColor,
  placeholderColor,
  labelColor,
  helperColor,
  errorColor,
  enableGlow = false,
  glowColor,
  enableReflection = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCharacterCount = false,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedScale] = useState(new Animated.Value(1));
  const inputRef = useRef<TextInput>(null);

  // Get material configuration
  const materialConfig = glassEffects.materials[material];

  // Calculate effective values
  const effectiveOpacity = customOpacity ?? materialConfig.opacity;
  const effectiveBlur = customBlur ?? materialConfig.blur;
  const effectiveBorderType = borderType ?? materialConfig.border;
  const effectiveShadowType = shadowType ?? materialConfig.shadow;

  // Get size configuration
  const getSizeConfig = useMemo(() => {
    switch (size) {
      case "small":
        return {
          height: 36,
          padding: spacing.sm,
          fontSize: typography.size.sm,
          iconSize: 16,
        };
      case "medium":
        return {
          height: 44,
          padding: spacing.md,
          fontSize: typography.size.base,
          iconSize: 20,
        };
      case "large":
        return {
          height: 52,
          padding: spacing.lg,
          fontSize: typography.size.lg,
          iconSize: 24,
        };
      default:
        return {
          height: 44,
          padding: spacing.md,
          fontSize: typography.size.base,
          iconSize: 20,
        };
    }
  }, [size]);

  // Get border radius value
  const getBorderRadius = useMemo(() => {
    if (typeof borderRadius === "number") {
      return borderRadius;
    }
    return spacing.radius[borderRadius];
  }, [borderRadius]);

  // Get variant configuration
  const getVariantConfig = useMemo(() => {
    const borderConfig = glassEffects.borders[effectiveBorderType];
    const shadowConfig = glassEffects.shadows[effectiveShadowType];

    switch (variant) {
      case "outlined":
        return {
          backgroundColor: `rgba(255, 255, 255, ${effectiveOpacity})`,
          borderWidth: customBorderWidth ?? borderConfig.borderWidth ?? 1,
          borderColor: error
            ? errorBorderColor ?? colors.accent.errorLight
            : isFocused
              ? focusBorderColor ?? colors.accent.primaryLight
              : customBorderColor ?? borderConfig.borderColor ?? colors.border.light,
          ...shadowConfig,
        };
      case "filled":
        return {
          backgroundColor: `rgba(255, 255, 255, ${effectiveOpacity * 1.5})`,
          borderWidth: 0,
          borderColor: "transparent",
          ...shadowConfig,
        };
      case "underlined":
        return {
          backgroundColor: "transparent",
          borderWidth: 0,
          borderBottomWidth: 2,
          borderColor: "transparent",
          borderBottomColor: error
            ? errorBorderColor ?? colors.accent.errorLight
            : isFocused
              ? focusBorderColor ?? colors.accent.primaryLight
              : customBorderColor ?? colors.border.light,
          borderRadius: 0,
          shadowOpacity: 0,
        };
      case "borderless":
        return {
          backgroundColor: `rgba(255, 255, 255, ${effectiveOpacity * 0.8})`,
          borderWidth: 0,
          borderColor: "transparent",
          shadowOpacity: 0,
        };
      default:
        return {
          backgroundColor: `rgba(255, 255, 255, ${effectiveOpacity})`,
          borderWidth: customBorderWidth ?? borderConfig.borderWidth ?? 1,
          borderColor: error
            ? errorBorderColor ?? colors.accent.errorLight
            : isFocused
              ? focusBorderColor ?? colors.accent.primaryLight
              : customBorderColor ?? borderConfig.borderColor ?? colors.border.light,
          ...shadowConfig,
        };
    }
  }, [
    variant,
    effectiveOpacity,
    effectiveBorderType,
    effectiveShadowType,
    customBorderWidth,
    customBorderColor,
    focusBorderColor,
    errorBorderColor,
    error,
    isFocused,
  ]);

  // Handle focus animations
  const handleFocus = () => {
    setIsFocused(true);
    if (enableFocusScale) {
      Animated.timing(animatedScale, {
        toValue: focusScale,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (enableFocusScale) {
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  // Create container style
  const containerViewStyle: ViewStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      width: fullWidth ? "100%" : undefined,
      minHeight: multiline ? getSizeConfig.height * numberOfLines : getSizeConfig.height,
      borderRadius: variant === "underlined" ? 0 : getBorderRadius,
      overflow: "hidden",
      ...getVariantConfig,

      // Glow effect
      ...(enableGlow && isFocused && {
        shadowColor: glowColor ?? colors.accent.primary,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
      }),

      // Disabled state
      ...(disabled && {
        opacity: 0.5,
      }),

      // Loading state
      ...(loading && {
        opacity: 0.7,
      }),
    };

    return baseStyle;
  }, [
    fullWidth,
    multiline,
    numberOfLines,
    getSizeConfig.height,
    variant,
    getBorderRadius,
    getVariantConfig,
    enableGlow,
    isFocused,
    glowColor,
    disabled,
    loading,
  ]);

  // Create input style
  const textInputStyle: TextStyle = useMemo(() => ({
    flex: 1,
    fontSize: fontSize ? typography.size[fontSize] : getSizeConfig.fontSize,
    fontWeight: typography.weight[fontWeight],
    color: textColor ?? colors.text.primary,
    paddingHorizontal: getSizeConfig.padding,
    paddingVertical: multiline ? getSizeConfig.padding : 0,
    textAlignVertical: multiline ? "top" : "center",
    minHeight: multiline ? getSizeConfig.height : undefined,
  }), [
    fontSize,
    getSizeConfig,
    fontWeight,
    textColor,
    multiline,
  ]);

  // Create label style
  const labelTextStyle: TextStyle = useMemo(() => ({
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: labelColor ?? colors.text.secondary,
    marginBottom: spacing.xs,
  }), [labelColor]);

  // Create helper text style
  const helperTextTextStyle: TextStyle = useMemo(() => ({
    fontSize: typography.size.xs,
    fontWeight: typography.weight.normal,
    color: error
      ? errorColor ?? colors.accent.error
      : helperColor ?? colors.text.muted,
    marginTop: spacing.xs,
  }), [error, errorColor, helperColor]);

  // Create character count style
  const characterCountStyle: TextStyle = useMemo(() => ({
    fontSize: typography.size.xs,
    fontWeight: typography.weight.normal,
    color: colors.text.muted,
    textAlign: "right",
    marginTop: spacing.xs,
  }), []);

  // Create input container style
  const inputContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: multiline ? "flex-start" : "center",
    paddingVertical: multiline ? getSizeConfig.padding : 0,
  };

  // Create icon style
  const iconContainerStyle: ViewStyle = {
    paddingHorizontal: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  };

  const InputContent = (
    <View style={[containerViewStyle, style]}>
      {variant === "filled" || variant === "outlined" ? (
        <BlurView
          intensity={effectiveBlur}
          tint={tint}
          style={{
            flex: 1,
            backgroundColor: getVariantConfig.backgroundColor,
            borderRadius: variant === "underlined" ? 0 : getBorderRadius,
          }}
        >
          {/* Reflection effect */}
          {enableReflection && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "30%",
                borderTopLeftRadius: getBorderRadius,
                borderTopRightRadius: getBorderRadius,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                pointerEvents: "none",
              }}
            />
          )}

          <View style={inputContainerStyle}>
            {leftIcon && <View style={iconContainerStyle}>{leftIcon}</View>}

            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor ?? colors.text.placeholder}
              style={[textInputStyle, inputStyle]}
              editable={!disabled && !loading}
              multiline={multiline}
              numberOfLines={numberOfLines}
              maxLength={maxLength}
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessibilityLabel={accessibilityLabel || label}
              accessibilityHint={accessibilityHint}
              {...textInputProps}
            />

            {clearable && value && !disabled && !loading && (
              <Pressable style={iconContainerStyle} onPress={handleClear}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: colors.text.muted,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.text.primary,
                      fontSize: 10,
                      fontWeight: typography.weight.bold,
                    }}
                  >
                    ×
                  </Text>
                </View>
              </Pressable>
            )}

            {rightIcon && <View style={iconContainerStyle}>{rightIcon}</View>}
          </View>
        </BlurView>
      ) : (
        <View style={inputContainerStyle}>
          {leftIcon && <View style={iconContainerStyle}>{leftIcon}</View>}

          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor ?? colors.text.placeholder}
            style={[textInputStyle, inputStyle]}
            editable={!disabled && !loading}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={accessibilityHint}
            {...textInputProps}
          />

          {clearable && value && !disabled && !loading && (
            <Pressable style={iconContainerStyle} onPress={handleClear}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.text.muted,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 10,
                    fontWeight: typography.weight.bold,
                  }}
                >
                  ×
                </Text>
              </View>
            </Pressable>
          )}

          {rightIcon && <View style={iconContainerStyle}>{rightIcon}</View>}
        </View>
      )}
    </View>
  );

  return (
    <View style={containerStyle}>
      {/* Label */}
      {label && (
        <Text style={[labelTextStyle, labelStyle]}>
          {label}
          {required && (
            <Text style={{ color: colors.accent.error }}> *</Text>
          )}
        </Text>
      )}

      {/* Input */}
      {animated && enableFocusScale ? (
        <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
          {InputContent}
        </Animated.View>
      ) : (
        InputContent
      )}

      {/* Helper text and character count */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {(helperText || errorText) && (
          <Text
            style={[
              helperTextTextStyle,
              error ? errorTextStyle : helperTextStyle,
              { flex: 1 },
            ]}
          >
            {error ? errorText : helperText}
          </Text>
        )}

        {showCharacterCount && maxLength && (
          <Text style={characterCountStyle}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

// Input variant shortcuts
export const OutlinedGlassInput: React.FC<Omit<GlassInputProps, "variant">> = (
  props,
) => <GlassInput {...props} variant="outlined" />;

export const FilledGlassInput: React.FC<Omit<GlassInputProps, "variant">> = (
  props,
) => <GlassInput {...props} variant="filled" />;

export const UnderlinedGlassInput: React.FC<Omit<GlassInputProps, "variant">> = (
  props,
) => <GlassInput {...props} variant="underlined" />;

export const BorderlessGlassInput: React.FC<Omit<GlassInputProps, "variant">> = (
  props,
) => <GlassInput {...props} variant="borderless" />;

// Size variant shortcuts
export const SmallGlassInput: React.FC<Omit<GlassInputProps, "size">> = (
  props,
) => <GlassInput {...props} size="small" />;

export const MediumGlassInput: React.FC<Omit<GlassInputProps, "size">> = (
  props,
) => <GlassInput {...props} size="medium" />;

export const LargeGlassInput: React.FC<Omit<GlassInputProps, "size">> = (
  props,
) => <GlassInput {...props} size="large" />;

// Specialized inputs
export const SearchGlassInput: React.FC<GlassInputProps> = (props) => (
  <GlassInput
    {...props}
    variant="filled"
    material="light"
    borderRadius="full"
    clearable={true}
    enableGlow={true}
    enableReflection={true}
    placeholder="Search..."
  />
);

export const WeatherLocationInput: React.FC<GlassInputProps> = (props) => (
  <GlassInput
    {...props}
    variant="outlined"
    material="frosted"
    enableGlow={true}
    glowColor={colors.accent.primary}
    enableReflection={true}
    fullWidth={true}
  />
);

export const FloatingGlassInput: React.FC<GlassInputProps> = (props) => (
  <GlassInput
    {...props}
    variant="filled"
    material="crystal"
    shadowType="heavy"
    enableFocusScale={true}
    focusScale={1.02}
    enableReflection={true}
  />
);
