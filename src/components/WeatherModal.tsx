import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  CloudLightning,
  Droplets,
  Wind,
  Umbrella,
  Eye,
  Sparkles,
  Sun,
  CloudSun,
  CloudRain,
  Cloud,
} from 'lucide-react-native';

interface WeatherModalProps {
  onClose: () => void;
  locationName?: string;
}

export default function WeatherModal({
  onClose,
  locationName = 'SAHARSA, BIHAR',
}: WeatherModalProps) {
  const insets = useSafeAreaInsets();
  const [isCelsius, setIsCelsius] = useState(true);

  // Weather conversions
  const mainTempC = 27;
  const feelsLikeC = 32;
  const displayMainTemp = isCelsius ? mainTempC : Math.round((mainTempC * 9) / 5 + 32);
  const displayFeelsLike = isCelsius ? feelsLikeC : Math.round((feelsLikeC * 9) / 5 + 32);
  const unitSymbol = isCelsius ? '°C' : '°F';

  const hourlyData = [
    { time: 'Now', icon: Sun, color: '#84CC16', tempC: 24 },
    { time: '3:00 am', icon: CloudSun, color: '#84CC16', tempC: 24 },
    { time: '6:00 am', icon: CloudSun, color: '#84CC16', tempC: 25 },
    { time: '9:00 am', icon: CloudRain, color: '#3B82F6', tempC: 25 },
  ];

  const weeklyData = [
    { day: 'Mon', icon: Sun, color: '#84CC16', minC: 22, maxC: 28 },
    { day: 'Tue', icon: Cloud, color: '#94A3B8', minC: 25, maxC: 31 },
    { day: 'Wed', icon: CloudSun, color: '#84CC16', minC: 24, maxC: 30 },
    { day: 'Thu', icon: Sun, color: '#84CC16', minC: 23, maxC: 29 },
    { day: 'Fri', icon: CloudSun, color: '#84CC16', minC: 24, maxC: 30 },
    { day: 'Sat', icon: Cloud, color: '#94A3B8', minC: 23, maxC: 29 },
    { day: 'Sun', icon: Sun, color: '#84CC16', minC: 21, maxC: 27 },
  ];

  const convertTemp = (tempC: number) => {
    return isCelsius ? `${tempC}°` : `${Math.round((tempC * 9) / 5 + 32)}°`;
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weather</Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <X size={20} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Badge */}
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>{locationName}</Text>
        </View>

        {/* Hero Weather Icon */}
        <View style={styles.heroIconContainer}>
          <Cloud size={90} color="#A8E63C" strokeWidth={2.2} />
        </View>

        {/* Main Temperature & Condition */}
        <TouchableOpacity
          style={styles.tempHeroRow}
          activeOpacity={0.8}
          onPress={() => setIsCelsius(!isCelsius)}
        >
          <Text style={styles.mainTempNumber}>{displayMainTemp}</Text>
          <View style={styles.unitCol}>
            <Text style={styles.unitText}>{unitSymbol}</Text>
            <Text style={styles.swapText}>SWAP</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.conditionTitle}>Mostly Cloudy</Text>
        <Text style={styles.feelsLikeText}>FEELS LIKE {displayFeelsLike}°</Text>

        {/* 2x2 Weather Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Humidity */}
          <View style={styles.metricCard}>
            <Droplets size={22} color="#0284C7" strokeWidth={2.2} />
            <View style={styles.metricTextCol}>
              <Text style={styles.metricLabel}>HUMIDITY</Text>
              <Text style={styles.metricValue}>79%</Text>
            </View>
          </View>

          {/* Wind */}
          <View style={styles.metricCard}>
            <Wind size={22} color="#84CC16" strokeWidth={2.2} />
            <View style={styles.metricTextCol}>
              <Text style={styles.metricLabel}>WIND</Text>
              <Text style={styles.metricValue}>2 km/h</Text>
            </View>
          </View>

          {/* Rain Probability */}
          <View style={styles.metricCard}>
            <Umbrella size={22} color="#A855F7" strokeWidth={2.2} />
            <View style={styles.metricTextCol}>
              <Text style={styles.metricLabel}>RAIN PROB.</Text>
              <Text style={styles.metricValue}>0%</Text>
            </View>
          </View>

          {/* UV Index */}
          <View style={styles.metricCard}>
            <Eye size={22} color="#84CC16" strokeWidth={2.2} />
            <View style={styles.metricTextCol}>
              <Text style={styles.metricLabel}>UV INDEX</Text>
              <Text style={styles.metricValue}>Medium</Text>
            </View>
          </View>
        </View>

        {/* Advisory / Warning Card */}
        <View style={styles.advisoryCard}>
          <View style={styles.advisoryHeader}>
            <Sparkles size={18} color="#84CC16" strokeWidth={2.4} />
            <Text style={styles.advisoryTitle}>USE CAUTION</Text>
          </View>
          <Text style={styles.advisoryDesc}>
            Severe weather. SUV or Sedan is strongly recommended. Thunderstorm warning. High caution advised.
          </Text>
        </View>

        {/* Hourly Forecast */}
        <View style={styles.forecastCard}>
          <Text style={styles.sectionHeader}>HOURLY FORECAST</Text>
          <View style={styles.hourlyRow}>
            {hourlyData.map((item, index) => {
              const IconComp = item.icon;
              return (
                <View key={index} style={styles.hourlyCol}>
                  <Text style={styles.hourlyTime}>{item.time}</Text>
                  <IconComp size={24} color={item.color} strokeWidth={2} />
                  <Text style={styles.hourlyTemp}>{convertTemp(item.tempC)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 7-Day Forecast */}
        <View style={styles.forecastCard}>
          <Text style={styles.sectionHeader}>7-DAY FORECAST</Text>
          <View style={styles.weeklyList}>
            {weeklyData.map((item, index) => {
              const IconComp = item.icon;
              return (
                <View key={index} style={styles.weeklyRow}>
                  <Text style={styles.weeklyDay}>{item.day}</Text>
                  <View style={styles.weeklyIconWrap}>
                    <IconComp size={22} color={item.color} strokeWidth={2} />
                  </View>
                  <View style={styles.weeklyTempWrap}>
                    <Text style={styles.weeklyMinTemp}>{convertTemp(item.minC)}</Text>
                    <Text style={styles.weeklyMaxTemp}>{convertTemp(item.maxC)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  locationBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  heroIconContainer: {
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempHeroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mainTempNumber: {
    fontSize: 64,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 70,
  },
  unitCol: {
    marginLeft: 4,
    paddingTop: 8,
  },
  unitText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#64748B',
    lineHeight: 24,
  },
  swapText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  conditionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
    textAlign: 'center',
  },
  feelsLikeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 22,
    textAlign: 'center',
  },
  metricsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  metricTextCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  advisoryCard: {
    width: '100%',
    backgroundColor: '#FEFCE8',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#FEF08A',
    padding: 16,
    marginBottom: 16,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  advisoryTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  advisoryDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
    lineHeight: 19,
  },
  forecastCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  hourlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hourlyCol: {
    alignItems: 'center',
    gap: 10,
  },
  hourlyTime: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  hourlyTemp: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  weeklyList: {
    gap: 12,
  },
  weeklyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  weeklyDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    width: 45,
  },
  weeklyIconWrap: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyTempWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: 65,
    justifyContent: 'flex-end',
  },
  weeklyMinTemp: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  weeklyMaxTemp: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
});
