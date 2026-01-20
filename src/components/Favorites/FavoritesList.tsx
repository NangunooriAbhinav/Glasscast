import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../../hooks/useFavorites';
import { useWeather } from '../../hooks/useWeather';
import { GlassContainer } from '../Glass/GlassContainer';
import { InteractiveGlassCard } from '../Glass/GlassContainer';
import { LoadingSpinner } from '../LoadingSpinner';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { FavoriteCity } from '../../types/database';
import type { MainTabParamList } from '../../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window');

type FavoritesListNavigationProp = BottomTabNavigationProp<MainTabParamList>;

interface FavoritesListProps {
  style?: any;
}

interface FavoriteItemProps {
  favorite: FavoriteCity;
  onDelete: (cityId: string) => void;
  onSelect: (favorite: FavoriteCity) => void;
  temperature?: number;
  weatherIcon?: string;
  isLoadingWeather: boolean;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  favorite,
  onDelete,
  onSelect,
  temperature,
  weatherIcon,
  isLoadingWeather,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderGrant: () => {
        // Start swipe
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < -50) {
          // Swiping left - show delete button
          Animated.timing(deleteOpacity, {
            toValue: Math.min(Math.abs(gestureState.dx) / 100, 1),
            duration: 0,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(deleteOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }).start();
        }

        pan.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          // Swipe far enough left - trigger delete
          Animated.spring(pan, {
            toValue: { x: -screenWidth, y: 0 },
            useNativeDriver: false,
          }).start(() => {
            onDelete(favorite.id);
          });
        } else {
          // Return to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();

          Animated.timing(deleteOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const getWeatherEmoji = (condition?: string) => {
    if (!condition) return '⛅';
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('storm')) return '⛈️';
    return '⛅';
  };

  return (
    <View style={styles.itemContainer}>
      {/* Delete background */}
      <Animated.View
        style={[
          styles.deleteBackground,
          { opacity: deleteOpacity }
        ]}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>

      {/* Main item */}
      <Animated.View
        style={[
          styles.animatedItem,
          { transform: [{ translateX: pan.x }] }
        ]}
        {...panResponder.panHandlers}
      >
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
          style={styles.favoriteCard}
        >
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => onSelect(favorite)}
            activeOpacity={0.8}
          >
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{favorite.city_name}</Text>
              <Text style={styles.coordinates}>
                {favorite.lat.toFixed(2)}°, {favorite.lon.toFixed(2)}°
              </Text>
            </View>

            <View style={styles.weatherInfo}>
              {isLoadingWeather ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Text style={styles.weatherIcon}>
                    {weatherIcon || getWeatherEmoji()}
                  </Text>
                  <Text style={styles.temperature}>
                    {temperature ? `${temperature}°` : '--°'}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </InteractiveGlassCard>
      </Animated.View>
    </View>
  );
};

export const FavoritesList: React.FC<FavoritesListProps> = ({ style }) => {
  const navigation = useNavigation<FavoritesListNavigationProp>();
  const { favorites, removeFavorite, loading: favoritesLoading } = useFavorites();

  // State to track weather data for each favorite
  const [weatherCache, setWeatherCache] = useState<Record<string, { temperature?: number; icon?: string; loading: boolean }>>({});

  // Load weather data for each favorite
  useEffect(() => {
    const loadWeatherData = async () => {
      for (const favorite of favorites) {
        const cacheKey = `${favorite.lat}-${favorite.lon}`;

        // Skip if already loading or loaded
        if (weatherCache[cacheKey]?.loading || weatherCache[cacheKey]?.temperature !== undefined) {
          continue;
        }

        // Mark as loading
        setWeatherCache(prev => ({
          ...prev,
          [cacheKey]: { ...prev[cacheKey], loading: true }
        }));

        try {
          // Use a simple approach - we'll implement this properly
          // For now, simulate loading
          setTimeout(() => {
            const mockTemp = Math.floor(Math.random() * 30) + 10; // 10-40°C
            const mockIcons = ['☀️', '☁️', '🌧️', '⛅', '🌤️'];
            const mockIcon = mockIcons[Math.floor(Math.random() * mockIcons.length)];

            setWeatherCache(prev => ({
              ...prev,
              [cacheKey]: {
                temperature: mockTemp,
                icon: mockIcon,
                loading: false
              }
            }));
          }, 1000);
        } catch (error) {
          setWeatherCache(prev => ({
            ...prev,
            [cacheKey]: { ...prev[cacheKey], loading: false }
          }));
        }
      }
    };

    if (favorites.length > 0) {
      loadWeatherData();
    }
  }, [favorites]);

  const handleDeleteFavorite = (cityId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this city from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(cityId)
        },
      ]
    );
  };

  const handleSelectFavorite = (favorite: FavoriteCity) => {
    // Navigate to home tab with selected city
    navigation.navigate('Home', { selectedCity: favorite });
  };

  const renderEmptyState = () => (
    <GlassContainer
      material="light"
      borderRadius={spacing.radius.xl}
      padding="2xl"
      style={styles.emptyState}
    >
      <Text style={styles.emptyStateIcon}>⭐</Text>
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Add cities to favorites from the search results to see them here
      </Text>
    </GlassContainer>
  );

  const renderFavoriteItem = ({ item }: { item: FavoriteCity }) => {
    const cacheKey = `${item.lat}-${item.lon}`;
    const weatherData = weatherCache[cacheKey];

    return (
      <FavoriteItem
        favorite={item}
        onDelete={handleDeleteFavorite}
        onSelect={handleSelectFavorite}
        temperature={weatherData?.temperature}
        weatherIcon={weatherData?.icon}
        isLoadingWeather={weatherData?.loading || false}
      />
    );
  };

  if (favoritesLoading && favorites.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <LoadingSpinner message="Loading favorites..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Favorite Cities</Text>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  itemContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.accent.error,
    borderRadius: spacing.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.sm,
  },
  deleteText: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  animatedItem: {
    zIndex: 1,
  },
  favoriteCard: {
    marginBottom: spacing.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  coordinates: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  temperature: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  emptyState: {
    marginHorizontal: spacing.lg,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});