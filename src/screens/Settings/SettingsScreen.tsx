import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  WeatherGlassBackground,
  InteractiveGlassCard,
  FloatingGlassCard,
  GlassContainer,
  GlassButton,
  WeatherActionButton,
} from "../../components/Glass";
import {
  colors,
  spacing,
  typography,
  glassEffects,
  animations,
} from "../../theme";
import { MainTabScreenProps } from "../../navigation/types";

type SettingsScreenProps = MainTabScreenProps<"Settings">;

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "toggle" | "button" | "info" | "navigation";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  icon?: string;
  destructive?: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    darkMode: false,
    celsius: false,
    autoRefresh: true,
    soundEffects: true,
    hapticFeedback: true,
    backgroundRefresh: true,
  });

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAbout = () => {
    Alert.alert(
      "About Glasscast",
      "Glasscast v1.0.0\n\nA beautiful weather app with glassmorphism design.\n\nBuilt with React Native & Expo",
      [{ text: "OK", style: "default" }],
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Privacy policy content would be shown here.",
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      "Terms of Service",
      "Terms of service content would be shown here.",
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "Are you sure you want to reset all settings? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setSettings({
              notifications: true,
              locationServices: true,
              darkMode: false,
              celsius: false,
              autoRefresh: true,
              soundEffects: true,
              hapticFeedback: true,
              backgroundRefresh: true,
            });
          },
        },
      ],
    );
  };

  const settingSections: SettingSection[] = [
    {
      id: "general",
      title: "General",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          subtitle: "Receive weather alerts and updates",
          type: "toggle",
          value: settings.notifications,
          onToggle: (value) => updateSetting("notifications", value),
          icon: "🔔",
        },
        {
          id: "locationServices",
          title: "Location Services",
          subtitle: "Allow access to current location",
          type: "toggle",
          value: settings.locationServices,
          onToggle: (value) => updateSetting("locationServices", value),
          icon: "📍",
        },
        {
          id: "autoRefresh",
          title: "Auto Refresh",
          subtitle: "Automatically update weather data",
          type: "toggle",
          value: settings.autoRefresh,
          onToggle: (value) => updateSetting("autoRefresh", value),
          icon: "🔄",
        },
      ],
    },
    {
      id: "display",
      title: "Display & Units",
      items: [
        {
          id: "darkMode",
          title: "Dark Mode",
          subtitle: "Use dark theme throughout the app",
          type: "toggle",
          value: settings.darkMode,
          onToggle: (value) => updateSetting("darkMode", value),
          icon: "🌙",
        },
        {
          id: "celsius",
          title: "Celsius",
          subtitle: "Show temperature in Celsius",
          type: "toggle",
          value: settings.celsius,
          onToggle: (value) => updateSetting("celsius", value),
          icon: "🌡️",
        },
      ],
    },
    {
      id: "experience",
      title: "Experience",
      items: [
        {
          id: "soundEffects",
          title: "Sound Effects",
          subtitle: "Play sounds for interactions",
          type: "toggle",
          value: settings.soundEffects,
          onToggle: (value) => updateSetting("soundEffects", value),
          icon: "🔊",
        },
        {
          id: "hapticFeedback",
          title: "Haptic Feedback",
          subtitle: "Feel vibrations for interactions",
          type: "toggle",
          value: settings.hapticFeedback,
          onToggle: (value) => updateSetting("hapticFeedback", value),
          icon: "📳",
        },
        {
          id: "backgroundRefresh",
          title: "Background Refresh",
          subtitle: "Update weather when app is closed",
          type: "toggle",
          value: settings.backgroundRefresh,
          onToggle: (value) => updateSetting("backgroundRefresh", value),
          icon: "⚡",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Information",
      items: [
        {
          id: "about",
          title: "About Glasscast",
          subtitle: "Version and app information",
          type: "button",
          onPress: handleAbout,
          icon: "ℹ️",
        },
        {
          id: "privacy",
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "button",
          onPress: handlePrivacyPolicy,
          icon: "🔒",
        },
        {
          id: "terms",
          title: "Terms of Service",
          subtitle: "Terms and conditions",
          type: "button",
          onPress: handleTermsOfService,
          icon: "📋",
        },
      ],
    },
    {
      id: "danger",
      title: "Danger Zone",
      items: [
        {
          id: "reset",
          title: "Reset App",
          subtitle: "Reset all settings to default",
          type: "button",
          onPress: handleResetApp,
          icon: "⚠️",
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <InteractiveGlassCard
        key={item.id}
        material={item.destructive ? "light" : "regular"}
        elevation="medium"
        enableHover={true}
        enablePress={true}
        pressable={item.type === "button"}
        onPress={item.onPress}
        scaleOnPress={0.98}
        borderRadius="xl"
        padding="lg"
        style={[styles.settingItem, item.destructive && styles.destructiveItem]}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            {item.icon && (
              <View style={styles.settingIconContainer}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
              </View>
            )}
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingTitle,
                  item.destructive && styles.destructiveText,
                ]}
              >
                {item.title}
              </Text>
              {item.subtitle && (
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
          <View style={styles.settingRight}>
            {item.type === "toggle" && (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{
                  false: colors.glass.secondary,
                  true: colors.accent.primaryAlpha,
                }}
                thumbColor={
                  item.value ? colors.accent.primary : colors.text.muted
                }
                ios_backgroundColor={colors.glass.secondary}
              />
            )}
            {item.type === "button" && <Text style={styles.chevron}>›</Text>}
          </View>
        </View>
      </InteractiveGlassCard>
    );
  };

  const renderSection = (section: SettingSection) => (
    <Animated.View
      key={section.id}
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <GlassContainer
        material="light"
        borderRadius="2xl"
        padding="sm"
        enableReflection={true}
        shadowType="medium"
      >
        {section.items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < section.items.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </GlassContainer>
    </Animated.View>
  );

  const renderUserProfile = () => (
    <Animated.View
      style={[
        styles.profileContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <FloatingGlassCard
        material="frosted"
        elevation="high"
        enableGlow={true}
        glowColor={colors.accent.primary}
        enableReflection={true}
        borderRadius="3xl"
        padding="xl"
        style={styles.profileCard}
      >
        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Weather Enthusiast</Text>
            <Text style={styles.profileEmail}>user@glasscast.app</Text>
          </View>
          <WeatherActionButton
            title="Edit"
            size="small"
            variant="secondary"
            onPress={() => {}}
          />
        </View>
      </FloatingGlassCard>
    </Animated.View>
  );

  return (
    <WeatherGlassBackground
      type="gradient"
      gradientColors={colors.gradient.accent}
      enableGlassOverlay={true}
      enableAmbientLight={true}
      enableVignette={true}
      vignetteIntensity={0.1}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GlassButton
            title=""
            icon={<Text style={styles.backIcon}>←</Text>}
            variant="ghost"
            size="medium"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderUserProfile()}

          {settingSections.map(renderSection)}

          {/* Bottom spacing */}
          <View style={{ height: spacing["6xl"] }} />
        </ScrollView>
      </SafeAreaView>
    </WeatherGlassBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "center",
    marginLeft: -44, // Compensate for back button width
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  profileCard: {
    minHeight: 100,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.glass.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  sectionContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  settingItem: {
    marginBottom: 0,
  },
  destructiveItem: {
    borderColor: colors.accent.errorLight,
    borderWidth: 1,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  destructiveText: {
    color: colors.accent.error,
  },
  settingSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  settingRight: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
  chevron: {
    fontSize: 20,
    color: colors.text.muted,
    fontWeight: typography.weight.light,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.sm,
    marginLeft: 56, // Align with text content
  },
});
