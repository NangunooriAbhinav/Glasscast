import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useTheme } from "../theme";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface TabBarIconProps {
  focused: boolean;
  children: React.ReactNode;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, children }) => {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  return (
    <View
      style={[styles.iconContainer, focused && styles.iconContainerFocused]}
    >
      {children}
    </View>
  );
};

export const GlassTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors, isDark } = useTheme();
  return (
    <BlurView
      intensity={30}
      tint={isDark ? "dark" : "light"}
      style={createStyles(colors, isDark).container}
    >
      <View style={createStyles(colors, isDark).tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const getTabIcon = (routeName: string, focused: boolean) => {
            const iconColor = focused
              ? colors.brand.primary
              : colors.text.secondary;

            switch (routeName) {
              case "Home":
                return (
                  <Text
                    style={[
                      createStyles(colors, isDark).icon,
                      { color: iconColor },
                    ]}
                  >
                    🏠
                  </Text>
                );
              case "Search":
                return (
                  <Text
                    style={[
                      createStyles(colors, isDark).icon,
                      { color: iconColor },
                    ]}
                  >
                    🔍
                  </Text>
                );
              case "Settings":
                return (
                  <Text
                    style={[
                      createStyles(colors, isDark).icon,
                      { color: iconColor },
                    ]}
                  >
                    ⚙️
                  </Text>
                );
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={createStyles(colors, isDark).tab}
            >
              <TabBarIcon focused={isFocused}>
                {getTabIcon(route.name, isFocused)}
              </TabBarIcon>
              <Text
                style={[
                  createStyles(colors, isDark).label,
                  isFocused
                    ? createStyles(colors, isDark).labelFocused
                    : createStyles(colors, isDark).labelUnfocused,
                ]}
              >
                {typeof label === "string" ? label : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 0.5,
      borderTopColor: colors.glass.secondary,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: "transparent",
      paddingBottom: spacing.xl, // Account for safe area
      paddingTop: spacing.md,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xs,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: spacing.radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xs,
      backgroundColor: "transparent",
    },
    iconContainerFocused: {
      backgroundColor: colors.glass.accent,
      shadowColor: colors.black,
      shadowOffset: spacing.shadowOffset.sm,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: {
      fontSize: 20,
    },
    label: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      textAlign: "center",
    },
    labelFocused: {
      color: colors.brand.primary,
    },
    labelUnfocused: {
      color: colors.text.secondary,
    },
  });
