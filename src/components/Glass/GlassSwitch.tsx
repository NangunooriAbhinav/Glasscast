import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { GlassContainer } from "./GlassContainer";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface GlassSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: any;
}

export const GlassSwitch: React.FC<GlassSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Switch width (44) - knob size (20) - padding (2) = 22
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.glass.secondary, colors.glass.primary],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <GlassContainer
        material="medium"
        borderRadius={22} // Half of switch height
        style={styles.switchContainer}
      >
        <Animated.View
          style={[
            styles.switchTrack,
            {
              backgroundColor,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.switchKnob,
              {
                transform: [{ translateX }],
                opacity: disabled ? 0.7 : 1,
              },
            ]}
          />
        </Animated.View>
      </GlassContainer>
    </TouchableOpacity>
  );
};

interface GlassSwitchWithLabelProps extends GlassSwitchProps {
  label: string;
  description?: string;
}

export const GlassSwitchWithLabel: React.FC<GlassSwitchWithLabelProps> = ({
  label,
  description,
  ...switchProps
}) => {
  return (
    <View style={styles.labelContainer}>
      <View style={styles.labelContent}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <GlassSwitch {...switchProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
  },
  switchContainer: {
    padding: spacing.xs,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: colors.glass.tertiary,
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.primary,
    shadowColor: colors.background.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  labelContent: {
    flex: 1,
    marginRight: spacing.lg,
  },
  label: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});
