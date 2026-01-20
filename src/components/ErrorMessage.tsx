import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { GlassCard } from "./Glass/GlassCard";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = "Try Again",
  style,
  textStyle,
  showRetry = true,
}) => {
  const containerStyle: ViewStyle = {
    margin: spacing.md,
    ...style,
  };

  const textStyleDefault: TextStyle = {
    color: colors.accent.error,
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    textAlign: "center",
    lineHeight: typography.size.lg,
    ...textStyle,
  };

  const retryButtonStyle: ViewStyle = {
    backgroundColor: colors.glass.accent,
    borderWidth: 0.5,
    borderColor: colors.accent.error,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    alignSelf: "center",
    shadowColor: colors.black,
    shadowOffset: spacing.shadowOffset.xs,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  };

  const retryTextStyle: TextStyle = {
    color: colors.accent.error,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "center",
  };

  return (
    <GlassCard
      borderRadius={spacing.radius.lg}
      style={containerStyle}
      padding="lg"
    >
      <Text style={textStyleDefault}>{message}</Text>
      {showRetry && onRetry && (
        <TouchableOpacity
          style={retryButtonStyle}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={retryTextStyle}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </GlassCard>
  );
};
