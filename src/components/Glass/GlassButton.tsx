import React, { useMemo, useState } from "react";
import {
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
  Animated,
  ActivityIndicator,
  View,
} from "react-native";
import { GlassCard, GlassCardProps } from "./GlassCard";
import {
  colors,
  typography,
  spacing,
  animations,
  type GlassMaterial,
} from "../../theme";

export interface GlassButtonProps extends Omit<GlassCardProps, "children"> {
  // Content
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";

  // Button variants
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost";
  size?: "small" | "medium" | "large" | "xlarge";

  // Loading state
  loading?: boolean;
  loadingText?: string;

  // Typography
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  fontWeight?: keyof typeof typography.weight;
  fontSize?: keyof typeof typography.size;

  // Colors
  titleColor?: string;
  subtitleColor?: string;
  backgroundColor?: string;
  borderColor?: string;

  // Layout
  fullWidth?: boolean;
  contentDirection?: "row" | "column";

  // Advanced features
  gradient?: boolean;
  gradientColors?: string[];
  pulseOnPress?: boolean;
  glowIntensity?: "low" | "medium" | "high";

  // Accessibility
  accessibilityRole?: "button" | "link" | "tab";
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  subtitle,
  icon,
  iconPosition = "left",
  variant = "primary",
  size = "medium",
  loading = false,
  loadingText = "Loading...",
  titleStyle,
  subtitleStyle,
  fontWeight,
  fontSize,
  titleColor,
  subtitleColor,
  backgroundColor,
  borderColor,
  fullWidth = false,
  contentDirection = "row",
  gradient = false,
  gradientColors,
  pulseOnPress = false,
  glowIntensity = "medium",
  disabled,
  accessibilityRole = "button",
  ...glassCardProps
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  // Get variant configuration
  const getVariantConfig = useMemo(() => {
    switch (variant) {
      case "primary":
        return {
          material: "medium" as GlassMaterial,
          backgroundColor: backgroundColor || colors.accent.primaryAlpha,
          borderColor: borderColor || colors.accent.primaryLight,
          titleColor: titleColor || colors.text.primary,
          subtitleColor: subtitleColor || colors.text.secondary,
          enableGlow: true,
          glowColor: colors.accent.primary,
          elevation: "medium" as const,
        };
      case "secondary":
        return {
          material: "regular" as GlassMaterial,
          backgroundColor: backgroundColor || colors.glass.secondary,
          borderColor: borderColor || colors.border.medium,
          titleColor: titleColor || colors.text.primary,
          subtitleColor: subtitleColor || colors.text.secondary,
          enableGlow: false,
          elevation: "low" as const,
        };
      case "tertiary":
        return {
          material: "light" as GlassMaterial,
          backgroundColor: backgroundColor || colors.glass.tertiary,
          borderColor: borderColor || colors.border.light,
          titleColor: titleColor || colors.text.secondary,
          subtitleColor: subtitleColor || colors.text.tertiary,
          enableGlow: false,
          elevation: "low" as const,
        };
      case "outline":
        return {
          material: "ultraLight" as GlassMaterial,
          backgroundColor: backgroundColor || colors.base.transparent,
          borderColor: borderColor || colors.accent.primaryLight,
          titleColor: titleColor || colors.accent.primary,
          subtitleColor: subtitleColor || colors.text.secondary,
          enableGlow: false,
          elevation: "flat" as const,
          customBorderWidth: 1.5,
        };
      case "ghost":
        return {
          material: "ultraLight" as GlassMaterial,
          backgroundColor: backgroundColor || colors.base.transparent,
          borderColor: "transparent",
          titleColor: titleColor || colors.text.secondary,
          subtitleColor: subtitleColor || colors.text.tertiary,
          enableGlow: false,
          elevation: "flat" as const,
        };
      default:
        return {
          material: "medium" as GlassMaterial,
          backgroundColor: backgroundColor || colors.accent.primaryAlpha,
          borderColor: borderColor || colors.accent.primaryLight,
          titleColor: titleColor || colors.text.primary,
          subtitleColor: subtitleColor || colors.text.secondary,
          enableGlow: true,
          glowColor: colors.accent.primary,
          elevation: "medium" as const,
        };
    }
  }, [
    variant,
    backgroundColor,
    borderColor,
    titleColor,
    subtitleColor,
  ]);

  // Get size configuration
  const getSizeConfig = useMemo(() => {
    switch (size) {
      case "small":
        return {
          padding: "sm" as keyof typeof spacing,
          minHeight: 36,
          titleSize: "sm" as keyof typeof typography.size,
          subtitleSize: "xs" as keyof typeof typography.size,
          iconSize: 16,
          borderRadius: "md" as keyof typeof spacing.radius,
        };
      case "medium":
        return {
          padding: "md" as keyof typeof spacing,
          minHeight: 44,
          titleSize: "base" as keyof typeof typography.size,
          subtitleSize: "sm" as keyof typeof typography.size,
          iconSize: 20,
          borderRadius: "lg" as keyof typeof spacing.radius,
        };
      case "large":
        return {
          padding: "lg" as keyof typeof spacing,
          minHeight: 52,
          titleSize: "lg" as keyof typeof typography.size,
          subtitleSize: "base" as keyof typeof typography.size,
          iconSize: 24,
          borderRadius: "xl" as keyof typeof spacing.radius,
        };
      case "xlarge":
        return {
          padding: "xl" as keyof typeof spacing,
          minHeight: 60,
          titleSize: "xl" as keyof typeof typography.size,
          subtitleSize: "lg" as keyof typeof typography.size,
          iconSize: 28,
          borderRadius: "2xl" as keyof typeof spacing.radius,
        };
      default:
        return {
          padding: "md" as keyof typeof spacing,
          minHeight: 44,
          titleSize: "base" as keyof typeof typography.size,
          subtitleSize: "sm" as keyof typeof typography.size,
          iconSize: 20,
          borderRadius: "lg" as keyof typeof spacing.radius,
        };
    }
  }, [size]);

  // Handle pulse animation
  const handlePulse = () => {
    if (!pulseOnPress) return;

    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Create glow configuration
  const getGlowConfig = useMemo(() => {
    if (!getVariantConfig.enableGlow) return {};

    const intensity = {
      low: 0.2,
      medium: 0.4,
      high: 0.6,
    }[glowIntensity];

    return {
      enableGlow: true,
      glowColor: getVariantConfig.glowColor,
      shadowOpacity: intensity,
    };
  }, [getVariantConfig.enableGlow, getVariantConfig.glowColor, glowIntensity]);

  // Create button styles
  const buttonStyle: ViewStyle = {
    minHeight: getSizeConfig.minHeight,
    width: fullWidth ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
  };

  const contentStyle: ViewStyle = {
    flexDirection: contentDirection,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  };

  const titleTextStyle: TextStyle = {
    fontSize: typography.size[fontSize || getSizeConfig.titleSize],
    fontWeight: typography.weight[fontWeight || "medium"],
    color: getVariantConfig.titleColor,
    textAlign: "center",
  };

  const subtitleTextStyle: TextStyle = {
    fontSize: typography.size[getSizeConfig.subtitleSize],
    fontWeight: typography.weight.normal,
    color: getVariantConfig.subtitleColor,
    textAlign: "center",
  };

  // Create gradient configuration
  const gradientConfig = useMemo(() => {
    if (!gradient) return {};

    const defaultGradients = {
      primary: colors.gradient.primary,
      secondary: colors.gradient.secondary,
      accent: colors.gradient.accent,
    };

    return {
      enableGradientOverlay: true,
      gradientColors: gradientColors || defaultGradients.primary,
    };
  }, [gradient, gradientColors]);

  // Handle press with pulse effect
  const handlePress = () => {
    if (loading || disabled) return;

    handlePulse();
    glassCardProps.onPress?.();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={contentStyle}>
          <ActivityIndicator
            size={getSizeConfig.iconSize}
            color={getVariantConfig.titleColor}
          />
          {loadingText && (
            <Text style={[titleTextStyle, titleStyle]}>{loadingText}</Text>
          )}
        </View>
      );
    }

    return (
      <View style={contentStyle}>
        {icon && iconPosition === "left" && icon}

        <View style={{ alignItems: "center" }}>
          <Text style={[titleTextStyle, titleStyle]}>{title}</Text>
          {subtitle && (
            <Text style={[subtitleTextStyle, subtitleStyle]}>{subtitle}</Text>
          )}
        </View>

        {icon && iconPosition === "right" && icon}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: pulseAnim }] },
        fullWidth && { width: "100%" },
      ]}
    >
      <GlassCard
        material={getVariantConfig.material}
        borderRadius={getSizeConfig.borderRadius}
        padding={getSizeConfig.padding}
        elevation={getVariantConfig.elevation}
        customBorderColor={getVariantConfig.borderColor}
        customBorderWidth={getVariantConfig.customBorderWidth}
        pressable={!loading && !disabled}
        disabled={disabled || loading}
        enableHover={true}
        enablePress={true}
        enableRipple={true}
        scaleOnPress={0.98}
        scaleOnHover={1.02}
        accessibilityRole={accessibilityRole}
        contentStyle={buttonStyle}
        {...getGlowConfig}
        {...gradientConfig}
        {...glassCardProps}
        onPress={handlePress}
        style={[
          {
            backgroundColor: getVariantConfig.backgroundColor,
          },
          glassCardProps.style,
        ]}
      >
        {renderContent()}
      </GlassCard>
    </Animated.View>
  );
};

// Button variant shortcuts
export const PrimaryGlassButton: React.FC<
  Omit<GlassButtonProps, "variant">
> = (props) => <GlassButton {...props} variant="primary" />;

export const SecondaryGlassButton: React.FC<
  Omit<GlassButtonProps, "variant">
> = (props) => <GlassButton {...props} variant="secondary" />;

export const TertiaryGlassButton: React.FC<
  Omit<GlassButtonProps, "variant">
> = (props) => <GlassButton {...props} variant="tertiary" />;

export const OutlineGlassButton: React.FC<
  Omit<GlassButtonProps, "variant">
> = (props) => <GlassButton {...props} variant="outline" />;

export const GhostGlassButton: React.FC<
  Omit<GlassButtonProps, "variant">
> = (props) => <GlassButton {...props} variant="ghost" />;

// Size variant shortcuts
export const SmallGlassButton: React.FC<
  Omit<GlassButtonProps, "size">
> = (props) => <GlassButton {...props} size="small" />;

export const MediumGlassButton: React.FC<
  Omit<GlassButtonProps, "size">
> = (props) => <GlassButton {...props} size="medium" />;

export const LargeGlassButton: React.FC<
  Omit<GlassButtonProps, "size">
> = (props) => <GlassButton {...props} size="large" />;

export const XLargeGlassButton: React.FC<
  Omit<GlassButtonProps, "size">
> = (props) => <GlassButton {...props} size="xlarge" />;

// Specialized buttons
export const WeatherActionButton: React.FC<GlassButtonProps> = (props) => (
  <GlassButton
    {...props}
    variant="primary"
    size="large"
    gradient={true}
    pulseOnPress={true}
    glowIntensity="medium"
    borderRadius="2xl"
  />
);

export const FloatingActionButton: React.FC<GlassButtonProps> = (props) => (
  <GlassButton
    {...props}
    variant="primary"
    size="large"
    material="crystal"
    elevation="floating"
    borderRadius="full"
    enableGlow={true}
    glowIntensity="high"
    contentDirection="column"
  />
);

export const NavTabButton: React.FC<GlassButtonProps> = (props) => (
  <GlassButton
    {...props}
    variant="ghost"
    size="small"
    material="light"
    borderRadius="lg"
    enableHover={false}
    scaleOnPress={0.95}
  />
);
