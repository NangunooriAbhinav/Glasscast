import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  RefreshControl,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  WeatherGlassBackground,
  WeatherGlassCard,
  InteractiveGlassCard,
  FloatingGlassCard,
  GlassContainer,
  WeatherActionButton,
  FloatingActionButton,
  SearchGlassInput,
} from "../components/Glass";
import {
  colors,
  spacing,
  typography,
  glassEffects,
  animations,
} from "../theme";
import { MainTabScreenProps } from "../navigation/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type HomeScreenProps = MainTabScreenProps<"Home">;

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
    icon: string;
  }>;
  weeklyForecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

const mockWeatherData: WeatherData = {
  location: "San Francisco, CA",
  temperature: 72,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  uvIndex: 6,
  visibility: 10,
  pressure: 30.15,
  feelsLike: 75,
  hourlyForecast: [
    { time: "12 PM", temperature: 72, condition: "Partly Cloudy", icon: "⛅" },
    { time: "1 PM", temperature: 74, condition: "Sunny", icon: "☀️" },
    { time: "2 PM", temperature: 76, condition: "Sunny", icon: "☀️" },
    { time: "3 PM", temperature: 78, condition: "Clear", icon: "☀️" },
    { time: "4 PM", temperature: 76, condition: "Partly Cloudy", icon: "⛅" },
    { time: "5 PM", temperature: 74, condition: "Cloudy", icon: "☁️" },
  ],
  weeklyForecast: [
    { day: "Today", high: 78, low: 62, condition: "Partly Cloudy", icon: "⛅" },
    { day: "Tue", high: 80, low: 64, condition: "Sunny", icon: "☀️" },
    { day: "Wed", high: 77, low: 61, condition: "Cloudy", icon: "☁️" },
    { day: "Thu", high: 75, low: 59, condition: "Rain", icon: "🌧️" },
    { day: "Fri", high: 73, low: 58, condition: "Rain", icon: "🌧️" },
    { day: "Sat", high: 76, low: 60, condition: "Partly Cloudy", icon: "⛅" },
    { day: "Sun", high: 79, low: 63, condition: "Sunny", icon: "☀️" },
  ],
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getWeatherCondition = () => {
    if (weatherData.condition.toLowerCase().includes("sunny")) return "sunny";
    if (weatherData.condition.toLowerCase().includes("cloud")) return "cloudy";
    if (weatherData.condition.toLowerCase().includes("rain")) return "rainy";
    if (weatherData.condition.toLowerCase().includes("storm")) return "stormy";
    return "clear";
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "night";
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    if (hour < 21) return "evening";
    return "night";
  };

  const renderMainWeatherCard = () => (
    <Animated.View
      style={[
        styles.mainCardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <WeatherGlassCard
        material="frosted"
        elevation="high"
        enableGlow={true}
        glowColor={colors.accent.primary}
        enableReflection={true}
        enableGradientOverlay={true}
        gradientColors={colors.gradient.primary}
        borderRadius="3xl"
        padding="xl"
        style={styles.mainWeatherCard}
      >
        <View style={styles.mainWeatherContent}>
          {/* Location */}
          <Text style={styles.locationText}>{weatherData.location}</Text>

          {/* Main temperature and condition */}
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperatureText}>
              {weatherData.temperature}°
            </Text>
            <View style={styles.conditionContainer}>
              <Text style={styles.conditionText}>{weatherData.condition}</Text>
              <Text style={styles.feelsLikeText}>
                Feels like {weatherData.feelsLike}°
              </Text>
            </View>
          </View>

          {/* Weather details grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>
                {weatherData.windSpeed} mph
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>UV Index</Text>
              <Text style={styles.detailValue}>{weatherData.uvIndex}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{weatherData.pressure} in</Text>
            </View>
          </View>
        </View>
      </WeatherGlassCard>
    </Animated.View>
  );

  const renderHourlyForecast = () => (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Hourly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hourlyContainer}
      >
        {weatherData.hourlyForecast.map((hour, index) => (
          <InteractiveGlassCard
            key={index}
            material="crystal"
            elevation="medium"
            enableHover={true}
            enablePress={true}
            scaleOnPress={0.95}
            scaleOnHover={1.05}
            borderRadius="2xl"
            padding="lg"
            margin="sm"
            style={styles.hourlyCard}
          >
            <Text style={styles.hourlyTime}>{hour.time}</Text>
            <Text style={styles.hourlyIcon}>{hour.icon}</Text>
            <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
          </InteractiveGlassCard>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderWeeklyForecast = () => (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>7-Day Forecast</Text>
      <GlassContainer
        material="regular"
        borderRadius="2xl"
        padding="lg"
        enableReflection={true}
        shadowType="medium"
      >
        {weatherData.weeklyForecast.map((day, index) => (
          <View key={index} style={styles.weeklyItem}>
            <Text style={styles.weeklyDay}>{day.day}</Text>
            <View style={styles.weeklyMiddle}>
              <Text style={styles.weeklyIcon}>{day.icon}</Text>
              <Text style={styles.weeklyCondition}>{day.condition}</Text>
            </View>
            <View style={styles.weeklyTemps}>
              <Text style={styles.weeklyHigh}>{day.high}°</Text>
              <Text style={styles.weeklyLow}>{day.low}°</Text>
            </View>
          </View>
        ))}
      </GlassContainer>
    </Animated.View>
  );

  const renderActionCards = () => (
    <Animated.View
      style={[
        styles.actionCardsContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <FloatingGlassCard
        material="mirror"
        elevation="floating"
        enableGlow={true}
        glowColor={colors.accent.secondary}
        pressable={true}
        onPress={() => navigation.navigate("Search")}
        style={styles.actionCard}
      >
        <Text style={styles.actionCardIcon}>🔍</Text>
        <Text style={styles.actionCardTitle}>Search</Text>
        <Text style={styles.actionCardSubtitle}>Find locations</Text>
      </FloatingGlassCard>

      <FloatingGlassCard
        material="mirror"
        elevation="floating"
        enableGlow={true}
        glowColor={colors.accent.success}
        pressable={true}
        onPress={() => navigation.navigate("Settings")}
        style={styles.actionCard}
      >
        <Text style={styles.actionCardIcon}>⚙️</Text>
        <Text style={styles.actionCardTitle}>Settings</Text>
        <Text style={styles.actionCardSubtitle}>Preferences</Text>
      </FloatingGlassCard>
    </Animated.View>
  );

  return (
    <WeatherGlassBackground
      type="dynamic"
      weatherCondition={getWeatherCondition()}
      timeOfDay={getTimeOfDay()}
      enableGlassOverlay={true}
      enableAmbientLight={true}
      enableDirectionalLight={true}
      enableVignette={true}
      vignetteIntensity={0.2}
      enableParallax={true}
      parallaxIntensity={5}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.container}>
        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SearchGlassInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for a city or location"
            fullWidth={true}
            enableFocusScale={true}
            focusScale={1.02}
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
            rightIcon={
              searchQuery ? (
                <WeatherActionButton
                  title=""
                  size="small"
                  onPress={() => setSearchQuery("")}
                  icon={<Text style={styles.clearIcon}>×</Text>}
                />
              ) : null
            }
          />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.text.primary}
              colors={[colors.accent.primary]}
            />
          }
        >
          {renderMainWeatherCard()}
          {renderHourlyForecast()}
          {renderWeeklyForecast()}
          {renderActionCards()}

          {/* Bottom spacing */}
          <View style={{ height: spacing["6xl"] }} />
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton
          title=""
          icon={<Text style={styles.fabIcon}>+</Text>}
          style={styles.fab}
          onPress={() => {
            // Add location action
          }}
        />
      </SafeAreaView>
    </WeatherGlassBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  mainCardContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  mainWeatherCard: {
    minHeight: 280,
  },
  mainWeatherContent: {
    flex: 1,
  },
  locationText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing["2xl"],
  },
  temperatureText: {
    fontSize: typography.size["6xl"],
    fontWeight: typography.weight.thin,
    color: colors.text.primary,
    marginRight: spacing.lg,
  },
  conditionContainer: {
    alignItems: "flex-start",
  },
  conditionText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  feelsLikeText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  sectionContainer: {
    marginBottom: spacing["2xl"],
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  hourlyContainer: {
    paddingHorizontal: spacing.sm,
  },
  hourlyCard: {
    width: 80,
    alignItems: "center",
  },
  hourlyTime: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  hourlyIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  hourlyTemp: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  weeklyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
  },
  weeklyDay: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    width: 60,
  },
  weeklyMiddle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  weeklyIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  weeklyCondition: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  weeklyTemps: {
    flexDirection: "row",
    alignItems: "center",
  },
  weeklyHigh: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginRight: spacing.sm,
    minWidth: 35,
    textAlign: "right",
  },
  weeklyLow: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    minWidth: 35,
    textAlign: "right",
  },
  actionCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionCard: {
    width: (screenWidth - spacing.lg * 3) / 2,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCardIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionCardTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionCardSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing["4xl"],
    width: 56,
    height: 56,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.text.primary,
    fontWeight: typography.weight.light,
  },
});
