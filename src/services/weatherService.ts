import axios, { AxiosError } from 'axios';
import type {
  WeatherData,
  ForecastData,
  City,
  WeatherError,
  CurrentWeather,
  WeatherForecast,
} from '../types/weather';

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_API_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('Missing EXPO_PUBLIC_WEATHER_API_KEY environment variable');
}

// Create axios instance with timeout
const weatherApi = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface WeatherResponse<T = any> {
  data: T | null;
  error: WeatherError | null;
}

class WeatherService {
  /**
   * Get current weather data for coordinates
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherResponse<CurrentWeather>> {
    try {
      const response = await weatherApi.get<WeatherData>(
        `${WEATHER_API_BASE_URL}/weather`,
        {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
          },
        }
      );

      const transformedData = this.transformCurrentWeather(response.data);
      return { data: transformedData, error: null };
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch current weather');
    }
  }

  /**
   * Get 5-day weather forecast for coordinates
   */
  async getForecast(lat: number, lon: number): Promise<WeatherResponse<WeatherForecast>> {
    try {
      const response = await weatherApi.get<ForecastData>(
        `${WEATHER_API_BASE_URL}/forecast`,
        {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
          },
        }
      );

      const transformedData = this.transformForecast(response.data);
      return { data: transformedData, error: null };
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch weather forecast');
    }
  }

  /**
   * Search for cities by name
   */
  async searchCities(query: string, limit: number = 5): Promise<WeatherResponse<City[]>> {
    try {
      if (!query.trim()) {
        return { data: [], error: null };
      }

      const response = await weatherApi.get<City[]>(
        `${GEOCODING_API_BASE_URL}/direct`,
        {
          params: {
            q: query,
            limit,
            appid: API_KEY,
          },
        }
      );

      return { data: response.data, error: null };
    } catch (error) {
      return this.handleApiError(error, 'Failed to search cities');
    }
  }

  /**
   * Transform raw weather API response to our interface
   */
  private transformCurrentWeather(data: WeatherData): CurrentWeather {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      temperature: {
        current: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
      },
      weather: {
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      details: {
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      },
      timestamp: data.dt,
    };
  }

  /**
   * Transform raw forecast API response to our interface
   */
  private transformForecast(data: ForecastData): WeatherForecast {
    // Group forecast items by date
    const groupedByDate = data.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, typeof data.list>);

    // Transform each day's forecast
    const forecast = Object.entries(groupedByDate).map(([date, items]) => {
      const temps = items.map(item => item.main.temp);
      const humidities = items.map(item => item.main.humidity);
      const pressures = items.map(item => item.main.pressure);
      const windSpeeds = items.map(item => item.wind.speed);
      const precipitations = items.map(item => item.pop);

      return {
        date,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
        },
        weather: {
          condition: items[0].weather[0].main,
          description: items[0].weather[0].description,
          icon: items[0].weather[0].icon,
        },
        details: {
          humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
          pressure: Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length),
          windSpeed: Math.round((windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length) * 10) / 10,
          precipitation: Math.round((precipitations.reduce((a, b) => a + b, 0) / precipitations.length) * 100),
        },
        hourly: items.slice(0, 8).map(item => ({ // First 24 hours (3-hour intervals)
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          temperature: Math.round(item.main.temp),
          weather: {
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          },
          precipitation: Math.round(item.pop * 100),
        })),
      };
    });

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
      },
      forecast,
    };
  }

  /**
   * Handle API errors consistently
   */
  private handleApiError(error: any, defaultMessage: string): WeatherResponse<any> {
    let message = defaultMessage;
    let code: string | number | undefined;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ECONNABORTED') {
        message = 'Request timed out. Please check your connection.';
        code = 'TIMEOUT';
      } else if (!axiosError.response) {
        message = 'Network error. Please check your internet connection.';
        code = 'NETWORK_ERROR';
      } else {
        const status = axiosError.response.status;
        code = status;

        switch (status) {
          case 401:
            message = 'Invalid API key. Please check your configuration.';
            break;
          case 403:
            message = 'API access forbidden. Please check your permissions.';
            break;
          case 404:
            message = 'Weather data not found for this location.';
            break;
          case 429:
            message = 'Too many requests. Please try again later.';
            break;
          case 500:
            message = 'Weather service is temporarily unavailable.';
            break;
          default:
            message = `Weather API error: ${status}`;
        }
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      data: null,
      error: { message, code },
    };
  }
}

export const weatherService = new WeatherService();
export default weatherService;