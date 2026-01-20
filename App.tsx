import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { SettingsProvider } from "./src/context/SettingsContext";
import { ThemeProvider, useTheme } from "./src/theme";
import { AppNavigator } from "./src/navigation";

const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <>
      <AppNavigator />
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
