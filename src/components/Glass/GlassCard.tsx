import React, { useMemo, useState } from "react";
import {
  View,
  ViewStyle,
  StyleProp,
  Pressable,
  PressableProps,
  Animated,
} from "react-native";
import { BlurView, BlurTint } from "expo-blur";
import {
  colors,
  spacing,
  glassEffects,
  animations,
  lightEffects,
  type GlassMaterial,
  type ShadowType,
  type BorderType,
} from "../../theme";

export interface GlassCardProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;

  // Material and appearance
  material?: GlassMaterial;
  customOpacity?: number;
  customBlur?: number;
  tint?: BlurTint;

  // Layout and spacing
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  borderRadius?: number | keyof typeof spacing.radius;
  width?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;

  // Border and shadow
  borderType?: BorderType;
  shadowType?: ShadowType;
  customBorderColor?: string;
  customBorderWidth?: number;

  // Light effects
  enableReflection?: boolean;
  reflectionIntensity?: keyof typeof lightEffects.reflections;
  enableHighlight?: boolean;
  highlightIntensity?: keyof typeof lightEffects.highlights;
  enableGlow?: boolean;
  glowColor?: string;

  // Interactive states
  pressable?: boolean;
  disabled?: boolean;
  loading?: boolean;

  // Animation and micro-interactions
  animated?: boolean;
  animationDuration?: number;
  enableHover?: boolean;
  enablePress?: boolean;
  enableFocus?: boolean;
  scaleOnPress?: number;
  scaleOnHover?: number;

  // Advanced features
  overflow?: "visible" | "hidden";
  enableGradientOverlay?: boolean;
  gradientColors?: string[];
  enableRipple?: boolean;
  rippleColor?: string;

  // Elevation and depth
  elevation?: "flat" | "low" | "medium" | "high" | "floating";

  // Event handlers
  onPress?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // Accessibility
  accessibilityRole?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
  };

  // Test ID for testing
  testID?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  material = "medium",
  customOpacity,
  customBlur,
  tint = "light",
  style,
  contentStyle,
  padding = "lg",
  margin,
  borderRadius = "xl",
  width,
  height,
  minHeight,
  maxHeight,
  borderType,
  shadowType,
  customBorderColor,
  customBorderWidth,
  enableReflection = true,
  reflectionIntensity = "light",
  enableHighlight = true,
  highlightIntensity = "medium",
  enableGlow = false,
  glowColor,
  pressable = false,
  disabled = false,
  loading = false,
  animated = true,
  animationDuration = 200,
  enableHover = true,
  enablePress = true,
  enableFocus = true,
  scaleOnPress = 0.98,
  scaleOnHover = 1.02,
  overflow = "hidden",
  enableGradientOverlay = false,
  gradientColors,
  enableRipple = true,
  rippleColor,
  elevation = "medium",
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  testID,
  ...pressableProps
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [animatedScale] = useState(new Animated.Value(1));

  // Get material configuration
  const materialConfig = glassEffects.materials[material];

  // Calculate effective values
  const effectiveOpacity = customOpacity ?? materialConfig.opacity;
  const effectiveBlur = customBlur ?? materialConfig.blur;
  const effectiveBorderType = borderType ?? materialConfig.border;
  const effectiveShadowType = shadowType ?? materialConfig.shadow;

  // Get border radius value
  const getBorderRadius = useMemo(() => {
    if (typeof borderRadius === "number") {
      return borderRadius;
    }
    return spacing.radius[borderRadius];
  }, [borderRadius]);

  // Get elevation shadow
  const getElevationShadow = useMemo(() => {
    switch (elevation) {
      case "flat":
        return glassEffects.shadows.subtle;
      case "low":
        return glassEffects.shadows.light;
      case "medium":
        return glassEffects.shadows.medium;
      case "high":
        return glassEffects.shadows.heavy;
      case "floating":
        return glassEffects.shadows.dramatic;
      default:
        return glassEffects.shadows.medium;
    }
  }, [elevation]);

  // Get border configuration
  const borderConfig = glassEffects.borders[effectiveBorderType];

  // Get effective shadow (elevation overrides material shadow)
  const shadowConfig = shadowType
    ? glassEffects.shadows[effectiveShadowType]
    : getElevationShadow;

  // Handle press animations
  const handlePressIn = () => {
    if (!pressable || disabled || loading) return;

    setIsPressed(true);
    if (enablePress) {
      Animated.timing(animatedScale, {
        toValue: scaleOnPress,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.();
  };

  const handlePressOut = () => {
    if (!pressable || disabled || loading) return;

    setIsPressed(false);
    if (enablePress) {
      Animated.timing(animatedScale, {
        toValue: isHovered && enableHover ? scaleOnHover : 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.();
  };

  const handleHoverIn = () => {
    if (!pressable || disabled || loading) return;

    setIsHovered(true);
    if (enableHover && !isPressed) {
      Animated.timing(animatedScale, {
        toValue: scaleOnHover,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    onHoverIn?.();
  };

  const handleHoverOut = () => {
    if (!pressable || disabled || loading) return;

    setIsHovered(false);
    if (enableHover && !isPressed) {
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    onHoverOut?.();
  };

  const handleFocus = () => {
    if (!pressable || disabled || loading) return;

    setIsFocused(true);
    if (enableFocus && !isPressed && !isHovered) {
      Animated.timing(animatedScale, {
        toValue: 1.01,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (enableFocus && !isPressed && !isHovered) {
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
    onBlur?.();
  };

  // Create container style
  const containerStyle: ViewStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      borderRadius: getBorderRadius,
      overflow,
      backgroundColor: colors.base.transparent,
      width,
      height,
      minHeight,
      maxHeight,

      // Apply spacing
      ...(margin && { margin: spacing[margin] }),

      // Apply border
      borderWidth: customBorderWidth ?? borderConfig.borderWidth ?? 0,
      borderColor:
        customBorderColor ??
        borderConfig.borderColor ??
        colors.base.transparent,

      // Apply shadow
      ...shadowConfig,

      // Enhanced shadow for interactive states
      ...(isPressed && {
        ...glassEffects.shadows.light,
      }),
      ...(isHovered &&
        !isPressed && {
          shadowOpacity: (shadowConfig.shadowOpacity || 0) * 1.2,
        }),
      ...(isFocused &&
        !isPressed &&
        !isHovered && {
          borderColor: customBorderColor ?? colors.accent.primaryLight,
          borderWidth:
            (customBorderWidth ?? borderConfig.borderWidth ?? 0) + 0.5,
        }),

      // Glow effect
      ...(enableGlow && {
        shadowColor: glowColor ?? colors.accent.primary,
        shadowOpacity: 0.3,
        shadowRadius: 20,
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
    getBorderRadius,
    overflow,
    width,
    height,
    minHeight,
    maxHeight,
    margin,
    customBorderWidth,
    borderConfig,
    customBorderColor,
    shadowConfig,
    isPressed,
    isHovered,
    isFocused,
    enableGlow,
    glowColor,
    disabled,
    loading,
  ]);

  // Create blur view style
  const blurStyle: ViewStyle = useMemo(() => {
    const baseOpacity = effectiveOpacity;
    const interactiveOpacity = isPressed
      ? baseOpacity * 1.2
      : isHovered
        ? baseOpacity * 1.1
        : baseOpacity;

    return {
      flex: 1,
      backgroundColor: `rgba(255, 255, 255, ${interactiveOpacity})`,
      borderRadius: getBorderRadius,
      ...(padding && { padding: spacing[padding] }),
    };
  }, [effectiveOpacity, getBorderRadius, padding, isPressed, isHovered]);

  // Create reflection overlay style
  const reflectionStyle: ViewStyle = useMemo(() => {
    if (!enableReflection) return {};

    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "50%",
      borderTopLeftRadius: getBorderRadius,
      borderTopRightRadius: getBorderRadius,
      background: lightEffects.reflections[reflectionIntensity],
      pointerEvents: "none",
      zIndex: 2,
    };
  }, [enableReflection, reflectionIntensity, getBorderRadius]);

  // Create highlight overlay style
  const highlightStyle: ViewStyle = useMemo(() => {
    if (!enableHighlight) return {};

    return {
      position: "absolute",
      top: 1,
      left: 1,
      right: 1,
      height: 2,
      borderTopLeftRadius: Math.max(0, getBorderRadius - 1),
      borderTopRightRadius: Math.max(0, getBorderRadius - 1),
      backgroundColor: lightEffects.highlights[highlightIntensity],
      pointerEvents: "none",
      zIndex: 2,
    };
  }, [enableHighlight, highlightIntensity, getBorderRadius]);

  // Create gradient overlay style
  const gradientOverlayStyle: ViewStyle = useMemo(() => {
    if (!enableGradientOverlay) return {};

    const defaultGradient = colors.gradient.primary;
    const gradient = gradientColors || defaultGradient;

    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: getBorderRadius,
      background: `linear-gradient(135deg, ${gradient.join(", ")})`,
      pointerEvents: "none",
      zIndex: 1,
    };
  }, [enableGradientOverlay, gradientColors, getBorderRadius]);

  // Create ripple style (for web)
  const rippleStyle: ViewStyle = useMemo(() => {
    if (!enableRipple || !pressable) return {};

    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: getBorderRadius,
      backgroundColor: rippleColor ?? colors.glass.hover,
      opacity: isPressed ? 0.3 : 0,
      pointerEvents: "none",
      zIndex: 1,
      transition: `opacity ${animationDuration}ms ease-out`,
    };
  }, [
    enableRipple,
    pressable,
    getBorderRadius,
    rippleColor,
    isPressed,
    animationDuration,
  ]);

  // Create animated wrapper style
  const animatedWrapperStyle = {
    transform: [{ scale: animatedScale }],
  };

  const CardContent = (
    <View style={[containerStyle, style]} testID={testID}>
      <BlurView intensity={effectiveBlur} tint={tint} style={blurStyle}>
        {/* Gradient overlay */}
        {enableGradientOverlay && <View style={gradientOverlayStyle} />}

        {/* Ripple effect */}
        {enableRipple && <View style={rippleStyle} />}

        {/* Content */}
        <View style={[{ flex: 1, zIndex: 3 }, contentStyle]}>{children}</View>

        {/* Light effects overlays */}
        {enableReflection && <View style={reflectionStyle} />}
        {enableHighlight && <View style={highlightStyle} />}
      </BlurView>
    </View>
  );

  if (pressable && !disabled && !loading) {
    return (
      <Animated.View style={animated ? animatedWrapperStyle : undefined}>
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityRole={accessibilityRole || "button"}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: disabled || loading,
            ...accessibilityState,
          }}
          {...pressableProps}
        >
          {CardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return animated ? (
    <Animated.View style={animatedWrapperStyle}>{CardContent}</Animated.View>
  ) : (
    CardContent
  );
};

// Material preset shortcuts
export const UltraLightGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="ultraLight" />;

export const LightGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="light" />;

export const RegularGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="regular" />;

export const MediumGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="medium" />;

export const HeavyGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="heavy" />;

export const FrostedGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="frosted" />;

export const CrystalGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="crystal" />;

export const MirrorGlassCard: React.FC<Omit<GlassCardProps, "material">> = (
  props,
) => <GlassCard {...props} material="mirror" />;

// Specialized glass cards
export const WeatherGlassCard: React.FC<GlassCardProps> = (props) => (
  <GlassCard
    {...props}
    material="frosted"
    enableReflection={true}
    enableHighlight={true}
    enableGradientOverlay={true}
    elevation="medium"
  />
);

export const InteractiveGlassCard: React.FC<GlassCardProps> = (props) => (
  <GlassCard
    {...props}
    material="medium"
    pressable={true}
    enableHover={true}
    enablePress={true}
    enableRipple={true}
    enableGlow={true}
    elevation="low"
  />
);

export const FloatingGlassCard: React.FC<GlassCardProps> = (props) => (
  <GlassCard
    {...props}
    material="crystal"
    elevation="floating"
    enableReflection={true}
    enableHighlight={true}
    borderRadius="2xl"
  />
);
