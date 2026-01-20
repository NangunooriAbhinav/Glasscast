export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  clouds: WeatherClouds;
  wind: WeatherWind;
  visibility: number;
  pop: number; // Probability of precipitation
  sys: {
    pod: string; // Part of day (d/n)
  };
  dt_txt: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface City {
  id: number;
  name: string;
  state?: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
}

export interface WeatherError {
  message: string;
  code?: string | number;
}

// Transformed interfaces for our app
export interface CurrentWeather {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  weather: {
    condition: string;
    description: string;
    icon: string;
  };
  details: {
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    sunrise: number;
    sunset: number;
  };
  timestamp: number;
}

export interface ForecastDay {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  weather: {
    condition: string;
    description: string;
    icon: string;
  };
  details: {
    humidity: number;
    pressure: number;
    windSpeed: number;
    precipitation: number;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    weather: {
      condition: string;
      icon: string;
    };
    precipitation: number;
  }>;
}

export interface WeatherForecast {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  forecast: ForecastDay[];
}