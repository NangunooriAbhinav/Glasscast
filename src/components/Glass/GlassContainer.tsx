import React, { useMemo } from "react";
import { View, ViewStyle, StyleProp } from "react-native";
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
import { AccessibilityRole } from "react-native";

export interface GlassContainerProps {
  children: React.ReactNode;

  // Material and appearance
  material?: GlassMaterial;
  customOpacity?: number;
  customBlur?: number;
  tint?: BlurTint;

  // Layout and spacing
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  borderRadius?: number | keyof typeof spacing.radius;

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

  // Interactive states
  pressable?: boolean;
  disabled?: boolean;

  // Animation
  animated?: boolean;
  animationDuration?: number;

  // Advanced features
  overflow?: "visible" | "hidden";
  enableGradientOverlay?: boolean;
  gradientColors?: string[];

  // Accessibility
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  material = "regular",
  customOpacity,
  customBlur,
  tint = "light",
  style,
  padding,
  margin,
  borderRadius = "xl",
  borderType,
  shadowType,
  customBorderColor,
  customBorderWidth,
  enableReflection = false,
  reflectionIntensity = "subtle",
  enableHighlight = false,
  highlightIntensity = "light",
  pressable = false,
  disabled = false,
  animated = true,
  animationDuration = 350,
  overflow = "hidden",
  enableGradientOverlay = false,
  gradientColors,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
}) => {
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

  // Get border configuration
  const borderConfig = glassEffects.borders[effectiveBorderType];

  // Get shadow configuration
  const shadowConfig = glassEffects.shadows[effectiveShadowType];

  // Create container style
  const containerStyle: ViewStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      borderRadius: getBorderRadius,
      overflow,
      backgroundColor: colors.base.transparent,

      // Apply spacing
      ...(padding && { padding: spacing[padding] as number }),
      ...(margin && { margin: spacing[margin] as number }),

      // Apply border
      borderWidth: customBorderWidth ?? borderConfig.borderWidth ?? 0,
      borderColor:
        customBorderColor ??
        ("borderColor" in borderConfig
          ? borderConfig.borderColor
          : colors.base.transparent),

      // Apply shadow
      ...shadowConfig,

      // Animation support
      ...(animated &&
        // @ts-ignore - Web-only property
        {
          transition: `all ${animationDuration}ms ${animations.easing.smooth}`,
        }),

      // Interactive states
      ...(pressable &&
        !disabled &&
          // @ts-ignore - Web-only property
          { cursor: "pointer" }),

      ...(disabled && {
        opacity: 0.5,
      }),
    };

    return baseStyle;
  }, [
    getBorderRadius,
    overflow,
    padding,
    margin,
    customBorderWidth,
    borderConfig,
    customBorderColor,
    shadowConfig,
    animated,
    animationDuration,
    pressable,
    disabled,
  ]);

  // Create blur view style
  const blurStyle: ViewStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: `rgba(255, 255, 255, ${effectiveOpacity})`,
      borderRadius: getBorderRadius,
    }),
    [effectiveOpacity, getBorderRadius],
  );

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
      // @ts-ignore - Web-only property
      background: lightEffects.reflections[reflectionIntensity],
      pointerEvents: "none",
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
      borderTopLeftRadius: getBorderRadius - 1,
      borderTopRightRadius: getBorderRadius - 1,
      backgroundColor: lightEffects.highlights[highlightIntensity],
      pointerEvents: "none",
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
      // @ts-ignore - Web-only property
      background: `linear-gradient(135deg, ${gradient.join(", ")})`,
      pointerEvents: "none",
    };
  }, [enableGradientOverlay, gradientColors, getBorderRadius]);

  return (
    <View
      style={[containerStyle, style]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessible={Boolean(accessibilityLabel || accessibilityHint)}
    >
      <BlurView intensity={effectiveBlur} tint={tint} style={blurStyle}>
        {/* Gradient overlay */}
        {enableGradientOverlay && <View style={gradientOverlayStyle} />}

        {/* Content */}
        <View style={{ flex: 1, zIndex: 1 }}>{children}</View>

        {/* Light effects overlays */}
        {enableReflection && <View style={reflectionStyle} />}

        {enableHighlight && <View style={highlightStyle} />}
      </BlurView>
    </View>
  );
};

// Material preset shortcuts
export const UltraLightGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="ultraLight" />;

export const LightGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="light" />;

export const RegularGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="regular" />;

export const MediumGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="medium" />;

export const HeavyGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="heavy" />;

export const FrostedGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="frosted" />;

export const CrystalGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="crystal" />;

export const MirrorGlassContainer: React.FC<
  Omit<GlassContainerProps, "material">
> = (props) => <GlassContainer {...props} material="mirror" />;
