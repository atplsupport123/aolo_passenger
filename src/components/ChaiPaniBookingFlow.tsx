import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';
import {
  ArrowLeft,
  X,
  Gauge,
  Clock,
  Wallet,
  CreditCard,
  Banknote,
  Info,
  Check,
  Home,
  Calendar,
  User,
} from 'lucide-react-native';
import { Location, Ride } from '../types';
import ChaiCupIcon from './ChaiCupIcon';
import BottomNavBar from './BottomNavBar';

export interface ChaiPaniPackage {
  id: string;
  name: string;
  categoryTag: string;
  description: string;
  basePrice: number;
  includedKm: string;
  includedTime: string;
  extraKmRate: string;
  extraTimeRate: string;
  type: 'mini' | 'sedan' | 'suv';
}

const CHAI_PANI_PACKAGES: ChaiPaniPackage[] = [
  {
    id: 'pkg_mini',
    name: 'AOLO Mini',
    categoryTag: 'Mini / Hatchback',
    description: 'Compact & agile for quick tea breaks & city corners',
    basePrice: 280,
    includedKm: '10 km',
    includedTime: '45 mins',
    extraKmRate: '₹35/km',
    extraTimeRate: '₹1.5/min',
    type: 'mini',
  },
  {
    id: 'pkg_sedan',
    name: 'AOLO Prime Sedan',
    categoryTag: 'Sedan',
    description: 'Comfortable air-conditioned sedan with plush seating',
    basePrice: 350,
    includedKm: '10 km',
    includedTime: '45 mins',
    extraKmRate: '₹48/km',
    extraTimeRate: '₹2/min',
    type: 'sedan',
  },
  {
    id: 'pkg_suv',
    name: 'AOLO Prime SUV',
    categoryTag: 'SUV',
    description: 'Spacious high-ground clearance SUV for group hangouts',
    basePrice: 480,
    includedKm: '10 km',
    includedTime: '45 mins',
    extraKmRate: '₹68/km',
    extraTimeRate: '₹3/min',
    type: 'suv',
  },
];

interface ChaiPaniBookingFlowProps {
  onClose: () => void;
  onConfirmBooking: (booking: {
    package: ChaiPaniPackage;
    paymentMethod: string;
    pickup: Location;
    dropoff: Location;
  }) => void;
  pickupLocation?: Location;
  walletBalance?: number;
  onNavTabPress?: (tab: 'home' | 'bookings' | 'wallet' | 'account') => void;
}

// Crisp Vector Graphics matching the cute vehicle illustrations in screenshot
const VehicleIllustration: React.FC<{ type: 'mini' | 'sedan' | 'suv' }> = ({ type }) => {
  if (type === 'mini') {
    // Red Hatchback
    return (
      <Svg width={46} height={34} viewBox="0 0 54 40" fill="none">
        {/* Car shadow */}
        <Rect x="6" y="32" width="42" height="4" rx="2" fill="#CBD5E1" opacity={0.6} />
        {/* Car body */}
        <Path
          d="M8 24C8 22 9.5 20.5 11.5 20.5L14 20.5L18.5 11.5C19.5 9.5 21.5 8 24 8L36 8C38.5 8 40.5 9.5 41.5 11.5L46 20.5H48.5C50.5 20.5 52 22 52 24V28C52 29 51 30 50 30H45C45 27 42.5 24.5 39.5 24.5C36.5 24.5 34 27 34 30H22C22 27 19.5 24.5 16.5 24.5C13.5 24.5 11 27 11 30H7C6 30 5 29 5 28V26C5 24.8 6.2 24 8 24Z"
          fill="#EF4444"
        />
        {/* Front & Rear Windows */}
        <Path
          d="M20 12L16.2 19H27V11H23C21.8 11 20.6 11.4 20 12Z"
          fill="#BAE6FD"
        />
        <Path
          d="M29 11V19H43L39.5 12C39 11.4 38 11 37 11H29Z"
          fill="#BAE6FD"
        />
        {/* Headlight & Taillight */}
        <Rect x="48" y="22" width="3" height="4" rx="1.5" fill="#FEF08A" />
        <Rect x="5.5" y="22" width="2.5" height="4" rx="1.2" fill="#F87171" />
        {/* Wheels */}
        <Circle cx="16.5" cy="29" r="4.5" fill="#334155" />
        <Circle cx="16.5" cy="29" r="2" fill="#94A3B8" />
        <Circle cx="39.5" cy="29" r="4.5" fill="#334155" />
        <Circle cx="39.5" cy="29" r="2" fill="#94A3B8" />
      </Svg>
    );
  }

  if (type === 'sedan') {
    // Sleek Red/Crimson Sedan
    return (
      <Svg width={46} height={34} viewBox="0 0 56 40" fill="none">
        {/* Car shadow */}
        <Rect x="5" y="32" width="46" height="4" rx="2" fill="#CBD5E1" opacity={0.6} />
        {/* Sedan body */}
        <Path
          d="M5 25C5 23 6.5 21.5 8.5 21.5L12 21.5L16.5 12.5C17.5 10.5 19.5 9 22 9L36 9C38.5 9 40.5 10.5 41.5 12.5L46 21.5L50.5 21.5C52.5 21.5 54 23 54 25V28C54 29 53 30 52 30H46C46 27 43.5 24.5 40.5 24.5C37.5 24.5 35 27 35 30H21C21 27 18.5 24.5 15.5 24.5C12.5 24.5 10 27 10 30H5C4 30 3 29 3 28V26C3 25.4 4 25 5 25Z"
          fill="#DC2626"
        />
        {/* Windows */}
        <Path
          d="M18 12.5L14.2 19.5H27V11.5H22C20.5 11.5 19 12 18 12.5Z"
          fill="#E0F2FE"
        />
        <Path
          d="M29 11.5V19.5H43.5L40 12.5C39.2 11.8 38 11.5 37 11.5H29Z"
          fill="#E0F2FE"
        />
        {/* Headlight & Taillight */}
        <Rect x="51" y="23" width="2.8" height="3.5" rx="1.4" fill="#FEF08A" />
        <Rect x="3.2" y="23" width="2.2" height="3.5" rx="1.1" fill="#F87171" />
        {/* Wheels */}
        <Circle cx="15.5" cy="29" r="4.5" fill="#1E293B" />
        <Circle cx="15.5" cy="29" r="2" fill="#E2E8F0" />
        <Circle cx="40.5" cy="29" r="4.5" fill="#1E293B" />
        <Circle cx="40.5" cy="29" r="2" fill="#E2E8F0" />
      </Svg>
    );
  }

  // SUV (Blue)
  return (
    <Svg width={46} height={34} viewBox="0 0 54 40" fill="none">
      {/* Car shadow */}
      <Rect x="6" y="33" width="44" height="4" rx="2" fill="#CBD5E1" opacity={0.6} />
      {/* Roof rails */}
      <Rect x="17" y="6" width="24" height="2" rx="1" fill="#64748B" />
      {/* SUV Boxy Body */}
      <Path
        d="M6 25C6 23.5 7.2 22 8.8 22H13L16 11C16.8 8.8 18.5 7.5 21 7.5H41C43 7.5 44.5 9 45.2 11L48 22H50.5C52 22 53 23 53 24.5V28.5C53 29.5 52 30.5 51 30.5H46C46 27.2 43.3 24.5 40 24.5C36.7 24.5 34 27.2 34 30.5H22C22 27.2 19.3 24.5 16 24.5C12.7 24.5 10 27.2 10 30.5H6C5 30.5 4 29.5 4 28.5V26.5C4 25.5 5 25 6 25Z"
        fill="#2563EB"
      />
      {/* Windows */}
      <Path d="M17.5 11L14.8 20H26V9.5H21C19.5 9.5 18.2 10 17.5 11Z" fill="#DBEAFE" />
      <Path d="M28 9.5V20H45.5L43 11C42.5 10 41.5 9.5 40.5 9.5H28Z" fill="#DBEAFE" />
      {/* Headlight */}
      <Rect x="49" y="23" width="3.2" height="4" rx="1.5" fill="#FEF08A" />
      {/* Wheels */}
      <Circle cx="16" cy="29.5" r="5" fill="#0F172A" />
      <Circle cx="16" cy="29.5" r="2.2" fill="#94A3B8" />
      <Circle cx="40" cy="29.5" r="5" fill="#0F172A" />
      <Circle cx="40" cy="29.5" r="2.2" fill="#94A3B8" />
    </Svg>
  );
};

export default function ChaiPaniBookingFlow({
  onClose,
  onConfirmBooking,
  pickupLocation,
  walletBalance = 150,
  onNavTabPress,
}: ChaiPaniBookingFlowProps) {
  const insets = useSafeAreaInsets();
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg_sedan');
  const [selectedPayment, setSelectedPayment] = useState<'WALLET' | 'CARD_UPI' | 'CASH'>('WALLET');

  const selectedPackage =
    CHAI_PANI_PACKAGES.find((p) => p.id === selectedPkgId) || CHAI_PANI_PACKAGES[1];

  const pickup: Location = pickupLocation || {
    id: 'p_saharsa',
    name: 'Saharsa, Bihar',
    address: 'Auto-captured location',
    lat: 25.8824,
    lng: 86.5986,
  };

  const dropoff: Location = {
    id: 'd_flexible',
    name: 'Flexible City Ride (Within City Limits)',
    address: 'No drop needed • Flexible city ride (10 km / 45 mins)',
    lat: 25.885,
    lng: 86.602,
  };

  const handleBookPress = () => {
    let paymentStr = 'Wallet (₹' + walletBalance + ')';
    if (selectedPayment === 'CARD_UPI') paymentStr = 'Card / UPI';
    if (selectedPayment === 'CASH') paymentStr = 'Cash';

    onConfirmBooking({
      package: selectedPackage,
      paymentMethod: paymentStr,
      pickup,
      dropoff,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.circleBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={19} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <ChaiCupIcon size={20} />
            <Text style={styles.headerTitle}>CHAI-PANI MODE</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Flexible city ride • No fixed destination needed
          </Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={styles.circleBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={19} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 70 },
        ]}
        showsVerticalScrollIndicator={true}
      >
        {/* Dark Location Summary Card */}
        <View style={styles.darkLocationCard}>
          {/* Pickup row */}
          <View style={styles.locationRow}>
            <View style={styles.beaconOuter}>
              <View style={styles.beaconInner} />
            </View>
            <View style={styles.locationTextCol}>
              <Text style={styles.locationBadgeGreen}>
                PICKUP LOCATION (AUTO-CAPTURED)
              </Text>
              <Text style={styles.locationMainTitle}>{pickup.name}</Text>
            </View>
          </View>

          {/* Divider line */}
          <View style={styles.darkCardDivider} />

          {/* Destination row */}
          <View style={styles.locationRow}>
            <View style={styles.beaconOuter}>
              <View style={styles.beaconInner} />
            </View>
            <View style={styles.locationTextCol}>
              <Text style={styles.locationBadgeGreen}>
                DESTINATION (NO DROP NEEDED)
              </Text>
              <Text style={styles.locationMainTitle}>
                Flexible City Ride (Within City Limits)
              </Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionHeaderTitle}>
          SELECT CHAI-PANI VEHICLE PACKAGE
        </Text>

        {/* Vehicle Package Cards */}
        {CHAI_PANI_PACKAGES.map((pkg) => {
          const isSelected = pkg.id === selectedPkgId;

          return (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.vehicleCard,
                isSelected ? styles.vehicleCardSelected : styles.vehicleCardNormal,
              ]}
              onPress={() => setSelectedPkgId(pkg.id)}
              activeOpacity={0.88}
            >
              {/* Top Row: Icon + Info + Selected Badge */}
              <View style={styles.vehicleTopRow}>
                <View style={styles.vehicleIconBox}>
                  <VehicleIllustration type={pkg.type} />
                </View>

                <View style={styles.vehicleInfoCol}>
                  <View style={styles.vehicleTitleRow}>
                    <Text style={styles.vehicleNameText}>{pkg.name}</Text>

                    {isSelected && (
                      <View style={styles.selectedPill}>
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        <Text style={styles.selectedPillText}>SELECTED</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{pkg.categoryTag}</Text>
                  </View>

                  <Text style={styles.vehicleDescriptionText} numberOfLines={2}>
                    {pkg.description}
                  </Text>
                </View>
              </View>

              {/* Stats Box (Base Package, Included KM, Included Time) */}
              <View style={styles.statsBox}>
                {/* Base Package */}
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>BASE PACKAGE</Text>
                  <Text style={styles.baseFareValue}>₹{pkg.basePrice}</Text>
                </View>

                <View style={styles.statsDivider} />

                {/* Included KM */}
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>INCLUDED KM</Text>
                  <View style={styles.statValueRow}>
                    <Gauge size={16} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.statValText}>{pkg.includedKm}</Text>
                  </View>
                </View>

                <View style={styles.statsDivider} />

                {/* Included Time */}
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>INCLUDED TIME</Text>
                  <View style={styles.statValueRow}>
                    <Clock size={16} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.statValText}>{pkg.includedTime}</Text>
                  </View>
                </View>
              </View>

              {/* Extra Charges Row */}
              <View style={styles.extraChargesRow}>
                <View style={styles.extraPillGroup}>
                  <Text style={styles.extraLabel}>Extra KM:</Text>
                  <View style={styles.yellowPill}>
                    <Text style={styles.yellowPillText}>{pkg.extraKmRate}</Text>
                  </View>
                </View>

                <View style={styles.extraPillGroup}>
                  <Text style={styles.extraLabel}>Extra Time:</Text>
                  <View style={styles.yellowPill}>
                    <Text style={styles.yellowPillText}>{pkg.extraTimeRate}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Section: PAYMENT METHOD */}
        <Text style={styles.sectionHeaderTitle}>PAYMENT METHOD</Text>

        <View style={styles.paymentMethodsRow}>
          {/* Wallet */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedPayment === 'WALLET'
                ? styles.paymentCardDark
                : styles.paymentCardLight,
            ]}
            onPress={() => setSelectedPayment('WALLET')}
            activeOpacity={0.8}
          >
            <Wallet
              size={22}
              color={selectedPayment === 'WALLET' ? '#FFFFFF' : '#64748B'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.paymentOptionTitle,
                selectedPayment === 'WALLET'
                  ? styles.paymentTitleDark
                  : styles.paymentTitleLight,
              ]}
            >
              Wallet
            </Text>
            <Text style={styles.walletBalanceGreen}>₹{walletBalance}</Text>
          </TouchableOpacity>

          {/* Card / UPI */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedPayment === 'CARD_UPI'
                ? styles.paymentCardDark
                : styles.paymentCardLight,
            ]}
            onPress={() => setSelectedPayment('CARD_UPI')}
            activeOpacity={0.8}
          >
            <CreditCard
              size={22}
              color={selectedPayment === 'CARD_UPI' ? '#FFFFFF' : '#64748B'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.paymentOptionTitle,
                selectedPayment === 'CARD_UPI'
                  ? styles.paymentTitleDark
                  : styles.paymentTitleLight,
              ]}
            >
              Card / UPI
            </Text>
          </TouchableOpacity>

          {/* Cash */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedPayment === 'CASH'
                ? styles.paymentCardDark
                : styles.paymentCardLight,
            ]}
            onPress={() => setSelectedPayment('CASH')}
            activeOpacity={0.8}
          >
            <Banknote
              size={22}
              color={selectedPayment === 'CASH' ? '#FFFFFF' : '#64748B'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.paymentOptionTitle,
                selectedPayment === 'CASH'
                  ? styles.paymentTitleDark
                  : styles.paymentTitleLight,
              ]}
            >
              Cash
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notice Info Box */}
        <View style={styles.amberNoticeBox}>
          <Info size={18} color="#D97706" style={styles.noticeIcon} />
          <Text style={styles.noticeText}>
            <Text style={styles.noticeTextBold}>Zero hassle, multiple stops: </Text>
            Enjoy road-side tea, snacks, or relaxed meetings. Extra charges only apply if
            your ride exceeds <Text style={styles.noticeTextHighlight}>10 km</Text> or{' '}
            <Text style={styles.noticeTextHighlight}>45 mins</Text>.
          </Text>
        </View>

        {/* CTA Button to Book */}
        <TouchableOpacity
          style={styles.bookChaiPaniBtn}
          onPress={handleBookPress}
          activeOpacity={0.88}
        >
          <View style={styles.bookBtnContentRow}>
            <Text style={styles.bookBtnMainText}>
              BOOK CHAI-PANI RIDE • ₹{selectedPackage.basePrice}
            </Text>
          </View>
          <Text style={styles.bookBtnSubText}>
            {selectedPackage.name} • 10 km & 45 mins included
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation matching screenshot */}
      <BottomNavBar
        activeTab="home"
        onTabPress={(tab) => {
          onClose();
          onNavTabPress && onNavTabPress(tab);
        }}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 4,
  },
  darkLocationCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beaconOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  beaconInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  locationTextCol: {
    flex: 1,
  },
  locationBadgeGreen: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  locationMainTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  darkCardDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 10,
    marginLeft: 24,
  },
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 10,
    marginHorizontal: 16,
    textTransform: 'uppercase',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  vehicleCardNormal: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vehicleCardSelected: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vehicleIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfoCol: {
    flex: 1,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleNameText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 14,
    gap: 4,
  },
  selectedPillText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  vehicleDescriptionText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 16,
    fontWeight: '500',
  },
  statsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  baseFareValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  statValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  extraChargesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 2,
  },
  extraPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  extraLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  yellowPill: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
  },
  yellowPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#854D0E',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
  },
  paymentOptionCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  paymentCardDark: {
    backgroundColor: '#0F172A',
  },
  paymentCardLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentOptionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    marginTop: 6,
  },
  paymentTitleDark: {
    color: '#FFFFFF',
  },
  paymentTitleLight: {
    color: '#1E293B',
  },
  walletBalanceGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
  },
  amberNoticeBox: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF08A',
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeIcon: {
    marginTop: 1,
    marginRight: 9,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#78350F',
    fontWeight: '500',
  },
  noticeTextBold: {
    fontWeight: '800',
    color: '#92400E',
  },
  noticeTextHighlight: {
    fontWeight: '800',
    color: '#92400E',
  },
  bookChaiPaniBtn: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 15,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  bookBtnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookBtnMainText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  bookBtnSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ECFDF5',
    marginTop: 2,
  },
  bottomNavBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  activeNavText: {
    color: '#65A30D',
    fontWeight: '700',
  },
});
