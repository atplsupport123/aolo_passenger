import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Clock,
  Info,
  Search,
} from 'lucide-react-native';
import { brandColors, spacing, borderRadius } from '../theme';
import BottomNavBar from './BottomNavBar';

interface AirportBookingFlowProps {
  onClose: () => void;
  onConfirmAirportRide: (flight: string, terminal: string) => void;
}

export default function AirportBookingFlow({
  onClose,
  onConfirmAirportRide,
}: AirportBookingFlowProps) {
  const [direction, setDirection] = useState<'TO_AIRPORT' | 'FROM_AIRPORT'>('TO_AIRPORT');
  const [terminal, setTerminal] = useState<'T1' | 'T2'>('T2');
  const [flightNumber, setFlightNumber] = useState('');
  const [pickupCity, setPickupCity] = useState('Saharsa, Bihar');
  const [pickupAddress, setPickupAddress] = useState('Saharsa Junction, Saharsa, Bihar, 852201');
  const [dropoffCity, setDropoffCity] = useState('Kempegowda Intl Airport');
  const [dropoffAddress, setDropoffAddress] = useState('KIAL Rd, Devanahalli, Bengaluru');
  const [pickupDate, setPickupDate] = useState('09-10-2026');
  const [pickupTime, setPickupTime] = useState('12:00');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchFlights = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onConfirmAirportRide(flightNumber, terminal);
    }, 400);
  };

  const handleToggleDirection = (newDir: 'TO_AIRPORT' | 'FROM_AIRPORT') => {
    if (newDir === direction) return;
    setDirection(newDir);
    // Swap locations smoothly when direction changes
    const prevPickupCity = pickupCity;
    const prevPickupAddr = pickupAddress;
    setPickupCity(dropoffCity);
    setPickupAddress(dropoffAddress);
    setDropoffCity(prevPickupCity);
    setDropoffAddress(prevPickupAddr);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AIRPORT TRANSFER</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* RIDE TO AIRPORT / RIDE FROM AIRPORT Toggle */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabPill, direction === 'TO_AIRPORT' && styles.activeTabPill]}
            onPress={() => handleToggleDirection('TO_AIRPORT')}
            activeOpacity={0.8}
          >
            <PlaneTakeoff
              size={18}
              color={direction === 'TO_AIRPORT' ? '#0F172A' : '#7C8B7E'}
            />
            <Text
              style={[
                styles.tabText,
                direction === 'TO_AIRPORT' && styles.activeTabText,
              ]}
            >
              RIDE TO AIRPORT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, direction === 'FROM_AIRPORT' && styles.activeTabPill]}
            onPress={() => handleToggleDirection('FROM_AIRPORT')}
            activeOpacity={0.8}
          >
            <PlaneLanding
              size={18}
              color={direction === 'FROM_AIRPORT' ? '#0F172A' : '#7C8B7E'}
            />
            <Text
              style={[
                styles.tabText,
                direction === 'FROM_AIRPORT' && styles.activeTabText,
              ]}
            >
              RIDE FROM AIRPORT
            </Text>
          </TouchableOpacity>
        </View>

        {/* PICKUP LOCATION Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>PICKUP LOCATION</Text>
          <View style={styles.locationCard}>
            <View style={styles.pickupIconBadge}>
              <View style={styles.pickupInnerDot} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>{pickupCity}</Text>
              <Text style={styles.locationSubtitle} numberOfLines={1}>
                {pickupAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* DROPOFF LOCATION Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>DROPOFF LOCATION</Text>
          <View style={styles.locationCard}>
            <View style={styles.dropoffIconBadge}>
              <Plane size={16} color="#F43F5E" />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>{dropoffCity}</Text>
              <Text style={styles.locationSubtitle} numberOfLines={1}>
                {dropoffAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* SELECT TERMINAL & FLIGHT NO (OPTIONAL) ROW */}
        <View style={styles.twoColumnRow}>
          {/* Terminal Selector Column */}
          <View style={styles.leftColumn}>
            <Text style={styles.sectionLabel}>SELECT TERMINAL</Text>
            <View style={styles.terminalButtonGroup}>
              <TouchableOpacity
                style={[
                  styles.terminalPill,
                  terminal === 'T1' && styles.terminalPillActive,
                ]}
                onPress={() => setTerminal('T1')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.terminalText,
                    terminal === 'T1' && styles.terminalTextActive,
                  ]}
                >
                  T1
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.terminalPill,
                  terminal === 'T2' && styles.terminalPillActive,
                ]}
                onPress={() => setTerminal('T2')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.terminalText,
                    terminal === 'T2' && styles.terminalTextActive,
                  ]}
                >
                  T2
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Flight Number Column */}
          <View style={styles.rightColumn}>
            <Text style={styles.sectionLabel}>FLIGHT NO (OPTIONAL)</Text>
            <View style={styles.inputPill}>
              <TextInput
                style={styles.flightInput}
                value={flightNumber}
                onChangeText={setFlightNumber}
                placeholder="E.G., AI 402"
                placeholderTextColor="#7C8B7E"
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        {/* PICKUP DATE & PICKUP TIME ROW */}
        <View style={styles.twoColumnRow}>
          {/* Date Column */}
          <View style={styles.halfColumn}>
            <Text style={styles.sectionLabel}>PICKUP DATE</Text>
            <View style={styles.pickerPill}>
              <Calendar size={18} color="#84CC16" />
              <TextInput
                style={styles.pickerInput}
                value={pickupDate}
                onChangeText={setPickupDate}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#7C8B7E"
              />
              <Calendar size={15} color="#64748B" />
            </View>
          </View>

          {/* Time Column */}
          <View style={styles.halfColumn}>
            <Text style={styles.sectionLabel}>PICKUP TIME</Text>
            <View style={styles.pickerPill}>
              <Clock size={18} color="#84CC16" />
              <TextInput
                style={styles.pickerInput}
                value={pickupTime}
                onChangeText={setPickupTime}
                placeholder="HH:MM"
                placeholderTextColor="#7C8B7E"
              />
              <Clock size={15} color="#0F172A" />
            </View>
          </View>
        </View>

        {/* SEARCH FLIGHTS BUTTON (Centered after pickup date) */}
        <TouchableOpacity
          style={styles.searchFlightsBtn}
          onPress={handleSearchFlights}
          activeOpacity={0.85}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Search size={18} color="#A8E63C" strokeWidth={2.5} />
              <Text style={styles.searchFlightsBtnText}>SEARCH FLIGHTS</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Orange / Coral Waiting Notice Banner */}
        <View style={styles.noticeBanner}>
          <Info size={19} color="#F95738" style={styles.noticeIcon} />
          <Text style={styles.noticeText}>
            Free 1 hour waiting at the airport. Tolls and parking charges are included in the final estimate.
          </Text>
        </View>

      </ScrollView>

      <BottomNavBar activeTab="home" />
    </SafeAreaView>
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
    paddingHorizontal: spacing.px_4,
    paddingTop: spacing.px_2,
    paddingBottom: spacing.px_3,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing.px_4,
    paddingBottom: spacing.px_8,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F3F6F0',
    borderRadius: 26,
    padding: 4,
    marginVertical: spacing.px_4,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 22,
  },
  activeTabPill: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#7C8B7E',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '900',
  },
  sectionBlock: {
    marginBottom: spacing.px_4,
  },
  sectionLabel: {
    color: '#7C8B7E',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F0',
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  pickupIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4F4C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#84CC16',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dropoffIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  locationSubtitle: {
    color: '#7C8B7E',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.px_4,
  },
  leftColumn: {
    flex: 0.95,
  },
  rightColumn: {
    flex: 1.05,
  },
  halfColumn: {
    flex: 1,
  },
  terminalButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  terminalPill: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F3F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  terminalPillActive: {
    backgroundColor: '#FFF2EE',
    borderColor: '#FFA07A',
  },
  terminalText: {
    color: '#526056',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  terminalTextActive: {
    color: '#F95738',
    fontWeight: '900',
  },
  inputPill: {
    height: 46,
    backgroundColor: '#F3F6F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  flightInput: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    padding: 0,
  },
  pickerPill: {
    height: 46,
    backgroundColor: '#F3F6F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  pickerInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    padding: 0,
    textAlign: 'center',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF4F1',
    borderColor: '#FFD7CC',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginTop: 4,
    marginBottom: spacing.px_6,
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    color: '#F95738',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    lineHeight: 18,
  },
  searchFlightsBtn: {
    height: 52,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  searchFlightsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
  confirmButton: {
    height: 52,
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
});
