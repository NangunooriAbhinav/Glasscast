import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import {
  GlassContainer,
  InteractiveGlassCard,
  GlassInput,
  WeatherGlassBackground,
} from "../../components/Glass";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useFavorites } from "../../hooks/useFavorites";
import { useTheme, useThemedStyles, spacing, typography } from "../../theme";
import type { MainTabScreenProps } from "../../navigation/types";
import type { City } from "../../types/weather";
import type { FavoriteCity } from "../../types/database";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type SearchScreenProps = MainTabScreenProps<"Search">;

interface LocationItemProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  isCurrentLocation?: boolean;
}

const LocationItem: React.FC<LocationItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  onFavorite,
  isFavorite,
  showFavoriteButton = false,
  isCurrentLocation = false,
}) => {
  const styles = useThemedStyles(createStyles);
  return (
    <InteractiveGlassCard
      material="medium"
      elevation="medium"
      enableHover={true}
      enablePress={true}
      scaleOnPress={0.98}
      scaleOnHover={1.02}
      borderRadius={spacing.radius.xl}
      padding="lg"
      margin="sm"
      style={styles.locationCard}
    >
      <TouchableOpacity style={styles.locationContent} onPress={onPress}>
        <View style={styles.locationIconContainer}>
          <Text style={styles.locationIcon}>{icon}</Text>
          {isCurrentLocation && <View style={styles.currentLocationDot} />}
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>{title}</Text>
          <Text style={styles.locationSubtitle}>{subtitle}</Text>
        </View>
        {showFavoriteButton && onFavorite && (
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onFavorite();
            }}
            disabled={isFavorite}
          >
            <Text
              style={[
                styles.favoriteIconText,
                isFavorite && styles.favoriteIconActive,
              ]}
            >
              {isFavorite ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </InteractiveGlassCard>
  );
};

// Major Indian Cities for search
const majorIndianCities: City[] = [
  {
    id: 1,
    name: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coord: { lat: 19.076, lon: 72.8777 },
  },
  {
    id: 2,
    name: "Delhi",
    state: "Delhi",
    country: "India",
    coord: { lat: 28.7041, lon: 77.1025 },
  },
  {
    id: 3,
    name: "Bangalore",
    state: "Karnataka",
    country: "India",
    coord: { lat: 12.9716, lon: 77.5946 },
  },
  {
    id: 4,
    name: "Hyderabad",
    state: "Telangana",
    country: "India",
    coord: { lat: 17.385, lon: 78.4867 },
  },
  {
    id: 5,
    name: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    coord: { lat: 13.0827, lon: 80.2707 },
  },
  {
    id: 6,
    name: "Kolkata",
    state: "West Bengal",
    country: "India",
    coord: { lat: 22.5726, lon: 88.3639 },
  },
  {
    id: 7,
    name: "Pune",
    state: "Maharashtra",
    country: "India",
    coord: { lat: 18.5204, lon: 73.8567 },
  },
  {
    id: 8,
    name: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    coord: { lat: 23.0225, lon: 72.5714 },
  },
  {
    id: 9,
    name: "Jaipur",
    state: "Rajasthan",
    country: "India",
    coord: { lat: 26.9124, lon: 75.7873 },
  },
  {
    id: 10,
    name: "Surat",
    state: "Gujarat",
    country: "India",
    coord: { lat: 21.1702, lon: 72.8311 },
  },
  {
    id: 11,
    name: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    coord: { lat: 26.8467, lon: 80.9462 },
  },
  {
    id: 12,
    name: "Kanpur",
    state: "Uttar Pradesh",
    country: "India",
    coord: { lat: 26.4499, lon: 80.3319 },
  },
  {
    id: 13,
    name: "Nagpur",
    state: "Maharashtra",
    country: "India",
    coord: { lat: 21.1458, lon: 79.0882 },
  },
  {
    id: 14,
    name: "Indore",
    state: "Madhya Pradesh",
    country: "India",
    coord: { lat: 22.7196, lon: 75.8577 },
  },
  {
    id: 15,
    name: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    coord: { lat: 23.2599, lon: 77.4126 },
  },
  {
    id: 16,
    name: "Vadodara",
    state: "Gujarat",
    country: "India",
    coord: { lat: 22.3072, lon: 73.1812 },
  },
  {
    id: 17,
    name: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    coord: { lat: 11.0168, lon: 76.9558 },
  },
  {
    id: 18,
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    country: "India",
    coord: { lat: 17.7231, lon: 83.3975 },
  },
  {
    id: 19,
    name: "Kochi",
    state: "Kerala",
    country: "India",
    coord: { lat: 9.9312, lon: 76.2673 },
  },
  {
    id: 20,
    name: "Thiruvananthapuram",
    state: "Kerala",
    country: "India",
    coord: { lat: 8.5241, lon: 76.9366 },
  },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<any>(null);

  // Use favorites hook
  const {
    favorites,
    loading: favoritesLoading,
    addFavorite,
    removeFavorite,
  } = useFavorites();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = majorIndianCities.filter(
      (city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredResults(filtered);
    setShowDropdown(true);
  }, [searchQuery]);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to get current location.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Use reverse geocoding to get location name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const locationInfo = reverseGeocode[0];
        setCurrentLocation({
          name:
            locationInfo.city || locationInfo.subregion || "Current Location",
          lat: latitude,
          lon: longitude,
        });
      } else {
        setCurrentLocation({
          name: "Current Location",
          lat: latitude,
          lon: longitude,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationSelect = (city: City) => {
    const selectedLocation = {
      name: city.name,
      lat: city.coord.lat,
      lon: city.coord.lon,
      country: city.country,
      state: city.state,
    };

    setSearchQuery("");
    setShowDropdown(false);
    navigation.navigate("Home", { selectedLocation });
  };

  const handleCurrentLocationSelect = () => {
    if (!currentLocation) return;

    const selectedLocation = {
      name: currentLocation.name,
      lat: currentLocation.lat,
      lon: currentLocation.lon,
      country: "Current",
      state: undefined,
    };

    navigation.navigate("Home", { selectedLocation });
  };

  const handleFavoritePress = (favorite: FavoriteCity) => {
    const selectedLocation = {
      name: favorite.city_name,
      lat: favorite.lat,
      lon: favorite.lon,
      country: "India",
      state: undefined,
    };

    navigation.navigate("Home", { selectedLocation });
  };

  const handleAddToFavorites = async (city: City) => {
    const success = await addFavorite({
      city_name: city.name,
      lat: city.coord.lat,
      lon: city.coord.lon,
    });

    if (success) {
      Alert.alert("Success", `${city.name} added to favorites!`);
    } else {
      Alert.alert("Error", "Failed to add to favorites");
    }
  };

  const isCityFavorite = (city: City) => {
    return favorites.some((fav) => fav.city_name === city.name);
  };

  const handleRemoveFavorite = async (cityId: string) => {
    const success = await removeFavorite(cityId);
    if (success) {
      Alert.alert("Success", "Removed from favorites");
    } else {
      Alert.alert("Error", "Failed to remove from favorites");
    }
  };

  const renderSearchDropdown = () => {
    if (!showDropdown || filteredResults.length === 0) return null;

    return (
      <View style={styles.dropdownContainer}>
        <GlassContainer
          material="medium"
          borderRadius={spacing.radius.xl}
          style={styles.dropdown}
        >
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleLocationSelect(item)}
              >
                <View style={styles.dropdownItemContent}>
                  <Text style={styles.dropdownItemTitle}>{item.name}</Text>
                  <Text style={styles.dropdownItemSubtitle}>
                    {item.state}, {item.country}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.dropdownFavoriteButton,
                    isCityFavorite(item) && styles.dropdownFavoriteButtonActive,
                  ]}
                  onPress={() => handleAddToFavorites(item)}
                  disabled={isCityFavorite(item)}
                >
                  <Text style={styles.dropdownFavoriteIcon}>
                    {isCityFavorite(item) ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </GlassContainer>
      </View>
    );
  };

  return (
    <WeatherGlassBackground
      weatherCondition="clear"
      timeOfDay="morning"
      enableGlassOverlay={true}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Locations</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <GlassInput
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for cities..."
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
            rightIcon={
              searchQuery ? (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              ) : null
            }
          />
          {renderSearchDropdown()}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Current Location</Text>
            {locationLoading ? (
              <GlassContainer
                material="regular"
                borderRadius={spacing.radius.xl}
                padding="lg"
                style={styles.loadingCard}
              >
                <LoadingSpinner
                  message="Getting your location..."
                  size="small"
                />
              </GlassContainer>
            ) : currentLocation ? (
              <LocationItem
                title={currentLocation.name}
                subtitle={`${currentLocation.lat.toFixed(2)}, ${currentLocation.lon.toFixed(2)}`}
                icon="📍"
                onPress={handleCurrentLocationSelect}
                isCurrentLocation={true}
              />
            ) : (
              <TouchableOpacity
                style={styles.refreshLocationButton}
                onPress={getCurrentLocation}
              >
                <GlassContainer
                  material="regular"
                  borderRadius={spacing.radius.xl}
                  padding="lg"
                  style={styles.refreshCard}
                >
                  <Text style={styles.refreshIcon}>🔄</Text>
                  <Text style={styles.refreshText}>
                    Tap to get current location
                  </Text>
                </GlassContainer>
              </TouchableOpacity>
            )}
          </View>

          {/* Favorites Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ⭐ Favorites ({favorites.length})
            </Text>
            {favoritesLoading ? (
              <GlassContainer
                material="regular"
                borderRadius={spacing.radius.xl}
                padding="lg"
                style={styles.loadingCard}
              >
                <LoadingSpinner message="Loading favorites..." size="small" />
              </GlassContainer>
            ) : favorites.length === 0 ? (
              <GlassContainer
                material="regular"
                borderRadius={spacing.radius.xl}
                padding="xl"
                style={styles.emptyCard}
              >
                <Text style={styles.emptyIcon}>⭐</Text>
                <Text style={styles.emptyTitle}>No favorites yet</Text>
                <Text style={styles.emptySubtitle}>
                  Search for cities and add them to favorites
                </Text>
              </GlassContainer>
            ) : (
              favorites.map((favorite) => (
                <View key={favorite.id} style={styles.favoriteItemContainer}>
                  <LocationItem
                    title={favorite.city_name}
                    subtitle={`${favorite.lat.toFixed(2)}, ${favorite.lon.toFixed(2)}`}
                    icon="⭐"
                    onPress={() => handleFavoritePress(favorite)}
                  />
                  <TouchableOpacity
                    style={styles.removeFavoriteButton}
                    onPress={() => handleRemoveFavorite(favorite.id)}
                  >
                    <Text style={styles.removeFavoriteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Popular Cities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏙️ Popular Cities</Text>
            {majorIndianCities.slice(0, 10).map((city) => (
              <LocationItem
                key={city.id}
                title={city.name}
                subtitle={`${city.state}, ${city.country}`}
                icon="🏙️"
                onPress={() => handleLocationSelect(city)}
                onFavorite={() => handleAddToFavorites(city)}
                isFavorite={isCityFavorite(city)}
                showFavoriteButton={true}
              />
            ))}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: spacing["4xl"] }} />
        </ScrollView>
      </SafeAreaView>
    </WeatherGlassBackground>
  );
};

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    backButtonText: {
      fontSize: 18,
      fontWeight: typography.weight.medium,
      color: colors.text.primary,
    },
    headerTitle: {
      flex: 1,
      fontSize: typography.size.xl,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      textAlign: "center",
    },
    headerSpacer: {
      width: 40,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      position: "relative",
      zIndex: 1000,
    },
    searchIcon: {
      fontSize: 16,
      opacity: 0.7,
      color: colors.text.secondary,
    },
    clearIcon: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    dropdownContainer: {
      position: "absolute",
      top: "100%",
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 1001,
    },
    dropdown: {
      maxHeight: 200,
      marginTop: spacing.xs,
    },
    dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border.glass,
    },
    dropdownItemContent: {
      flex: 1,
    },
    dropdownItemTitle: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
    },
    dropdownItemSubtitle: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
    },
    dropdownFavoriteButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.glass.tertiary,
    },
    dropdownFavoriteButtonActive: {
      backgroundColor: colors.accent.error,
    },
    dropdownFavoriteIcon: {
      fontSize: 16,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.md,
      paddingLeft: spacing.sm,
    },
    locationCard: {
      marginBottom: spacing.sm,
    },
    locationContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    locationIconContainer: {
      position: "relative",
      marginRight: spacing.md,
    },
    locationIcon: {
      fontSize: 24,
    },
    currentLocationDot: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent.success,
    },
    locationInfo: {
      flex: 1,
    },
    locationTitle: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    locationSubtitle: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
    },
    favoriteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.glass.tertiary,
    },
    favoriteButtonActive: {
      backgroundColor: colors.accent.error,
    },
    favoriteIconText: {
      fontSize: 16,
    },
    favoriteIconActive: {
      color: colors.text.primary,
    },
    loadingCard: {
      alignItems: "center",
      paddingVertical: spacing.lg,
    },
    refreshLocationButton: {
      marginBottom: spacing.sm,
    },
    refreshCard: {
      alignItems: "center",
      paddingVertical: spacing.lg,
    },
    refreshIcon: {
      fontSize: 32,
      marginBottom: spacing.sm,
    },
    refreshText: {
      fontSize: typography.size.base,
      color: colors.text.secondary,
      textAlign: "center",
    },
    emptyCard: {
      alignItems: "center",
      paddingVertical: spacing.xl,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: spacing.md,
    },
    emptyTitle: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: typography.size.base,
      color: colors.text.secondary,
      textAlign: "center",
    },
    favoriteItemContainer: {
      position: "relative",
    },
    removeFavoriteButton: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.sm,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.glass.tertiary,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    removeFavoriteIcon: {
      fontSize: 12,
      color: colors.text.secondary,
    },
  });
