import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { GlassContainer } from '../../components/Glass/GlassContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { AuthScreenProps } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

type SignupScreenProps = AuthScreenProps<'Signup'>;

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Animated background
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate background gradient
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [backgroundAnim]);

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gradient.secondary[0], colors.gradient.primary[0]],
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignup = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setAuthError('');
    setSuccessMessage('');
    const result = await signUp(email.trim(), password);

    if (result.error) {
      setAuthError(result.error.message);
    } else {
      setSuccessMessage('Account created successfully! Redirecting...');
      // Auto-navigation after success
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    }
  };

  const handleLoginLink = () => {
    navigation.navigate('Login');
  };

  const handleRetry = () => {
    setAuthError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Animated.View style={[styles.background, { backgroundColor }]}>
        <View style={styles.overlay} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Glasscast to get started</Text>
          </View>

          <GlassContainer
            blurIntensity={20}
            borderRadius={spacing.radius.xl}
            style={styles.formContainer}
          >
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
                // Re-validate confirm password when password changes
                if (confirmPassword && confirmPassword !== text) {
                  setConfirmPasswordError('Passwords do not match');
                } else if (confirmPassword && confirmPassword === text) {
                  setConfirmPasswordError('');
                }
              }}
              placeholder="Create a password"
              secureTextEntry
              error={passwordError}
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              placeholder="Confirm your password"
              secureTextEntry
              error={confirmPasswordError}
            />

            {authError && (
              <ErrorMessage
                message={authError}
                onRetry={handleRetry}
                showRetry={true}
                style={styles.errorMessage}
              />
            )}

            {successMessage && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              style={styles.signupButton}
            />
          </GlassContainer>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text
              style={styles.loginLink}
              onPress={handleLoginLink}
            >
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  errorMessage: {
    marginBottom: spacing.md,
  },
  successMessage: {
    backgroundColor: colors.glass.accent,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.accent.success,
  },
  successText: {
    color: colors.accent.success,
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.accent.primary,
    textDecorationLine: 'underline',
  },
});