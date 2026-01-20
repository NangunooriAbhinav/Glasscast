import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService, type City, type WeatherError } from '../services/weatherService';

interface UseSearchCitiesState {
  data: City[];
  loading: boolean;
  error: WeatherError | null;
}

interface UseSearchCitiesReturn extends UseSearchCitiesState {
  search: (query: string) => void;
  clearResults: () => void;
  clearError: () => void;
}

export const useSearchCities = (): UseSearchCitiesReturn => {
  const [state, setState] = useState<UseSearchCitiesState>({
    data: [],
    loading: false,
    error: null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const searchCities = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await weatherService.searchCities(query);

      if (!isMountedRef.current) return;

      setState({
        data: response.data || [],
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
  }, []);

  const search = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      searchCities(query);
    }, 300);
  }, [searchCities]);

  const clearResults = useCallback(() => {
    setState({ data: [], loading: false, error: null });
    setSearchQuery('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...state,
    search,
    clearResults,
    clearError,
  };
};