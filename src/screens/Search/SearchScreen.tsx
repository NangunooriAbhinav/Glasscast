import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSearchCities } from '../../hooks/useSearchCities';
import { useFavorites } from '../../hooks/useFavorites';
import { GlassContainer } from '../../components/Glass/GlassContainer';
import { InteractiveGlassCard } from '../../components/Glass/GlassContainer';
import { GlassInput } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FavoritesList } from '../../components/Favorites';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { MainTabScreenProps } from '../../navigation/types';
import type { City } from '../../types/weather';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type SearchScreenProps = MainTabScreenProps<'Search'>;

interface SearchResultItemProps {
  city: City;
  onAddToFavorites: (city: City) => void;
  isFavorite: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  city,
  onAddToFavorites,
  isFavorite,
}) => {
  const handleAddToFavorites = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAddToFavorites(city);
  };

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
      style={styles.resultCard}
    >
      <View style={styles.resultContent}>
        <View style={styles.cityInfo}>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.cityCountry}>
            {city.state ? `${city.state}, ` : ''}{city.country}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={handleAddToFavorites}
          disabled={isFavorite}
        >
          <Text style={[
            styles.favoriteIcon,
            isFavorite && styles.favoriteIconActive,
          ]}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </InteractiveGlassCard>
  );
};

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [optimisticFavorites, setOptimisticFavorites] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<any>(null);

  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    search,
    clearResults,
  } = useSearchCities();

  const { addFavorite, favorites } = useFavorites();

  // Check if a city is already a favorite (including optimistic updates)
  const isCityFavorite = (city: City): boolean => {
    const cityKey = `${city.lat},${city.lon}`;
    return favorites.some(fav => `${fav.lat},${fav.lon}` === cityKey) ||
           optimisticFavorites.has(cityKey);
  };

  const handleSearch = (query: string) => {
    search(query);
  };

  const handleAddToFavorites = async (city: City) => {
    const cityKey = `${city.lat},${city.lon}`;

    // Optimistic update - immediately show as favorite
    setOptimisticFavorites(prev => new Set(prev).add(cityKey));

    try {
      const success = await addFavorite({
        city_name: city.name,
        lat: city.lat,
        lon: city.lon,
      });

      if (!success) {
        // Revert optimistic update on failure
        setOptimisticFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(cityKey);
          return newSet;
        });

        Alert.alert(
          'Error',
          'Failed to add city to favorites. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(cityKey);
        return newSet;
      });

      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleScrollBegin = () => {
    Keyboard.dismiss();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>Search for cities</Text>
      <Text style={styles.emptyStateSubtitle}>
        Type a city name to find weather locations
      </Text>
    </View>
  );

  const renderNoResults = () => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsIcon}>📭</Text>
      <Text style={styles.noResultsTitle}>No cities found</Text>
      <Text style={styles.noResultsSubtitle}>
        Try searching with a different spelling or location
      </Text>
    </View>
  );

  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner
            message="Searching cities..."
            size="large"
          />
        </View>
      );
    }

    if (searchError) {
      return (
        <View style={styles.errorContainer}>
          <GlassContainer
            blurIntensity={20}
            borderRadius={spacing.radius.xl}
            padding="xl"
            style={styles.errorCard}
          >
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Search Error</Text>
            <Text style={styles.errorMessage}>
              {searchError.message || 'Failed to search cities'}
            </Text>
          </GlassContainer>
        </View>
      );
    }

    if (!searchResults || searchResults.length === 0) {
      return renderNoResults();
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => `${item.lat}-${item.lon}`}
        renderItem={({ item }) => (
          <SearchResultItem
            city={item}
            onAddToFavorites={handleAddToFavorites}
            isFavorite={isCityFavorite(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        contentContainerStyle={styles.resultsList}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  // Focus search input when screen mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Cities</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <GlassInput
            ref={searchInputRef}
            placeholder="Search for cities..."
            value=""
            onChangeText={handleSearch}
            fullWidth={true}
            enableFocusScale={true}
            focusScale={1.02}
            enableGlow={true}
            glowColor={colors.accent.primary}
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Search Results */}
        {renderSearchResults()}

        {/* Favorites List */}
        <FavoritesList />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.glass.secondary,
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
    textAlign: 'center',
    marginLeft: -44, // Compensate for back button width
  },
  headerSpacer: {
    width: 44,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  resultsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  resultCard: {
    marginBottom: spacing.sm,
  },
  resultContent: {
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
  cityCountry: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass.secondary,
    borderWidth: 0.5,
    borderColor: colors.glass.tertiary,
  },
  favoriteButtonActive: {
    backgroundColor: colors.accent.error,
    borderColor: colors.accent.error,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteIconActive: {
    color: colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorCard: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
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
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  noResultsTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});