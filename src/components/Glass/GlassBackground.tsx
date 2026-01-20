import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  ViewStyle,
  StyleProp,
  Dimensions,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import { BlurView, BlurTint } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  glassEffects,
  lightEffects,
  animations,
} from "../../theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface GlassBackgroundProps {
  children: React.ReactNode;

  // Background type
  type?: "gradient" | "image" | "color" | "dynamic";

  // Gradient configuration
  gradientColors?: string[];
  gradientDirection?: "horizontal" | "vertical" | "diagonal" | "radial";
  gradientStops?: number[];

  // Image configuration
  backgroundImage?: ImageSourcePropType;
  imageOpacity?: number;
  imageBlur?: number;
  imageOverlay?: string;

  // Color configuration
  backgroundColor?: string;

  // Weather-based dynamic backgrounds
  weatherCondition?:
    | "sunny"
    | "cloudy"
    | "rainy"
    | "snowy"
    | "stormy"
    | "clear"
    | "overcast";
  timeOfDay?: "dawn" | "morning" | "afternoon" | "evening" | "night";

  // Glass overlay effects
  enableGlassOverlay?: boolean;
  glassOverlayOpacity?: number;
  glassOverlayBlur?: number;
  glassOverlayTint?: BlurTint;

  // Animated effects
  enableParallax?: boolean;
  parallaxIntensity?: number;
  enablePulse?: boolean;
  pulseIntensity?: number;
  enableShimmer?: boolean;
  shimmerColor?: string;

  // Light effects
  enableAmbientLight?: boolean;
  ambientLightIntensity?: keyof typeof lightEffects.ambient;
  enableDirectionalLight?: boolean;
  lightDirection?: keyof typeof lightEffects.directional;

  // Layout and styling
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  safeAreaInsets?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  // Advanced features
  enableNoise?: boolean;
  noiseOpacity?: number;
  enableVignette?: boolean;
  vignetteIntensity?: number;

  // Performance
  reducedMotion?: boolean;
  cacheBackground?: boolean;

  // Accessibility
  accessibilityRole?: string;
  accessibilityLabel?: string;
}

export const GlassBackground: React.FC<GlassBackgroundProps> = ({
  children,
  type = "gradient",
  gradientColors,
  gradientDirection = "diagonal",
  gradientStops,
  backgroundImage,
  imageOpacity = 0.7,
  imageBlur = 0,
  imageOverlay,
  backgroundColor,
  weatherCondition,
  timeOfDay,
  enableGlassOverlay = true,
  glassOverlayOpacity = 0.1,
  glassOverlayBlur = 20,
  glassOverlayTint = "light",
  enableParallax = false,
  parallaxIntensity = 10,
  enablePulse = false,
  pulseIntensity = 0.1,
  enableShimmer = false,
  shimmerColor = colors.glass.accent,
  enableAmbientLight = true,
  ambientLightIntensity = "soft",
  enableDirectionalLight = false,
  lightDirection = "topLeft",
  style,
  contentStyle,
  safeAreaInsets = {},
  enableNoise = false,
  noiseOpacity = 0.05,
  enableVignette = true,
  vignetteIntensity = 0.3,
  reducedMotion = false,
  cacheBackground = true,
  accessibilityRole,
  accessibilityLabel,
}) => {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [pulseValue, setPulseValue] = useState(1);

  // Get weather-based gradient
  const getWeatherGradient = useMemo(() => {
    if (!weatherCondition) return colors.gradients.primary;

    const weatherGradients = {
      sunny: colors.gradients.sunset,
      cloudy: colors.gradients.ocean,
      rainy: colors.gradients.ocean,
      snowy: colors.gradients.ice,
      stormy: colors.gradients.cosmic,
      clear: colors.gradients.aurora,
      overcast: colors.gradients.forest,
    };

    const timeGradients = {
      dawn: [
        "rgba(255, 94, 77, 0.3)",
        "rgba(255, 154, 0, 0.2)",
        "rgba(135, 206, 235, 0.1)",
      ],
      morning: [
        "rgba(135, 206, 235, 0.4)",
        "rgba(173, 216, 230, 0.3)",
        "rgba(240, 248, 255, 0.2)",
      ],
      afternoon: [
        "rgba(135, 206, 235, 0.5)",
        "rgba(100, 149, 237, 0.3)",
        "rgba(70, 130, 180, 0.2)",
      ],
      evening: [
        "rgba(255, 94, 77, 0.4)",
        "rgba(255, 140, 0, 0.3)",
        "rgba(255, 165, 0, 0.2)",
      ],
      night: [
        "rgba(25, 25, 112, 0.6)",
        "rgba(72, 61, 139, 0.4)",
        "rgba(106, 90, 205, 0.3)",
      ],
    };

    if (timeOfDay && timeGradients[timeOfDay]) {
      return timeGradients[timeOfDay];
    }

    return weatherGradients[weatherCondition] || colors.gradients.primary;
  }, [weatherCondition, timeOfDay]);

  // Get gradient direction points
  const getGradientPoints = useMemo(() => {
    switch (gradientDirection) {
      case "horizontal":
        return { start: [0, 0.5], end: [1, 0.5] };
      case "vertical":
        return { start: [0.5, 0], end: [0.5, 1] };
      case "diagonal":
        return { start: [0, 0], end: [1, 1] };
      case "radial":
        return { start: [0.5, 0.5], end: [1, 1] };
      default:
        return { start: [0, 0], end: [1, 1] };
    }
  }, [gradientDirection]);

  // Create effective gradient colors
  const effectiveGradientColors = useMemo(() => {
    return gradientColors || getWeatherGradient;
  }, [gradientColors, getWeatherGradient]);

  // Parallax effect
  useEffect(() => {
    if (!enableParallax || reducedMotion) return;

    const interval = setInterval(() => {
      setParallaxOffset((prev) =>
        prev >= parallaxIntensity ? -parallaxIntensity : prev + 0.5,
      );
    }, 100);

    return () => clearInterval(interval);
  }, [enableParallax, parallaxIntensity, reducedMotion]);

  // Pulse effect
  useEffect(() => {
    if (!enablePulse || reducedMotion) return;

    const interval = setInterval(() => {
      setPulseValue((prev) =>
        prev >= 1 + pulseIntensity ? 1 - pulseIntensity : prev + 0.01,
      );
    }, 50);

    return () => clearInterval(interval);
  }, [enablePulse, pulseIntensity, reducedMotion]);

  // Create background style
  const backgroundStyle: ViewStyle = useMemo(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: screenWidth,
      height: screenHeight,
      ...(enableParallax && {
        transform: [{ translateY: parallaxOffset }],
      }),
      ...(enablePulse && {
        opacity: pulseValue,
      }),
    };
  }, [enableParallax, parallaxOffset, enablePulse, pulseValue]);

  // Create container style
  const containerStyle: ViewStyle = useMemo(() => {
    const { top = 0, bottom = 0, left = 0, right = 0 } = safeAreaInsets;

    return {
      flex: 1,
      width: "100%",
      height: "100%",
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      position: "relative",
      overflow: "hidden",
    };
  }, [safeAreaInsets]);

  // Create ambient light style
  const ambientLightStyle: ViewStyle = useMemo(() => {
    if (!enableAmbientLight) return {};

    const lightConfig = lightEffects.ambient[ambientLightIntensity];

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: lightConfig.color,
      opacity: lightConfig.intensity,
    };
  }, [enableAmbientLight, ambientLightIntensity]);

  // Create directional light style
  const directionalLightStyle: ViewStyle = useMemo(() => {
    if (!enableDirectionalLight) return {};

    const lightConfig = lightEffects.directional[lightDirection];

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "50%",
      background: `linear-gradient(${lightConfig.angle}deg, rgba(255, 255, 255, ${lightConfig.intensity}) 0%, transparent ${lightConfig.spread}%)`,
    };
  }, [enableDirectionalLight, lightDirection]);

  // Create noise overlay style
  const noiseStyle: ViewStyle = useMemo(() => {
    if (!enableNoise) return {};

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: noiseOpacity,
      background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    };
  }, [enableNoise, noiseOpacity]);

  // Create vignette style
  const vignetteStyle: ViewStyle = useMemo(() => {
    if (!enableVignette) return {};

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `radial-gradient(circle, transparent 30%, rgba(0, 0, 0, ${vignetteIntensity}) 100%)`,
    };
  }, [enableVignette, vignetteIntensity]);

  // Create shimmer style
  const shimmerStyle: ViewStyle = useMemo(() => {
    if (!enableShimmer) return {};

    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `linear-gradient(45deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)`,
      animation: `shimmer ${animations.loading.shimmer.duration}ms ${animations.loading.shimmer.easing} ${animations.loading.shimmer.iterations}`,
    };
  }, [enableShimmer, shimmerColor]);

  // Render background based on type
  const renderBackground = () => {
    switch (type) {
      case "gradient":
        return (
          <LinearGradient
            colors={effectiveGradientColors as any}
            start={getGradientPoints.start as any}
            end={getGradientPoints.end as any}
            locations={gradientStops as any}
            style={backgroundStyle}
          />
        );

      case "image":
        return backgroundImage ? (
          <ImageBackground
            source={backgroundImage}
            style={backgroundStyle}
            blurRadius={imageBlur}
            resizeMode="cover"
          >
            {imageOverlay && (
              <View
                style={[
                  backgroundStyle,
                  {
                    backgroundColor: imageOverlay,
                    opacity: imageOpacity,
                  },
                ]}
              />
            )}
          </ImageBackground>
        ) : (
          <View
            style={[
              backgroundStyle,
              { backgroundColor: colors.gradients.primary[0] },
            ]}
          />
        );

      case "color":
        return (
          <View
            style={[
              backgroundStyle,
              { backgroundColor: backgroundColor || colors.background.primary },
            ]}
          />
        );

      case "dynamic":
        return (
          <LinearGradient
            colors={effectiveGradientColors as any}
            start={getGradientPoints.start as any}
            end={getGradientPoints.end as any}
            locations={gradientStops as any}
            style={backgroundStyle}
          />
        );

      default:
        return (
          <LinearGradient
            colors={effectiveGradientColors as any}
            start={getGradientPoints.start as any}
            end={getGradientPoints.end as any}
            locations={gradientStops as any}
            style={backgroundStyle}
          />
        );
    }
  };

  return (
    <View
      style={[containerStyle, style]}
      accessibilityRole={accessibilityRole as any}
      accessibilityLabel={accessibilityLabel}
    >
      {/* Background layer */}
      {renderBackground()}

      {/* Noise overlay */}
      {enableNoise && <View style={noiseStyle} />}

      {/* Ambient light */}
      {enableAmbientLight && <View style={ambientLightStyle} />}

      {/* Directional light */}
      {enableDirectionalLight && <View style={directionalLightStyle} />}

      {/* Shimmer effect */}
      {enableShimmer && <View style={shimmerStyle} />}

      {/* Glass overlay */}
      {enableGlassOverlay && (
        <BlurView
          intensity={glassOverlayBlur}
          tint={glassOverlayTint}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: `rgba(255, 255, 255, ${glassOverlayOpacity})`,
          }}
        />
      )}

      {/* Vignette overlay */}
      {enableVignette && <View style={vignetteStyle} />}

      {/* Content */}
      <View style={[{ flex: 1, zIndex: 10 }, contentStyle]}>{children}</View>
    </View>
  );
};

// Preset background shortcuts
export const WeatherGlassBackground: React.FC<GlassBackgroundProps> = (
  props,
) => (
  <GlassBackground
    {...props}
    type="dynamic"
    enableGlassOverlay={true}
    enableAmbientLight={true}
    enableVignette={true}
    vignetteIntensity={0.2}
  />
);

export const ImageGlassBackground: React.FC<GlassBackgroundProps> = (props) => (
  <GlassBackground
    {...props}
    type="image"
    enableGlassOverlay={true}
    glassOverlayOpacity={0.15}
    enableVignette={true}
  />
);

export const MinimalGlassBackground: React.FC<GlassBackgroundProps> = (
  props,
) => (
  <GlassBackground
    {...props}
    type="gradient"
    enableGlassOverlay={false}
    enableAmbientLight={false}
    enableVignette={false}
  />
);

export const DynamicGlassBackground: React.FC<GlassBackgroundProps> = (
  props,
) => (
  <GlassBackground
    {...props}
    type="dynamic"
    enableParallax={true}
    enablePulse={true}
    enableShimmer={true}
    enableAmbientLight={true}
    enableDirectionalLight={true}
  />
);

export const StaticGlassBackground: React.FC<GlassBackgroundProps> = (
  props,
) => (
  <GlassBackground
    {...props}
    type="gradient"
    enableParallax={false}
    enablePulse={false}
    enableShimmer={false}
    reducedMotion={true}
  />
);
