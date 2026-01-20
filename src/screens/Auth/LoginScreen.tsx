import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { GlassContainer, WeatherGlassBackground } from "../../components/Glass";
import { GlassInput } from "../../components/Glass/GlassInput";
import { GlassButton } from "../../components/Glass/GlassButton";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useTheme, useThemedStyles, spacing, typography } from "../../theme";
import type { AuthScreenProps } from "../../navigation/types";

const { width, height } = Dimensions.get("window");

type LoginScreenProps = AuthScreenProps<"Login">;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn, loading } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setAuthError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await signIn(email, password);
      if (result?.error) {
        setAuthError(result.error.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignupLink = () => {
    navigation.navigate("Signup");
  };

  const handleRetry = () => {
    setAuthError("");
    setEmailError("");
    setPasswordError("");
  };

  return (
    <WeatherGlassBackground
      weatherCondition="clear"
      timeOfDay={isDark ? "night" : "morning"}
      enableGlassOverlay={true}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your weather dashboard
              </Text>
            </Animated.View>

            {/* Login Form */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <GlassContainer
                material="regular"
                borderRadius={spacing.radius.xl}
                padding="xl"
                style={styles.formCard}
              >
                <GlassInput
                  label="Email Address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={!!emailError}
                  style={styles.input}
                />
                {emailError && (
                  <Text style={styles.errorText}>{emailError}</Text>
                )}

                <GlassInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter your password"
                  secureTextEntry
                  error={!!passwordError}
                  style={styles.input}
                />
                {passwordError && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}

                {authError && (
                  <ErrorMessage
                    message={authError}
                    onRetry={handleRetry}
                    showRetry={false}
                    style={styles.errorMessage}
                  />
                )}

                <GlassButton
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  variant="primary"
                  size="large"
                  style={styles.loginButton}
                />
              </GlassContainer>
            </Animated.View>

            {/* Footer */}
            <Animated.View
              style={[
                styles.footer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleSignupLink}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WeatherGlassBackground>
  );
};

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
    },
    header: {
      alignItems: "center",
      marginBottom: spacing["2xl"],
    },
    title: {
      fontSize: typography.size["3xl"],
      fontWeight: typography.weight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: "center",
    },
    subtitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.normal,
      color: colors.text.secondary,
      textAlign: "center",
      lineHeight: 24,
    },
    formContainer: {
      marginBottom: spacing.xl,
    },
    formCard: {
      minHeight: 280,
    },
    input: {
      marginBottom: spacing.md,
    },
    errorText: {
      fontSize: typography.size.sm,
      color: colors.accent.error,
      marginBottom: spacing.sm,
      marginTop: -spacing.sm,
      paddingLeft: spacing.sm,
    },
    errorMessage: {
      marginBottom: spacing.lg,
    },
    loginButton: {
      marginTop: spacing.md,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: spacing.lg,
    },
    footerText: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.normal,
      color: colors.text.secondary,
      marginRight: spacing.xs,
    },
    signupLink: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      color: colors.brand.primary,
    },
  });
