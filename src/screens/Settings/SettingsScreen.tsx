import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  GlassContainer,
  InteractiveGlassCard,
  WeatherGlassBackground,
} from "../../components/Glass";
import { useTheme, useThemedStyles, spacing, typography } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import type { MainTabScreenProps } from "../../navigation/types";

type SettingsScreenProps = MainTabScreenProps<"Settings">;

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GlassContainer
        material="regular"
        borderRadius={spacing.radius.xl}
        style={styles.sectionContainer}
      >
        {children}
      </GlassContainer>
    </View>
  );
};

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  destructive?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  showChevron = false,
  isLast = false,
  destructive = false,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const handleSwitchChange = (newValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSwitchChange?.(newValue);
  };

  return (
    <TouchableOpacity
      style={[styles.settingsItem, isLast && styles.settingsItemLast]}
      onPress={handlePress}
      disabled={!onPress && !showSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemLeft}>
        <Text style={styles.settingsItemIcon}>{icon}</Text>
        <View style={styles.settingsItemContent}>
          <Text
            style={[
              styles.settingsItemTitle,
              destructive && { color: colors.accent.error },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>

      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsItemValue}>{value}</Text>}
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={handleSwitchChange}
            trackColor={{
              false: colors.glass.tertiary,
              true: colors.brand.primary,
            }}
            thumbColor={switchValue ? colors.white : colors.glass.primary}
            ios_backgroundColor={colors.glass.tertiary}
          />
        )}
        {showChevron && <Text style={styles.settingsItemChevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const {
    colors,
    isDark,
    toggleTheme,
    isSystemTheme,
    setSystemTheme,
    colorScheme,
  } = useTheme();
  const { user, signOut } = useAuth();
  const styles = useThemedStyles(createStyles);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Glasscast",
      "Version 1.0.0\n\nA beautiful weather app with glassmorphism design.\n\nBuilt with React Native & Expo.",
      [{ text: "OK" }],
      { cancelable: true },
    );
  };

  const handlePrivacy = () => {
    Linking.openURL("https://your-privacy-policy-url.com");
  };

  const handleSupport = () => {
    Linking.openURL("mailto:support@glasscast.com");
  };

  const handleRateApp = () => {
    // Replace with your app store URL
    Linking.openURL("https://apps.apple.com/app/your-app-id");
  };

  const getThemeDisplayName = () => {
    if (isSystemTheme) return "System";
    return colorScheme === "dark" ? "Dark" : "Light";
  };

  return (
    <WeatherGlassBackground
      weatherCondition="clear"
      timeOfDay={isDark ? "night" : "morning"}
      enableGlassOverlay={true}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          {user && (
            <SettingsSection title="Profile">
              <SettingsItem
                icon="👤"
                title={user.email || "User"}
                subtitle="Signed in"
                showChevron={false}
                isLast={true}
              />
            </SettingsSection>
          )}

          {/* Appearance Section */}
          <SettingsSection title="Appearance">
            <SettingsItem
              icon="🌓"
              title="Theme"
              subtitle="Choose your preferred theme"
              value={getThemeDisplayName()}
              onPress={() => {
                Alert.alert(
                  "Theme Settings",
                  "Choose your preferred theme",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "System",
                      onPress: () => setSystemTheme(true),
                    },
                    {
                      text: "Light",
                      onPress: () => {
                        setSystemTheme(false);
                        if (isDark) toggleTheme();
                      },
                    },
                    {
                      text: "Dark",
                      onPress: () => {
                        setSystemTheme(false);
                        if (!isDark) toggleTheme();
                      },
                    },
                  ],
                  { cancelable: true },
                );
              }}
              showChevron={true}
              isLast={true}
            />
          </SettingsSection>

          {/* Weather Section */}
          <SettingsSection title="Weather">
            <SettingsItem
              icon="📍"
              title="Location Services"
              subtitle="Allow location access for current weather"
              showSwitch={true}
              switchValue={locationEnabled}
              onSwitchChange={setLocationEnabled}
            />
            <SettingsItem
              icon="🔄"
              title="Auto Refresh"
              subtitle="Automatically update weather data"
              showSwitch={true}
              switchValue={autoRefresh}
              onSwitchChange={setAutoRefresh}
            />
            <SettingsItem
              icon="🌡️"
              title="Temperature Unit"
              subtitle="Choose temperature display unit"
              value="Celsius"
              onPress={() => {
                Alert.alert(
                  "Temperature Unit",
                  "Choose your preferred temperature unit",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Celsius (°C)" },
                    { text: "Fahrenheit (°F)" },
                  ],
                  { cancelable: true },
                );
              }}
              showChevron={true}
              isLast={true}
            />
          </SettingsSection>

          {/* Notifications Section */}
          <SettingsSection title="Notifications">
            <SettingsItem
              icon="🔔"
              title="Push Notifications"
              subtitle="Receive weather alerts and updates"
              showSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingsItem
              icon="⚠️"
              title="Weather Alerts"
              subtitle="Get notified about severe weather"
              showSwitch={true}
              switchValue={true}
              onSwitchChange={() => {}}
              isLast={true}
            />
          </SettingsSection>

          {/* About Section */}
          <SettingsSection title="About">
            <SettingsItem
              icon="⭐"
              title="Rate App"
              subtitle="Help us improve by rating the app"
              onPress={handleRateApp}
              showChevron={true}
            />
            <SettingsItem
              icon="💬"
              title="Contact Support"
              subtitle="Get help or send feedback"
              onPress={handleSupport}
              showChevron={true}
            />
            <SettingsItem
              icon="🔒"
              title="Privacy Policy"
              subtitle="Learn about our privacy practices"
              onPress={handlePrivacy}
              showChevron={true}
            />
            <SettingsItem
              icon="ℹ️"
              title="About Glasscast"
              subtitle="Version & app information"
              onPress={handleAbout}
              showChevron={true}
              isLast={true}
            />
          </SettingsSection>

          {/* Account Section */}
          {user && (
            <SettingsSection title="Account">
              <SettingsItem
                icon="🚪"
                title="Sign Out"
                subtitle="Sign out of your account"
                onPress={handleSignOut}
                destructive={true}
                isLast={true}
              />
            </SettingsSection>
          )}

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </WeatherGlassBackground>
  );
};

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: typography.size["2xl"],
      fontWeight: typography.weight.bold,
      color: colors.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing["4xl"],
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      paddingLeft: spacing.sm,
    },
    sectionContainer: {
      paddingVertical: spacing.xs,
    },
    settingsItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border.glass,
    },
    settingsItemLast: {
      borderBottomWidth: 0,
    },
    settingsItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingsItemIcon: {
      fontSize: 20,
      marginRight: spacing.md,
      width: 24,
      textAlign: "center",
    },
    settingsItemContent: {
      flex: 1,
    },
    settingsItemTitle: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.medium,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    settingsItemSubtitle: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
      lineHeight: 18,
    },
    settingsItemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    settingsItemValue: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
      marginRight: spacing.xs,
    },
    settingsItemChevron: {
      fontSize: 20,
      color: colors.text.muted,
      fontWeight: typography.weight.light,
    },
    bottomSpacing: {
      height: spacing["4xl"],
    },
  });
