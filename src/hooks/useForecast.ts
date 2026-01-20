import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService, type WeatherForecast, type WeatherError } from '../services/weatherService';

interface UseForecastState {
  data: WeatherForecast | null;
  loading: boolean;
  error: WeatherError | null;
}

interface UseForecastReturn extends UseForecastState {
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface ForecastCache {
  [key: string]: {
    data: WeatherForecast;
    timestamp: number;
  };
}

// Simple in-memory cache (in production, consider using AsyncStorage or similar)
const forecastCache: ForecastCache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getCacheKey = (lat: number, lon: number): string => `${lat.toFixed(4)},${lon.toFixed(4)}`;

const getCachedForecast = (lat: number, lon: number): WeatherForecast | null => {
  const key = getCacheKey(lat, lon);
  const cached = forecastCache[key];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Remove expired cache
  if (cached) {
    delete forecastCache[key];
  }

  return null;
};

const setCachedForecast = (lat: number, lon: number, data: WeatherForecast): void => {
  const key = getCacheKey(lat, lon);
  forecastCache[key] = {
    data,
    timestamp: Date.now(),
  };
};

export const useForecast = (lat: number | null, lon: number | null): UseForecastReturn => {
  const [state, setState] = useState<UseForecastState>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);

  const fetchForecast = useCallback(async (forceRefresh = false) => {
    if (!lat || !lon) return;

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = getCachedForecast(lat, lon);
      if (cached) {
        setState({
          data: cached,
          loading: false,
          error: null,
        });
        return;
      }
    }

    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await weatherService.getForecast(lat, lon);

      if (!isMountedRef.current) return;

      if (response.data) {
        setCachedForecast(lat, lon, response.data);
      }

      setState({
        data: response.data,
        loading: false,
        error: response.error,
      });
    } catch (error) {
      if (!isMountedRef.current) return;

      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
        },
      }));
    }
  }, [lat, lon]);

  const refetch = useCallback(async () => {
    await fetchForecast(true); // Force refresh bypasses cache
  }, [fetchForecast]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    refetch,
    clearError,
  };
};