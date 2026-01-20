import { supabase } from "./supabase";
import type { FavoriteCity, Database } from "../types/database";

export interface CityData {
  city_name: string;
  lat: number;
  lon: number;
}

export interface FavoritesError {
  message: string;
  code?: string;
}

export interface FavoritesResponse<T = any> {
  data: T | null;
  error: FavoritesError | null;
}

class FavoritesService {
  /**
   * Get all favorite cities for a user
   */
  async getFavorites(
    userId: string,
  ): Promise<FavoritesResponse<FavoriteCity[]>> {
    try {
      const { data, error } = await supabase
        .from("favorite_cities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        data: data || [],
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Failed to fetch favorites",
          code: "FETCH_FAVORITES_ERROR",
        },
      };
    }
  }

  /**
   * Add a city to user's favorites
   */
  async addFavorite(
    userId: string,
    city: CityData,
  ): Promise<FavoritesResponse<FavoriteCity>> {
    try {
      // Check if city is already favorited
      const existingCheck = await this.isFavorite(userId, city.city_name);
      if (existingCheck.data) {
        return {
          data: null,
          error: {
            message: "City is already in favorites",
            code: "CITY_ALREADY_FAVORITED",
          },
        };
      }

      const { data, error } = await supabase
        .from("favorite_cities")
        .insert({
          user_id: userId,
          city_name: city.city_name,
          lat: city.lat,
          lon: city.lon,
        } as any)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        data: data as FavoriteCity,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Failed to add favorite",
          code: "ADD_FAVORITE_ERROR",
        },
      };
    }
  }

  /**
   * Remove a city from favorites
   */
  async removeFavorite(cityId: string): Promise<FavoritesResponse<boolean>> {
    try {
      const { error } = await supabase
        .from("favorite_cities")
        .delete()
        .eq("id", cityId);

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        data: true,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Failed to remove favorite",
          code: "REMOVE_FAVORITE_ERROR",
        },
      };
    }
  }

  /**
   * Check if a city is favorited by user
   */
  async isFavorite(
    userId: string,
    cityName: string,
  ): Promise<FavoritesResponse<boolean>> {
    try {
      const { data, error } = await supabase
        .from("favorite_cities")
        .select("id")
        .eq("user_id", userId)
        .eq("city_name", cityName)
        .limit(1);

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        data: (data && data.length > 0) || false,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Failed to check favorite status",
          code: "CHECK_FAVORITE_ERROR",
        },
      };
    }
  }

  /**
   * Optimistically add a favorite (for immediate UI updates)
   * Returns the temporary favorite object and a function to revert on error
   */
  createOptimisticFavorite(
    userId: string,
    city: CityData,
  ): {
    optimisticFavorite: FavoriteCity;
    revert: () => void;
  } {
    const optimisticFavorite: FavoriteCity = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      city_name: city.city_name,
      lat: city.lat,
      lon: city.lon,
      created_at: new Date().toISOString(),
    };

    const revert = () => {
      // This would be called if the actual API call fails
      // The UI should remove the optimistic favorite
    };

    return { optimisticFavorite, revert };
  }
}

export const favoritesService = new FavoritesService();
export default favoritesService;
