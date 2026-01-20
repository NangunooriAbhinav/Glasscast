import { useState, useEffect, useCallback, useRef } from "react";
import {
  favoritesService,
  type CityData,
  type FavoritesError,
} from "../services/favoritesService";
import type { FavoriteCity } from "../types/database";
import { useAuth } from "../context/AuthContext";

interface UseFavoritesState {
  favorites: FavoriteCity[];
  loading: boolean;
  error: FavoritesError | null;
}

interface UseFavoritesReturn extends UseFavoritesState {
  addFavorite: (city: CityData) => Promise<boolean>;
  removeFavorite: (cityId: string) => Promise<boolean>;
  isFavorite: (cityName: string) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
  clearError: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseFavoritesState>({
    favorites: [],
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return;

    if (!isMountedRef.current) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await favoritesService.getFavorites(user.id);

      if (!isMountedRef.current) return;

      setState({
        favorites: response.data || [],
        loading: false,
        error: response.error,
      });
    } catch (error) {
      if (!isMountedRef.current) return;

      setState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "An unexpected error occurred",
          code: "UNKNOWN_ERROR",
        },
      }));
    }
  }, [user?.id]);

  const addFavorite = useCallback(
    async (city: CityData): Promise<boolean> => {
      if (!user?.id) return false;

      // Optimistic update
      const { optimisticFavorite } = favoritesService.createOptimisticFavorite(
        user.id,
        city,
      );
      setState((prev) => ({
        ...prev,
        favorites: [...prev.favorites, optimisticFavorite],
      }));

      try {
        const response = await favoritesService.addFavorite(user.id, city);

        if (response.error) {
          // Revert optimistic update on error
          setState((prev) => ({
            ...prev,
            favorites: prev.favorites.filter(
              (fav) => fav.id !== optimisticFavorite.id,
            ),
            error: response.error,
          }));
          return false;
        }

        // Replace optimistic favorite with real data
        setState((prev) => ({
          ...prev,
          favorites: prev.favorites.map((fav) =>
            fav.id === optimisticFavorite.id ? response.data! : fav,
          ),
        }));

        return true;
      } catch (error) {
        // Revert optimistic update on error
        setState((prev) => ({
          ...prev,
          favorites: prev.favorites.filter(
            (fav) => fav.id !== optimisticFavorite.id,
          ),
          error: {
            message: "Failed to add favorite",
            code: "ADD_FAVORITE_ERROR",
          },
        }));
        return false;
      }
    },
    [user?.id],
  );

  const removeFavorite = useCallback(
    async (cityId: string): Promise<boolean> => {
      // Optimistic update
      const favoriteToRemove = state.favorites.find((fav) => fav.id === cityId);
      setState((prev) => ({
        ...prev,
        favorites: prev.favorites.filter((fav) => fav.id !== cityId),
      }));

      try {
        const response = await favoritesService.removeFavorite(cityId);

        if (response.error) {
          // Revert optimistic update on error
          if (favoriteToRemove) {
            setState((prev) => ({
              ...prev,
              favorites: [...prev.favorites, favoriteToRemove],
              error: response.error,
            }));
          }
          return false;
        }

        return true;
      } catch (error) {
        // Revert optimistic update on error
        if (favoriteToRemove) {
          setState((prev) => ({
            ...prev,
            favorites: [...prev.favorites, favoriteToRemove],
            error: {
              message: "Failed to remove favorite",
              code: "REMOVE_FAVORITE_ERROR",
            },
          }));
        }
        return false;
      }
    },
    [state.favorites],
  );

  const isFavorite = useCallback(
    async (cityName: string): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        const response = await favoritesService.isFavorite(user.id, cityName);
        return response.data || false;
      } catch (error) {
        return false;
      }
    },
    [user?.id],
  );

  const refreshFavorites = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites,
    clearError,
  };
};
