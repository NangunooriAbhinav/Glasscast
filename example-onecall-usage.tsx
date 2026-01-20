// Example usage of the One Call 3.0 API
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useOneCallWeather } from './src/hooks/useOneCallWeather';
import { LoadingSpinner } from './src/components/LoadingSpinner';
import { ErrorMessage } from './src/components/ErrorMessage';

const OneCallWeatherExample: React.FC = () => {
  // Example coordinates (San Francisco)
  const lat = 37.7749;
  const lon = -122.4194;

  const {
    data: weatherData,
    loading,
    error,
    refetch,
  } = useOneCallWeather(lat, lon, {
    exclude: [], // Include all data (current, minutely, hourly, daily, alerts)
    units: 'metric', // Use metric units
    lang: 'en', // English language
  });

  if (loading) {
    return <LoadingSpinner message="Loading complete weather data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load weather data"
        onRetry={refetch}
      />
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.center}>
        <Text>No weather data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Current Weather */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Weather</Text>
        <Text>Temperature: {weatherData.current.temperature}°C</Text>
        <Text>Feels like: {weatherData.current.feelsLike}°C</Text>
        <Text>Condition: {weatherData.current.condition}</Text>
        <Text>Description: {weatherData.current.description}</Text>
        <Text>Humidity: {weatherData.current.humidity}%</Text>
        <Text>Pressure: {weatherData.current.pressure} hPa</Text>
        <Text>UV Index: {weatherData.current.uvIndex}</Text>
        <Text>Wind: {weatherData.current.windSpeed} m/s at {weatherData.current.windDirection}°</Text>
      </View>

      {/* Hourly Forecast (next 24 hours) */}
      {weatherData.hourly && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hourly Forecast (24h)</Text>
          {weatherData.hourly.slice(0, 8).map((hour, index) => (
            <View key={index} style={styles.hourlyItem}>
              <Text>{new Date(hour.timestamp * 1000).toLocaleTimeString()}</Text>
              <Text>{hour.temperature}°C</Text>
              <Text>{hour.condition}</Text>
              <Text>Rain: {hour.pop}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Daily Forecast */}
      {weatherData.daily && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          {weatherData.daily.map((day, index) => (
            <View key={index} style={styles.dailyItem}>
              <Text>{new Date(day.timestamp * 1000).toLocaleDateString()}</Text>
              <Text>High: {day.temperature.max}°C</Text>
              <Text>Low: {day.temperature.min}°C</Text>
              <Text>{day.condition}</Text>
              <Text>Rain: {day.pop}%</Text>
              <Text>UV: {day.uvIndex}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Weather Alerts */}
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Alerts</Text>
          {weatherData.alerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <Text style={styles.alertTitle}>{alert.event}</Text>
              <Text style={styles.alertSender}>{alert.sender_name}</Text>
              <Text style={styles.alertDescription}>{alert.description}</Text>
              <Text>From: {new Date(alert.start * 1000).toLocaleString()}</Text>
              <Text>To: {new Date(alert.end * 1000).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  hourlyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  dailyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  alertItem: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0',
    marginBottom: 4,
  },
  alertSender: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});

export default OneCallWeatherExample;