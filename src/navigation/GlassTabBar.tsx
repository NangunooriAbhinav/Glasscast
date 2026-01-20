import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface TabBarIcon {
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIcon> = ({ focused, children }) => (
  <View style={[
    styles.iconContainer,
    focused && styles.iconContainerFocused
  ]}>
    {children}
  </View>
);

export const GlassTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation
}) => {
  return (
    <BlurView
      intensity={30}
      tint="light"
      style={styles.container}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const getTabIcon = (routeName: string, focused: boolean) => {
            const iconColor = focused ? colors.accent.primary : colors.text.secondary;

            switch (routeName) {
              case 'Home':
                return (
                  <Text style={[styles.icon, { color: iconColor }]}>
                    🏠
                  </Text>
                );
              case 'Search':
                return (
                  <Text style={[styles.icon, { color: iconColor }]}>
                    🔍
                  </Text>
                );
              case 'Settings':
                return (
                  <Text style={[styles.icon, { color: iconColor }]}>
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
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <TabBarIcon focused={isFocused}>
                {getTabIcon(route.name, isFocused)}
              </TabBarIcon>
              <Text style={[
                styles.label,
                isFocused ? styles.labelFocused : styles.labelUnfocused
              ]}>
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: colors.glass.secondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingBottom: spacing.xl, // Account for safe area
    paddingTop: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: colors.glass.accent,
    shadowColor: colors.base.black,
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
    textAlign: 'center',
  },
  labelFocused: {
    color: colors.accent.primary,
  },
  labelUnfocused: {
    color: colors.text.secondary,
  },
});