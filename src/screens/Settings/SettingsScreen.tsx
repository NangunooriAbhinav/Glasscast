import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { GlassContainer } from '../../components/Glass/GlassContainer';
import { InteractiveGlassCard } from '../../components/Glass/GlassContainer';
import { GlassSwitchWithLabel } from '../../components/Glass/GlassSwitch';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { MainTabScreenProps } from '../../navigation/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type SettingsScreenProps = MainTabScreenProps<'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { temperatureUnit, toggleTemperatureUnit } = useSettings();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleTemperatureUnitToggle = async () => {
    try {
      await toggleTemperatureUnit();
    } catch (error) {
      Alert.alert('Error', 'Failed to save temperature preference');
    }
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Signing out..." size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* User Info Section */}
            <GlassContainer
              material="medium"
              borderRadius={spacing.radius.xl}
              padding="xl"
              style={styles.userCard}
            >
              <View style={styles.userInfo}>
                <Text style={styles.userIcon}>👤</Text>
                <View style={styles.userDetails}>
                  <Text style={styles.userLabel}>Signed in as</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
              </View>
            </GlassContainer>

            {/* Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>

              <InteractiveGlassCard
                material="light"
                elevation="low"
                enableHover={true}
                borderRadius={spacing.radius.lg}
                padding="lg"
                style={styles.settingCard}
              >
                <GlassSwitchWithLabel
                  label="Temperature Unit"
                  description={`Display temperatures in ${temperatureUnit === 'celsius' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
                  value={temperatureUnit === 'fahrenheit'}
                  onValueChange={handleTemperatureUnitToggle}
                />
              </InteractiveGlassCard>
            </View>

            {/* Actions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>

              <InteractiveGlassCard
                material="light"
                elevation="low"
                enableHover={true}
                enablePress={true}
                scaleOnPress={0.98}
                borderRadius={spacing.radius.lg}
                padding="lg"
                style={styles.actionCard}
              >
                <Button
                  title="Sign Out"
                  onPress={handleSignOut}
                  loading={authLoading}
                  variant="accent"
                  style={styles.signOutButton}
                />
              </InteractiveGlassCard>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>

              <GlassContainer
                material="light"
                borderRadius={spacing.radius.lg}
                padding="lg"
                style={styles.aboutCard}
              >
                <View style={styles.aboutContent}>
                  <Text style={styles.appName}>Glasscast</Text>
                  <Text style={styles.appVersion}>Version 1.0.0</Text>
                  <Text style={styles.appDescription}>
                    A modern weather app with beautiful glassmorphism design
                  </Text>
                  <Text style={styles.copyright}>
                    © 2024 Glasscast. All rights reserved.
                  </Text>
                </View>
              </GlassContainer>
            </View>

            {/* Bottom spacing */}
            <View style={{ height: spacing['4xl'] }} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base.black,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  userCard: {
    marginBottom: spacing.xl,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    fontSize: 40,
    marginRight: spacing.lg,
  },
  userDetails: {
    flex: 1,
  },
  userLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  settingCard: {
    marginBottom: spacing.sm,
  },
  actionCard: {
    marginBottom: spacing.sm,
  },
  signOutButton: {
    width: '100%',
  },
  aboutCard: {
    marginBottom: spacing.sm,
  },
  aboutContent: {
    alignItems: 'center',
  },
  appName: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.accent.primary,
    marginBottom: spacing.md,
  },
  appDescription: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  copyright: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.base.black,
  },
});