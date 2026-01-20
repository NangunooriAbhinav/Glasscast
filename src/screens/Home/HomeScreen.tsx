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
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  WeatherGlassBackground,
  WeatherGlassCard,
  InteractiveGlassCard,
  FloatingGlassCard,
  GlassContainer,
  WeatherActionButton,
  FloatingActionButton,
  SearchGlassInput,
} from "../../components/Glass";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useWeather } from "../../hooks/useWeather";
import { useFavorites } from "../../hooks/useFavorites";
import {
  colors,
  spacing,
  typography,
  glassEffects,
  animations,
} from "../../theme";
import { MainTabScreenProps, SelectedLocation } from "../../navigation/types";
import type { FavoriteCity } from "../../types/database";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type HomeScreenProps = MainTabScreenProps<"Home">;

// Default location - Mumbai, India
const DEFAULT_LOCATION: SelectedLocation = {
  name: "Mumbai",
  lat: 19.076,
  lon: 72.8777,
  country: "India",
  state: "Maharashtra",
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"weather" | "favorites">(
    "weather",
  );
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Use real weather hook
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeather(selectedLocation.lat, selectedLocation.lon);

  // Use favorites hook
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    addFavorite,
    removeFavorite,
    refreshFavorites,
  } = useFavorites();

  useEffect(() => {
    // Handle location change from navigation
    if (route.params?.selectedLocation) {
      setSelectedLocation(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);

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
    if (activeTab === "weather") {
      await refetchWeather();
    } else {
      await refreshFavorites();
    }
    setRefreshing(false);
  };

  const handleFavoritePress = async (favorite: FavoriteCity) => {
    const newLocation: SelectedLocation = {
      name: favorite.city_name,
      lat: favorite.lat,
      lon: favorite.lon,
      country: "India", // Most favorites will be Indian cities
      state: undefined,
    };
    setSelectedLocation(newLocation);
    setActiveTab("weather");
  };

  const handleRemoveFavorite = async (cityId: string) => {
    await removeFavorite(cityId);
  };

  const getWeatherCondition = () => {
    if (!weatherData) return "clear";
    const condition = weatherData.weather.condition.toLowerCase();
    if (condition.includes("sun") || condition.includes("clear"))
      return "sunny";
    if (condition.includes("cloud")) return "cloudy";
    if (condition.includes("rain")) return "rainy";
    if (condition.includes("storm")) return "stormy";
    if (condition.includes("snow")) return "snowy";
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

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("sun") || lowerCondition.includes("clear"))
      return "☀️";
    if (lowerCondition.includes("cloud")) return "☁️";
    if (lowerCondition.includes("rain")) return "🌧️";
    if (lowerCondition.includes("storm")) return "⛈️";
    if (lowerCondition.includes("snow")) return "❄️";
    if (lowerCondition.includes("mist") || lowerCondition.includes("fog"))
      return "🌫️";
    return "⛅";
  };

  const renderLoadingState = () => (
    <Animated.View
      style={[
        styles.loadingContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LoadingSpinner message="Getting weather data..." size="large" />
    </Animated.View>
  );

  const renderErrorState = () => (
    <Animated.View
      style={[
        styles.errorContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ErrorMessage
        message={weatherError?.message || "Failed to load weather data"}
        onRetry={refetchWeather}
      />
    </Animated.View>
  );

  const renderMainWeatherCard = () => {
    if (!weatherData) return null;

    return (
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
            <Text style={styles.locationText}>
              {selectedLocation.name}
              {selectedLocation.state && `, ${selectedLocation.state}`}
              {selectedLocation.country && `, ${selectedLocation.country}`}
            </Text>

            {/* Main temperature and condition */}
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperatureText}>
                {weatherData.temperature.current}°
              </Text>
              <View style={styles.conditionContainer}>
                <Text style={styles.weatherIcon}>
                  {getWeatherIcon(weatherData.weather.condition)}
                </Text>
                <Text style={styles.conditionText}>
                  {weatherData.weather.description}
                </Text>
                <Text style={styles.feelsLikeText}>
                  Feels like {weatherData.temperature.feelsLike}°
                </Text>
              </View>
            </View>

            {/* Weather details grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>
                  {weatherData.details.humidity}%
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weatherData.details.windSpeed)} m/s
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>
                  {weatherData.details.pressure} hPa
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weatherData.details.visibility / 1000)} km
                </Text>
              </View>
            </View>

            {/* High/Low temperatures */}
            <View style={styles.highLowContainer}>
              <Text style={styles.highLowText}>
                H: {weatherData.temperature.max}°
              </Text>
              <Text style={styles.highLowText}>
                L: {weatherData.temperature.min}°
              </Text>
            </View>
          </View>
        </WeatherGlassCard>
      </Animated.View>
    );
  };

  const renderLocationSelector = () => (
    <Animated.View
      style={[
        styles.locationSelectorContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <FloatingGlassCard
        material="medium"
        elevation="medium"
        enableHover={true}
        enablePress={true}
        pressable={true}
        onPress={() => navigation.navigate("Search")}
        borderRadius="2xl"
        padding="lg"
        style={styles.locationSelector}
      >
        <View style={styles.locationSelectorContent}>
          <Text style={styles.locationSelectorIcon}>📍</Text>
          <View style={styles.locationSelectorInfo}>
            <Text style={styles.locationSelectorTitle}>Current Location</Text>
            <Text style={styles.locationSelectorSubtitle}>
              {selectedLocation.name}
              {selectedLocation.state && `, ${selectedLocation.state}`}
            </Text>
          </View>
          <Text style={styles.locationSelectorChevron}>›</Text>
        </View>
      </FloatingGlassCard>
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

  const renderFavoritesContent = () => {
    if (favoritesLoading) {
      return (
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LoadingSpinner message="Loading favorites..." size="large" />
        </Animated.View>
      );
    }

    if (favoritesError) {
      return (
        <Animated.View
          style={[
            styles.errorContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ErrorMessage
            message={favoritesError.message || "Failed to load favorites"}
            onRetry={refreshFavorites}
          />
        </Animated.View>
      );
    }

    if (favorites.length === 0) {
      return (
        <Animated.View
          style={[
            styles.emptyStateContainer,
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
            style={styles.emptyStateCard}
          >
            <Text style={styles.emptyStateIcon}>⭐</Text>
            <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyStateMessage}>
              Search for cities and add them to your favorites to see quick
              weather updates here.
            </Text>
            <TouchableOpacity
              style={styles.addFavoriteButton}
              onPress={() => navigation.navigate("Search")}
            >
              <Text style={styles.addFavoriteButtonText}>
                Add Your First Favorite
              </Text>
            </TouchableOpacity>
          </GlassContainer>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.favoritesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {favorites.map((favorite, index) => (
          <InteractiveGlassCard
            key={favorite.id}
            material="medium"
            elevation="medium"
            enableHover={true}
            enablePress={true}
            scaleOnPress={0.98}
            scaleOnHover={1.02}
            borderRadius={spacing.radius.xl}
            padding="lg"
            margin="sm"
            style={styles.favoriteCard}
          >
            <TouchableOpacity
              style={styles.favoriteCardContent}
              onPress={() => handleFavoritePress(favorite)}
            >
              <View style={styles.favoriteInfo}>
                <View style={styles.favoriteHeader}>
                  <Text style={styles.favoriteTitle}>{favorite.city_name}</Text>
                  <TouchableOpacity
                    style={styles.removeFavoriteButton}
                    onPress={() => handleRemoveFavorite(favorite.id)}
                  >
                    <Text style={styles.removeFavoriteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.favoriteCoordinates}>
                  {favorite.lat.toFixed(2)}, {favorite.lon.toFixed(2)}
                </Text>
              </View>
              <View style={styles.favoriteWeatherPreview}>
                <Text style={styles.favoriteWeatherIcon}>🌤️</Text>
                <Text style={styles.favoriteActionText}>Tap for weather</Text>
              </View>
            </TouchableOpacity>
          </InteractiveGlassCard>
        ))}
      </Animated.View>
    );
  };

  return (
    <WeatherGlassBackground
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

        {/* Tab Navigation */}
        <Animated.View
          style={[
            styles.tabContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "weather" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("weather")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "weather" && styles.tabTextActive,
              ]}
            >
              🌤️ Current Weather
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "favorites" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("favorites")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "favorites" && styles.tabTextActive,
              ]}
            >
              ⭐ Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
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
          {activeTab === "weather" ? (
            <>
              {/* Location Selector */}
              {renderLocationSelector()}

              {/* Weather Content */}
              {weatherLoading && !weatherData ? (
                renderLoadingState()
              ) : weatherError ? (
                renderErrorState()
              ) : (
                <>
                  {renderMainWeatherCard()}
                  {renderActionCards()}
                </>
              )}
            </>
          ) : (
            renderFavoritesContent()
          )}

          {/* Bottom spacing */}
          <View style={{ height: spacing["6xl"] }} />
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton
          title=""
          icon={<Text style={styles.fabIcon}>+</Text>}
          style={styles.fab}
          onPress={() => navigation.navigate("Search")}
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
  locationSelectorContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  locationSelector: {
    minHeight: 60,
  },
  locationSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationSelectorIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  locationSelectorInfo: {
    flex: 1,
  },
  locationSelectorTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  locationSelectorSubtitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  locationSelectorChevron: {
    fontSize: 20,
    color: colors.text.muted,
    fontWeight: typography.weight.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["4xl"],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["4xl"],
  },
  mainCardContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  mainWeatherCard: {
    minHeight: 320,
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
    alignItems: "center",
  },
  weatherIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  conditionText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textTransform: "capitalize",
    textAlign: "center",
  },
  feelsLikeText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: "center",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
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
  highLowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
  },
  highLowText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
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
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.lg,
    backgroundColor: colors.glass.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xs,
  },
  tabButtonActive: {
    backgroundColor: colors.glass.accent,
  },
  tabText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },
  favoritesContainer: {
    paddingHorizontal: spacing.lg,
  },
  favoriteCard: {
    marginBottom: spacing.sm,
  },
  favoriteCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  favoriteTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  favoriteCoordinates: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  favoriteWeatherPreview: {
    alignItems: "center",
    marginLeft: spacing.md,
  },
  favoriteWeatherIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  favoriteActionText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "center",
  },
  removeFavoriteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.glass.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  removeFavoriteIcon: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyStateContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  addFavoriteButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.radius.lg,
    backgroundColor: colors.glass.accent,
  },
  addFavoriteButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
});
