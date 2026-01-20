import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeather } from '../../hooks/useWeather';
import { useFavorites } from '../../hooks/useFavorites';
import { GlassContainer } from '../../components/Glass/GlassContainer';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ForecastCard, type ForecastDay } from '../../components/Forecast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { MainTabScreenProps } from '../../navigation/types';
import type { FavoriteCity } from '../../types/database';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type HomeScreenProps = MainTabScreenProps<'Home'>;

interface SkeletonProps {
  style?: any;
}

const Skeleton: React.FC<SkeletonProps> = ({ style }) => (
  <Animated.View style={[styles.skeleton, style]} />
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedCity, setSelectedCity] = useState<FavoriteCity | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { favorites, loading: favoritesLoading } = useFavorites();
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeather(
    selectedCity ? selectedCity.lat : null,
    selectedCity ? selectedCity.lon : null
  );

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock forecast data - in real app this would come from useForecast hook
  const mockForecast: ForecastDay[] = [
    { day: 'Today', high: 75, low: 58, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Wed', high: 78, low: 61, condition: 'Sunny', icon: '☀️' },
    { day: 'Thu', high: 73, low: 57, condition: 'Cloudy', icon: '☁️' },
    { day: 'Fri', high: 71, low: 55, condition: 'Rain', icon: '🌧️' },
    { day: 'Sat', high: 76, low: 59, condition: 'Partly Cloudy', icon: '⛅' },
  ];

  // Set default city on first load
  useEffect(() => {
    if (favorites.length > 0 && !selectedCity) {
      setSelectedCity(favorites[0]);
    }
  }, [favorites, selectedCity]);

  // Animate content when weather data loads
  useEffect(() => {
    if (weatherData && !weatherLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [weatherData, weatherLoading, fadeAnim, slideAnim]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchWeather();
    setRefreshing(false);
  };

  const handleCitySelect = (city: FavoriteCity) => {
    setSelectedCity(city);
    setShowCitySelector(false);
  };

  const renderCitySelector = () => (
    <View style={styles.citySelector}>
      <TouchableOpacity
        style={styles.citySelectorButton}
        onPress={() => setShowCitySelector(!showCitySelector)}
      >
        <Text style={styles.citySelectorText}>
          {selectedCity ? selectedCity.city_name : 'Select City'}
        </Text>
        <Text style={styles.citySelectorArrow}>
          {showCitySelector ? '↑' : '↓'}
        </Text>
      </TouchableOpacity>

      {showCitySelector && (
        <GlassContainer
          blurIntensity={25}
          borderRadius={spacing.radius.lg}
          style={styles.cityDropdown}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {favorites.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.cityOption,
                  selectedCity?.id === city.id && styles.cityOptionSelected,
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <Text style={[
                  styles.cityOptionText,
                  selectedCity?.id === city.id && styles.cityOptionTextSelected,
                ]}>
                  {city.city_name}
                </Text>
                {city.temperature && (
                  <Text style={styles.cityOptionTemp}>
                    {city.temperature}°
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </GlassContainer>
      )}
    </View>
  );

  const renderWeatherContent = () => {
    if (weatherLoading && !weatherData) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderCitySelector()}

          {/* Temperature skeleton */}
          <View style={styles.mainWeatherContainer}>
            <Skeleton style={styles.temperatureSkeleton} />
            <Skeleton style={styles.conditionSkeleton} />
          </View>

          {/* Details grid skeleton */}
          <View style={styles.detailsGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={styles.detailCard}>
                <Skeleton style={styles.detailSkeleton} />
                <Skeleton style={styles.detailValueSkeleton} />
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    if (weatherError) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderCitySelector()}
          <ErrorMessage
            message="Failed to load weather data"
            onRetry={refetchWeather}
            style={styles.errorContainer}
          />
        </ScrollView>
      );
    }

    if (!weatherData) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderCitySelector()}
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No weather data available
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Select a city or add favorites to get started
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <Animated.ScrollView
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
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderCitySelector()}

          {/* Main Weather Display */}
          <GlassContainer
            blurIntensity={30}
            borderRadius={spacing.radius['2xl']}
            style={styles.mainWeatherContainer}
          >
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {weatherData.temperature.current}°
              </Text>
              <View style={styles.conditionContainer}>
                <Text style={styles.conditionEmoji}>
                  {weatherData.weather.condition === 'Clear' ? '☀️' :
                   weatherData.weather.condition === 'Clouds' ? '☁️' :
                   weatherData.weather.condition === 'Rain' ? '🌧️' :
                   weatherData.weather.condition === 'Snow' ? '❄️' : '⛅'}
                </Text>
                <Text style={styles.condition}>
                  {weatherData.weather.description}
                </Text>
              </View>
            </View>

            <View style={styles.locationContainer}>
              <Text style={styles.location}>
                {weatherData.location.name}
              </Text>
            </View>

            <View style={styles.highLowContainer}>
              <Text style={styles.highLowText}>
                H: {weatherData.temperature.max}°
              </Text>
              <Text style={styles.highLowText}>
                L: {weatherData.temperature.min}°
              </Text>
            </View>
          </GlassContainer>

          {/* Weather Details */}
          <View style={styles.detailsGrid}>
            <GlassContainer
              blurIntensity={20}
              borderRadius={spacing.radius.lg}
              style={styles.detailCard}
            >
              <Text style={styles.detailLabel}>Feels Like</Text>
              <Text style={styles.detailValue}>
                {weatherData.temperature.feelsLike}°
              </Text>
            </GlassContainer>

            <GlassContainer
              blurIntensity={20}
              borderRadius={spacing.radius.lg}
              style={styles.detailCard}
            >
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {weatherData.details.humidity}%
              </Text>
            </GlassContainer>

            <GlassContainer
              blurIntensity={20}
              borderRadius={spacing.radius.lg}
              style={styles.detailCard}
            >
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>
                {weatherData.details.windSpeed} mph
              </Text>
            </GlassContainer>

            <GlassContainer
              blurIntensity={20}
              borderRadius={spacing.radius.lg}
              style={styles.detailCard}
            >
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>
                {weatherData.details.pressure} in
              </Text>
            </GlassContainer>
          </View>

          {/* 5-Day Forecast */}
          <ForecastCard
            forecast={mockForecast}
            onDayPress={(day, index) => {
              // Handle forecast day press - could navigate to detailed view
              console.log('Pressed forecast day:', day.day, index);
            }}
          />
        </Animated.View>
      </Animated.ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        {renderWeatherContent()}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base.black,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  citySelector: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    zIndex: 1000,
  },
  citySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass.primary,
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.glass.secondary,
  },
  citySelectorText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  citySelectorArrow: {
    fontSize: typography.size.lg,
    color: colors.text.secondary,
  },
  cityDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    marginTop: spacing.xs,
    zIndex: 1000,
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cityOptionSelected: {
    backgroundColor: colors.glass.accent,
  },
  cityOptionText: {
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  cityOptionTextSelected: {
    fontWeight: typography.weight.semibold,
  },
  cityOptionTemp: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  mainWeatherContainer: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
    minHeight: 250,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  temperature: {
    fontSize: typography.size['6xl'],
    fontWeight: typography.weight.thin,
    color: colors.text.primary,
  },
  conditionContainer: {
    alignItems: 'center',
  },
  conditionEmoji: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  condition: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  locationContainer: {
    marginBottom: spacing.md,
  },
  location: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  highLowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  highLowText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: (screenWidth - spacing.lg * 3) / 2,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  errorContainer: {
    marginTop: spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  skeleton: {
    backgroundColor: colors.glass.secondary,
    borderRadius: spacing.radius.md,
  },
  temperatureSkeleton: {
    height: 80,
    width: 120,
    marginBottom: spacing.lg,
  },
  conditionSkeleton: {
    height: 60,
    width: 100,
  },
  detailSkeleton: {
    height: 16,
    width: 60,
    marginBottom: spacing.sm,
  },
  detailValueSkeleton: {
    height: 24,
    width: 40,
  },
});