import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  WeatherGlassBackground,
  InteractiveGlassCard,
  FloatingGlassCard,
  GlassContainer,
  SearchGlassInput,
  WeatherActionButton,
  GlassButton,
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

type SearchScreenProps = MainTabScreenProps<"Search">;

interface LocationResult {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  temperature?: number;
  condition?: string;
  icon?: string;
}

interface RecentSearch {
  id: string;
  location: LocationResult;
  searchedAt: Date;
}

const mockLocationResults: LocationResult[] = [
  {
    id: "1",
    name: "San Francisco",
    region: "California",
    country: "United States",
    lat: 37.7749,
    lon: -122.4194,
    temperature: 72,
    condition: "Partly Cloudy",
    icon: "⛅",
  },
  {
    id: "2",
    name: "New York",
    region: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.006,
    temperature: 68,
    condition: "Clear",
    icon: "☀️",
  },
  {
    id: "3",
    name: "London",
    region: "England",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    temperature: 55,
    condition: "Rainy",
    icon: "🌧️",
  },
  {
    id: "4",
    name: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    temperature: 75,
    condition: "Sunny",
    icon: "☀️",
  },
  {
    id: "5",
    name: "Paris",
    region: "Île-de-France",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    temperature: 62,
    condition: "Cloudy",
    icon: "☁️",
  },
];

const mockRecentSearches: RecentSearch[] = [
  {
    id: "r1",
    location: mockLocationResults[0],
    searchedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "r2",
    location: mockLocationResults[2],
    searchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [recentSearches, setRecentSearches] =
    useState<RecentSearch[]>(mockRecentSearches);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Focus search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockLocationResults.filter(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.region.toLowerCase().includes(query.toLowerCase()) ||
          location.country.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);

    // Add to recent searches
    const newRecentSearch: RecentSearch = {
      id: Date.now().toString(),
      location,
      searchedAt: new Date(),
    };

    setRecentSearches((prev) => [
      newRecentSearch,
      ...prev.filter((item) => item.location.id !== location.id).slice(0, 4),
    ]);

    // Navigate back to home with selected location
    // navigation.navigate("Home", { selectedLocation: location });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderSearchResults = () => {
    if (!searchQuery.trim()) return null;

    if (isSearching) {
      return (
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GlassContainer
            material="regular"
            borderRadius="2xl"
            padding="xl"
            style={styles.loadingContainer}
          >
            <Text style={styles.loadingText}>Searching locations...</Text>
          </GlassContainer>
        </Animated.View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GlassContainer
            material="light"
            borderRadius="2xl"
            padding="xl"
            style={styles.noResultsContainer}
          >
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>No locations found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for a city, state, or country
            </Text>
          </GlassContainer>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.sectionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Search Results</Text>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <InteractiveGlassCard
              material="medium"
              elevation="medium"
              enableHover={true}
              enablePress={true}
              pressable={true}
              onPress={() => handleLocationSelect(item)}
              scaleOnPress={0.98}
              scaleOnHover={1.02}
              borderRadius="2xl"
              padding="lg"
              margin="sm"
              style={styles.locationCard}
            >
              <View style={styles.locationCardContent}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationRegion}>
                    {item.region}, {item.country}
                  </Text>
                </View>
                {item.temperature && (
                  <View style={styles.locationWeather}>
                    <Text style={styles.locationIcon}>{item.icon}</Text>
                    <Text style={styles.locationTemp}>{item.temperature}°</Text>
                  </View>
                )}
              </View>
            </InteractiveGlassCard>
          )}
        />
      </Animated.View>
    );
  };

  const renderRecentSearches = () => {
    if (searchQuery.trim() || recentSearches.length === 0) return null;

    return (
      <Animated.View
        style={[
          styles.sectionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <GlassButton
            title="Clear All"
            variant="ghost"
            size="small"
            onPress={clearRecentSearches}
          />
        </View>

        {recentSearches.map((recent, index) => (
          <InteractiveGlassCard
            key={recent.id}
            material="light"
            elevation="low"
            enableHover={true}
            enablePress={true}
            pressable={true}
            onPress={() => handleLocationSelect(recent.location)}
            scaleOnPress={0.98}
            borderRadius="xl"
            padding="lg"
            margin="sm"
            style={styles.recentCard}
          >
            <View style={styles.recentCardContent}>
              <View style={styles.recentIcon}>
                <Text style={styles.recentIconText}>🕐</Text>
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{recent.location.name}</Text>
                <Text style={styles.recentRegion}>
                  {recent.location.region}, {recent.location.country}
                </Text>
              </View>
              {recent.location.temperature && (
                <View style={styles.recentWeather}>
                  <Text style={styles.recentTemp}>
                    {recent.location.temperature}°
                  </Text>
                </View>
              )}
            </View>
          </InteractiveGlassCard>
        ))}
      </Animated.View>
    );
  };

  const renderPopularLocations = () => {
    if (searchQuery.trim()) return null;

    const popularLocations = mockLocationResults.slice(0, 4);

    return (
      <Animated.View
        style={[
          styles.sectionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Popular Locations</Text>
        <View style={styles.popularGrid}>
          {popularLocations.map((location, index) => (
            <FloatingGlassCard
              key={location.id}
              material="crystal"
              elevation="floating"
              enableGlow={true}
              glowColor={colors.accent.primary}
              pressable={true}
              onPress={() => handleLocationSelect(location)}
              borderRadius="2xl"
              style={styles.popularCard}
            >
              <Text style={styles.popularIcon}>{location.icon}</Text>
              <Text style={styles.popularName}>{location.name}</Text>
              <Text style={styles.popularTemp}>{location.temperature}°</Text>
            </FloatingGlassCard>
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <WeatherGlassBackground
      type="gradient"
      gradientColors={colors.gradient.secondary}
      enableGlassOverlay={true}
      enableAmbientLight={true}
      enableVignette={true}
      vignetteIntensity={0.15}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GlassButton
            title=""
            icon={<Text style={styles.backIcon}>←</Text>}
            variant="ghost"
            size="medium"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Search Locations</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Search Input */}
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
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for cities, countries..."
            fullWidth={true}
            enableFocusScale={true}
            focusScale={1.02}
            enableGlow={true}
            glowColor={colors.accent.primary}
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
            rightIcon={
              searchQuery ? (
                <WeatherActionButton
                  title=""
                  size="small"
                  onPress={clearSearch}
                  icon={<Text style={styles.clearIcon}>×</Text>}
                />
              ) : null
            }
          />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderSearchResults()}
          {renderRecentSearches()}
          {renderPopularLocations()}

          {/* Bottom spacing */}
          <View style={{ height: spacing["6xl"] }} />
        </ScrollView>
      </SafeAreaView>
    </WeatherGlassBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "center",
    marginLeft: -44, // Compensate for back button width
  },
  headerSpacer: {
    width: 44,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  sectionContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  noResultsText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  noResultsSubtext: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: "center",
  },
  locationCard: {
    marginBottom: spacing.md,
  },
  locationCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  locationRegion: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  locationWeather: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  locationTemp: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  recentCard: {
    marginBottom: spacing.md,
  },
  recentCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  recentIconText: {
    fontSize: 18,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recentRegion: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  recentWeather: {
    alignItems: "flex-end",
  },
  recentTemp: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  popularCard: {
    width: (screenWidth - spacing.lg * 3) / 2,
    aspectRatio: 1.2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  popularIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  popularName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  popularTemp: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
});
