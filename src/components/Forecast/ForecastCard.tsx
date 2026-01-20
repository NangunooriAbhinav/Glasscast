import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { InteractiveGlassCard } from '../Glass/GlassContainer';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const { width: screenWidth } = Dimensions.get('window');

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface ForecastCardProps {
  forecast: ForecastDay[];
  onDayPress?: (day: ForecastDay, index: number) => void;
  style?: any;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  forecast,
  onDayPress,
  style,
}) => {
  const getWeatherEmoji = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return '⛈️';
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️';
    return '⛅'; // default
  };

  const renderForecastItem = (day: ForecastDay, index: number) => (
    <InteractiveGlassCard
      key={`${day.day}-${index}`}
      material="medium"
      elevation="medium"
      enableHover={true}
      enablePress={true}
      scaleOnPress={0.95}
      scaleOnHover={1.02}
      borderRadius={spacing.radius.xl}
      padding="lg"
      margin="sm"
      style={styles.forecastItem}
      pressable={!!onDayPress}
      onPress={() => onDayPress?.(day, index)}
    >
      <Text style={styles.dayText}>{day.day}</Text>
      <Text style={styles.weatherIcon}>
        {getWeatherEmoji(day.condition)}
      </Text>
      <View style={styles.temperatureContainer}>
        <Text style={styles.highTemp}>{day.high}°</Text>
        <Text style={styles.lowTemp}>{day.low}°</Text>
      </View>
    </InteractiveGlassCard>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={120} // Approximate width of each card + margin
        snapToAlignment="start"
      >
        {forecast.map((day, index) => renderForecastItem(day, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  forecastItem: {
    width: 100,
    alignItems: 'center',
    minHeight: 140,
  },
  dayText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  weatherIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  highTemp: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  lowTemp: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    color: colors.text.secondary,
  },
});