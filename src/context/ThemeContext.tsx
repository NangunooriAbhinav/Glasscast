import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getThemeColors, ThemeColors, ColorScheme } from "../theme/colors";

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
  systemTheme: ColorSchemeName;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "@glasscast_theme";
const USE_SYSTEM_THEME_KEY = "@glasscast_use_system_theme";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const useSystemTheme = await AsyncStorage.getItem(
          USE_SYSTEM_THEME_KEY,
        );

        const shouldUseSystem = useSystemTheme !== "false";
        setIsSystemTheme(shouldUseSystem);

        if (shouldUseSystem) {
          const currentSystemTheme = Appearance.getColorScheme();
          setSystemTheme(currentSystemTheme);
          setColorScheme(currentSystemTheme === "dark" ? "dark" : "light");
        } else if (savedTheme) {
          setColorScheme(savedTheme as ColorScheme);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
      if (isSystemTheme) {
        setColorScheme(colorScheme === "dark" ? "dark" : "light");
      }
    });

    return () => subscription?.remove();
  }, [isSystemTheme]);

  const saveThemePreference = async (theme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const saveSystemThemePreference = async (useSystem: boolean) => {
    try {
      await AsyncStorage.setItem(
        USE_SYSTEM_THEME_KEY,
        useSystem.toString(),
      );
    } catch (error) {
      console.error("Error saving system theme preference:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme: ColorScheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(newTheme);
    setIsSystemTheme(false);
    saveThemePreference(newTheme);
    saveSystemThemePreference(false);
  };

  const setTheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    setIsSystemTheme(false);
    saveThemePreference(scheme);
    saveSystemThemePreference(false);
  };

  const setSystemThemePreference = (useSystem: boolean) => {
    setIsSystemTheme(useSystem);
    saveSystemThemePreference(useSystem);

    if (useSystem) {
      const currentSystemTheme = Appearance.getColorScheme();
      setSystemTheme(currentSystemTheme);
      setColorScheme(currentSystemTheme === "dark" ? "dark" : "light");
    }
  };

  const colors = getThemeColors(colorScheme);
  const isDark = colorScheme === "dark";

  const value: ThemeContextType = {
    colorScheme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
    systemTheme,
    isSystemTheme,
    setSystemTheme: setSystemThemePreference,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Hook for getting theme-aware styles
export const useThemedStyles = <T extends Record<string, any>>(
  stylesFn: (colors: ThemeColors, isDark: boolean) => T,
): T => {
  const { colors, isDark } = useTheme();
  return stylesFn(colors, isDark);
};

export default ThemeProvider;
