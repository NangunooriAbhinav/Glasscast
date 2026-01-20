import { useState, useEffect, useCallback } from 'react';
import { weatherService, type CompleteWeatherData, type WeatherError } from '../services/weatherService';

interface UseOneCallWeatherState {
  data: CompleteWeatherData | null;
  loading: boolean;
  error: WeatherError | null;
}

interface UseOneCallWeatherReturn extends UseOneCallWeatherState {
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface OneCallOptions {
  exclude?: string[];
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
}

export const useOneCallWeather = (
  lat: number | null,
  lon: number | null,
  options: OneCallOptions = {}
): UseOneCallWeatherReturn => {
  const [state, setState] = useState<UseOneCallWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchOneCallWeather = useCallback(async () => {
    if (!lat || !lon) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await weatherService.getOneCallWeather(lat, lon, options);

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
  }, [lat, lon, options]);

  const refetch = useCallback(async () => {
    await fetchOneCallWeather();
  }, [fetchOneCallWeather]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchOneCallWeather();
  }, [fetchOneCallWeather]);

  return {
    ...state,
    refetch,
    clearError,
  };
};