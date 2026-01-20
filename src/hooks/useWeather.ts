import { useState, useEffect, useCallback } from 'react';
import { weatherService, type CurrentWeather, type WeatherError } from '../services/weatherService';

interface UseWeatherState {
  data: CurrentWeather | null;
  loading: boolean;
  error: WeatherError | null;
}

interface UseWeatherReturn extends UseWeatherState {
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useWeather = (lat: number | null, lon: number | null): UseWeatherReturn => {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    if (!lat || !lon) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await weatherService.getCurrentWeather(lat, lon);

      setState({
        data: response.data,
        loading: false,
        error: response.error,
      });
    } catch (error) {
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
    await fetchWeather();
  }, [fetchWeather]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    ...state,
    refetch,
    clearError,
  };
};