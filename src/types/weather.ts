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

// One Call API 3.0 interfaces
export interface OneCallCurrent {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
}

export interface OneCallMinutely {
  dt: number;
  precipitation: number;
}

export interface OneCallHourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number;
}

export interface OneCallDaily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface OneCallAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface OneCallData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: OneCallCurrent;
  minutely?: OneCallMinutely[];
  hourly?: OneCallHourly[];
  daily?: OneCallDaily[];
  alerts?: OneCallAlert[];
}

// Transformed interface for One Call data
export interface CompleteWeatherData {
  location: {
    lat: number;
    lon: number;
    timezone: string;
    timezoneOffset: number;
  };
  current: {
    timestamp: number;
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    windSpeed: number;
    windDirection: number;
    sunrise: number;
    sunset: number;
    condition: string;
    description: string;
    icon: string;
  };
  hourly?: Array<{
    timestamp: number;
    temperature: number;
    feelsLike: number;
    humidity: number;
    pop: number; // Probability of precipitation
    condition: string;
    icon: string;
  }>;
  daily?: Array<{
    timestamp: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moonPhase: number;
    summary: string;
    temperature: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feelsLike: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    condition: string;
    description: string;
    icon: string;
    pop: number;
    uvIndex: number;
  }>;
  alerts?: OneCallAlert[];
}