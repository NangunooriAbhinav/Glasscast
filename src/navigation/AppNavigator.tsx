import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import type { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

const LoadingScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background.primary,
      }}
    >
      <ActivityIndicator size="large" color={colors.brand.primary} />
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Give navigation some time to initialize
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while auth is being checked or navigation is initializing
  if (authLoading || !isNavigationReady) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: "modal",
        }}
      >
        {user ? (
          // User is authenticated - show main app
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{
              animationTypeForReplace: "push",
            }}
          />
        ) : (
          // User is not authenticated - show auth flow
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: "push",
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
