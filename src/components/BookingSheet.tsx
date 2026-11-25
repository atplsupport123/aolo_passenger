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
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  Maximize2,
  Minus,
  Plus,
  Tag,
  Info,
  Car,
  AlertTriangle,
  Ban,
} from 'lucide-react-native';
import { Location, VehicleClass } from '../types';
import { brandColors, spacing, borderRadius } from '../theme';
import BottomNavBar from './BottomNavBar';

export interface OnewayVehicle extends VehicleClass {
  subType: string;
  categoryName?: string;
  stars: number;
  seats: number;
  bags: number;
  kms: number;
  priceMin: number;
  priceMax: number;
  originalPrice: number;
  isRecommended?: boolean;
  carColor: string;
}

const AVAILABLE_VEHICLES: OnewayVehicle[] = [
  {
    id: 'veh_compact',
    name: 'AOLO Mini',
    subType: 'Swift, WagonR or equivalent',
    categoryName: 'Compact',
    description: 'Swift / WagonR • 4 Seats • 1 Bag • AC',
    stars: 4,
    seats: 4,
    bags: 1,
    kms: 110,
    priceMin: 54400,
    priceMax: 57120,
    originalPrice: 68000,
    basePrice: 54400,
    multiplier: 1.0,
    capacity: 4,
    eta: 4,
    icon: 'compact',
    carColor: '#EF4444',
  },
  {
    id: 'veh_sedan',
    name: 'AOLO Prime Sedan',
    subType: 'Dzire, Etios or equivalent',
    categoryName: 'Sedan',
    description: 'Dzire / Etios • 4 Seats • 2 Bags • AC',
    stars: 5,
    seats: 4,
    bags: 2,
    kms: 110,
    priceMin: 71200,
    priceMax: 74760,
    originalPrice: 89000,
    basePrice: 71200,
    multiplier: 1.25,
    capacity: 4,
    eta: 3,
    icon: 'sedan',
    isRecommended: true,
    carColor: '#3B82F6',
  },
  {
    id: 'veh_suv',
    name: 'AOLO Prime SUV',
    subType: 'Ertiga, Bolero or equivalent',
    categoryName: 'Small SUV',
    description: 'Ertiga / Bolero • 6 Seats • 3 Bags • AC',
    stars: 5,
    seats: 6,
    bags: 3,
    kms: 110,
    priceMin: 98880,
    priceMax: 103824,
    originalPrice: 123600,
    basePrice: 98880,
    multiplier: 1.6,
    capacity: 6,
    eta: 5,
    icon: 'suv',
    carColor: '#0EA5E9',
  },
  {
    id: 'veh_premium_suv',
    name: 'AOLO Premium SUV',
    subType: 'Innova, Camry or equivalent',
    categoryName: 'Premium SUV',
    description: 'Innova / Camry • 4 Seats • 4 Bags • AC',
    stars: 5,
    seats: 4,
    bags: 4,
    kms: 110,
    priceMin: 137760,
    priceMax: 144648,
    originalPrice: 172200,
    basePrice: 137760,
    multiplier: 2.2,
    capacity: 4,
    eta: 6,
    icon: 'luxury',
    carColor: '#F59E0B',
  },
];

interface BookingSheetProps {
  pickup: Location;
  dropoff: Location;
  selectedVehicle: VehicleClass;
  onSelectVehicle: (v: VehicleClass) => void;
  paymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  onConfirmRide: () => void;
  onCancel: () => void;
  rideType?: 'ONEWAY' | 'ROUNDTRIP' | 'RENTAL' | 'AIRPORT';
  addInsurance?: boolean;
  setAddInsurance?: (val: boolean) => void;
}

export default function BookingSheet({
  pickup,
  dropoff,
  selectedVehicle,
  onSelectVehicle,
  paymentMethod = 'WALLET',
  onConfirmRide,
  onCancel,
  rideType = 'ONEWAY',
}: BookingSheetProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<'SELECT_RIDE' | 'REVIEW_RIDE'>('SELECT_RIDE');
  const [expandedBreakupId, setExpandedBreakupId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(
    selectedVehicle?.id && AVAILABLE_VEHICLES.some((v) => v.id === selectedVehicle.id)
      ? selectedVehicle.id
      : 'veh_suv'
  );
  const [scheduleMode, setScheduleMode] = useState<'NOW' | 'SCHEDULE'>('NOW');
  const [inclusionsExpanded, setInclusionsExpanded] = useState(true);
  const [exclusionsExpanded, setExclusionsExpanded] = useState(true);
  const [restrictionsExpanded, setRestrictionsExpanded] = useState(true);
  const [cancellationExpanded, setCancellationExpanded] = useState(true);

  // Steppers state
  const [adults, setAdults] = useState(4);
  const [child, setChild] = useState(1);
  const [bigBag, setBigBag] = useState(1);
  const [luggage, setLuggage] = useState(2);

  const currentVeh =
    AVAILABLE_VEHICLES.find((v) => v.id === selectedId) || AVAILABLE_VEHICLES[0];

  const fareTotal = currentVeh.priceMin;
  const baseFare = Math.round(fareTotal * 0.8728);
  const taxes = Math.round(fareTotal * 0.11);
  const driverAllowance = 250;
  const advancePaid = Math.round(fareTotal * 0.25);
  const finalPayout = fareTotal - advancePaid;

  const handleSelectVeh = (veh: OnewayVehicle) => {
    setSelectedId(veh.id);
    onSelectVehicle(veh);
  };

  const pickupName = pickup?.name || 'Saharsa, Bihar';
  const pickupAddr = pickup?.address || 'Saharsa Junction, Saharsa, Bihar, 852201';
  const dropoffName = dropoff?.name || 'International Airport (AOL)';
  const dropoffAddr = dropoff?.address || 'Terminal 2, Airport Bypass Rd';

  if (currentStep === 'SELECT_RIDE') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top Header: ONEWAY / RIDE TYPE with Back Arrow */}
        <View style={styles.selectRideHeader}>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
          </TouchableOpacity>

          <Text style={styles.selectRideHeaderTitle}>
            {rideType === 'ONEWAY' ? 'ONEWAY' : rideType.toUpperCase()}
          </Text>

          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.selectRideScrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 85 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Dark Banner: SELECT RIDE / Choose your vehicle */}
          <View style={styles.selectRideHeroCard}>
            <View>
              <Text style={styles.selectRideHeroTitle}>SELECT RIDE</Text>
              <Text style={styles.selectRideHeroSubtitle}>Choose your vehicle</Text>
            </View>
            <Text style={{ fontSize: 28 }}>🚕</Text>
          </View>

          {/* Vehicle List Cards */}
          {AVAILABLE_VEHICLES.map((v) => {
            const isSelected = selectedId === v.id;
            const isExpanded = expandedBreakupId === v.id;

            return (
              <View
                key={v.id}
                style={[
                  styles.vehicleCardContainer,
                  isSelected && styles.vehicleCardSelected,
                ]}
              >
                {/* Floating RECOMMENDED badge */}
                {v.isRecommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>★ RECOMMENDED</Text>
                  </View>
                )}

                {/* Top Row: Icon + Names + Price */}
                <View style={styles.vehicleTopRow}>
                  {/* Vehicle Thumbnail Box */}
                  <View style={styles.vehicleThumbBox}>
                    <Text style={{ fontSize: 26 }}>
                      {v.id === 'veh_compact'
                        ? '🚗'
                        : v.id === 'veh_sedan'
                          ? '🚙'
                          : v.id === 'veh_suv'
                            ? '🚙'
                            : '✨'}
                    </Text>
                  </View>

                  {/* Middle: Title, SubType & Stars */}
                  <View style={styles.vehicleInfoWrap}>
                    <Text style={styles.vehicleModelTitle} numberOfLines={2}>
                      {v.subType}
                    </Text>
                    <Text style={styles.vehicleCategorySub}>
                      {v.categoryName || v.name} | AC
                    </Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text
                          key={star}
                          style={[
                            styles.starChar,
                            star <= v.stars ? styles.starGold : styles.starGray,
                          ]}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  </View>

                  {/* Right: Starts At & Price Range */}
                  <View style={styles.vehiclePriceBlock}>
                    <Text style={styles.startsAtSmallLabel}>STARTS AT</Text>
                    <Text style={styles.priceRangeBold}>
                      ₹{v.priceMin} - ₹{v.priceMax}
                    </Text>
                    <Text style={styles.struckPrice}>₹{v.originalPrice}</Text>
                  </View>
                </View>

                {/* Specs Row: Seats, Bags, Kms */}
                <View style={styles.specsBadgesRow}>
                  <View style={styles.specBadgePill}>
                    <Text style={{ fontSize: 12 }}>👤</Text>
                    <Text style={styles.specBadgePillText}>{v.seats} Seats</Text>
                  </View>

                  <View style={styles.specBadgePill}>
                    <Text style={{ fontSize: 12 }}>💼</Text>
                    <Text style={styles.specBadgePillText}>{v.bags} Bags</Text>
                  </View>

                  <View style={styles.specBadgePill}>
                    <Text style={{ fontSize: 12 }}>⏱</Text>
                    <Text style={styles.specBadgePillText}>{v.kms} Kms</Text>
                  </View>
                </View>

                {/* Bottom Row: FARE BREAKUP Link + SELECT Button */}
                <View style={styles.cardActionRow}>
                  <TouchableOpacity
                    style={styles.fareBreakupLink}
                    onPress={() => setExpandedBreakupId(isExpanded ? null : v.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.fareBreakupLinkText}>
                      FARE BREAKUP {isExpanded ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.selectPillBtn,
                      isSelected ? styles.selectPillBtnActive : styles.selectPillBtnInactive,
                    ]}
                    onPress={() => {
                      setSelectedId(v.id);
                      onSelectVehicle(v);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        isSelected
                          ? styles.selectPillBtnTextActive
                          : styles.selectPillBtnTextInactive,
                      ]}
                    >
                      {isSelected ? '✓ SELECTED' : 'SELECT'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Expandable Fare Breakup Details */}
                {isExpanded && (
                  <View style={styles.fareBreakupAccordion}>
                    <View style={styles.fareBreakupRow}>
                      <Text style={styles.fareBreakupRowLabel}>Base Fare ({v.kms} Kms included)</Text>
                      <Text style={styles.fareBreakupRowVal}>₹{Math.round(v.priceMin * 0.85)}</Text>
                    </View>
                    <View style={styles.fareBreakupRow}>
                      <Text style={styles.fareBreakupRowLabel}>Driver Allowance (Day & Night)</Text>
                      <Text style={styles.fareBreakupRowVal}>₹250</Text>
                    </View>
                    <View style={styles.fareBreakupRow}>
                      <Text style={styles.fareBreakupRowLabel}>Taxes & GST (11%)</Text>
                      <Text style={styles.fareBreakupRowVal}>₹{Math.round(v.priceMin * 0.11)}</Text>
                    </View>
                    <View
                      style={[
                        styles.fareBreakupRow,
                        {
                          borderTopWidth: 1,
                          borderColor: '#E2E8F0',
                          paddingTop: 6,
                          marginTop: 4,
                          marginBottom: 0,
                        },
                      ]}
                    >
                      <Text style={[styles.fareBreakupRowLabel, { fontWeight: '800', color: '#0F172A' }]}>
                        Estimated Range
                      </Text>
                      <Text style={[styles.fareBreakupRowVal, { fontWeight: '900', color: '#059669' }]}>
                        ₹{v.priceMin} - ₹{v.priceMax}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Sticky Bottom Dock: REVIEW YOUR RIDE → */}
        <View
          style={[
            styles.stickyBottomDock,
            { paddingBottom: Math.max(insets.bottom, 12) + 4 },
          ]}
        >
          <TouchableOpacity
            style={styles.reviewRideCtaBtn}
            onPress={() => setCurrentStep('REVIEW_RIDE')}
            activeOpacity={0.88}
          >
            <Text style={styles.reviewRideCtaBtnText}>REVIEW YOUR RIDE →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentStep('SELECT_RIDE')}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>INTERCITY</Text>
          <Text style={styles.rideIdText}>RIDE ID: #AOLO526646</Text>
        </View>

        <View style={styles.pendingBadge}>
          <View style={styles.pendingDot} />
          <Text style={styles.pendingText}>PENDING</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. ROUTE ACTIVE MAP CARD */}
        <View style={styles.mapCard}>
          {/* Simulated Dark Map Canvas */}
          <View style={styles.mapBackground}>
            {/* Background grid lines */}
            <View style={styles.mapGridLine1} />
            <View style={styles.mapGridLine2} />
            <View style={styles.mapGridLine3} />

            {/* Glowing route curve */}
            <View style={styles.routeCurveGlow} />

            {/* Car marker on route */}
            <View style={styles.carMarkerBox}>
              <Text style={styles.carMarkerEmoji}>🚕</Text>
              <Text style={styles.carMarkerText}>AOLO</Text>
            </View>

            {/* Destination Marker */}
            <View style={styles.destMarkerBox}>
              <View style={styles.destBadgePill}>
                <Text style={styles.destBadgeText}>INTERNATIONAL A...</Text>
              </View>
              <View style={styles.destOuterCircle}>
                <View style={styles.destInnerCircle} />
              </View>
            </View>
          </View>

          {/* Top Left Floating Route Info Badge */}
          <View style={styles.routeInfoBadge}>
            <Text style={styles.routeActiveLabel}>ROUTE ACTIVE</Text>
            <Text style={styles.routeDistanceText}>27 Km • 35 min</Text>
          </View>

          {/* Bottom Right Fullscreen Button */}
          <TouchableOpacity style={styles.fullScreenBtn} activeOpacity={0.8}>
            <Maximize2 size={13} color="#0F172A" strokeWidth={2.5} />
            <Text style={styles.fullScreenText}>FULL SCREEN</Text>
          </TouchableOpacity>
        </View>

        {/* 2. PICKUP & DESTINATION CARD */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderGreen}>PICKUP & DESTINATION</Text>

          <View style={styles.routeTimeline}>
            {/* Pickup Point */}
            <View style={styles.timelineRow}>
              <View style={styles.pickupOuterRing}>
                <View style={styles.pickupInnerRing} />
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={styles.locationTitle}>{pickupName}</Text>
                <Text style={styles.locationSubtitle} numberOfLines={1}>
                  {pickupAddr}
                </Text>
              </View>
            </View>

            {/* Dotted Vertical Line */}
            <View style={styles.timelineDottedLine} />

            {/* Dropoff Point */}
            <View style={styles.timelineRow}>
              <View style={styles.dropoffOuterRing}>
                <View style={styles.dropoffInnerRing} />
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={styles.locationTitle}>{dropoffName}</Text>
                <Text style={styles.locationSubtitle} numberOfLines={1}>
                  {dropoffAddr}
                </Text>
              </View>
            </View>
          </View>

          {/* Date & Time pill */}
          <View style={styles.dateTimePill}>
            <Calendar size={16} color="#10B981" />
            <Text style={styles.dateTimeText}>07 Jul, 08:22 PM (Now)</Text>
          </View>
        </View>

        {/* 3. RIDE NOW / SCHEDULE TOGGLE */}
        <View style={styles.scheduleSwitcher}>
          <TouchableOpacity
            style={[
              styles.schedulePill,
              scheduleMode === 'NOW' && styles.schedulePillActive,
            ]}
            onPress={() => setScheduleMode('NOW')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.scheduleText,
                scheduleMode === 'NOW' && styles.scheduleTextActive,
              ]}
            >
              RIDE NOW
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.schedulePill,
              scheduleMode === 'SCHEDULE' && styles.schedulePillActive,
            ]}
            onPress={() => setScheduleMode('SCHEDULE')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.scheduleText,
                scheduleMode === 'SCHEDULE' && styles.scheduleTextActive,
              ]}
            >
              SCHEDULE
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. SELECTED VEHICLE CARD */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeaderGreen}>SELECTED VEHICLE</Text>
            <TouchableOpacity
              onPress={() => setCurrentStep('SELECT_RIDE')}
              style={styles.changeVehicleBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.changeVehicleBtnText}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleDetailsRow}>
            {/* Left Car Icon Box */}
            <View style={styles.vehicleIconBox}>
              <Text style={styles.carEmoji}>
                {currentVeh.id === 'veh_compact'
                  ? '🚗'
                  : currentVeh.id === 'veh_sedan'
                    ? '🚙'
                    : currentVeh.id === 'veh_suv'
                      ? '🚙'
                      : '✨'}
              </Text>
            </View>

            {/* Middle Vehicle Info */}
            <View style={styles.vehicleInfoCol}>
              <Text style={styles.vehicleName}>{currentVeh.subType}</Text>
              <Text style={styles.vehicleSub}>{currentVeh.categoryName || currentVeh.name} • AC</Text>
              <View style={styles.specBadgesRow}>
                <View style={styles.specBadge}>
                  <Text style={styles.specBadgeText}>👤 {currentVeh.seats} seats</Text>
                </View>
                <View style={styles.specBadge}>
                  <Text style={styles.specBadgeText}>🧳 {currentVeh.bags} bags Max</Text>
                </View>
              </View>
            </View>

            {/* Right Price */}
            <View style={styles.vehiclePriceCol}>
              <Text style={styles.vehiclePriceText}>₹{currentVeh.priceMin}</Text>
              <Text style={styles.walletLabelText}>{paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* 5. PASSENGER DETAILS CARD */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeaderGreen}>PASSENGER DETAILS</Text>
            <View style={styles.noPetsBadge}>
              <Text style={styles.noPetsText}>🐾 No pets allowed ℹ</Text>
            </View>
          </View>

          <View style={styles.steppersGrid}>
            {/* ADULTS */}
            <View style={styles.stepperCard}>
              <Text style={styles.stepperLabel}>ADULTS</Text>
              <View style={styles.stepperControl}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setAdults(Math.max(1, adults - 1))}
                >
                  <Minus size={11} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.stepperVal}>{adults}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setAdults(Math.min(6, adults + 1))}
                >
                  <Plus size={11} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.stepperIcon}>👤</Text>
            </View>

            {/* CHILD */}
            <View style={styles.stepperCard}>
              <Text style={styles.stepperLabel}>CHILD</Text>
              <View style={styles.stepperControl}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setChild(Math.max(0, child - 1))}
                >
                  <Minus size={11} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.stepperVal}>{child}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setChild(Math.min(4, child + 1))}
                >
                  <Plus size={11} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.stepperIcon}>😊</Text>
            </View>

            {/* BIG BAG */}
            <View style={styles.stepperCard}>
              <Text style={styles.stepperLabel}>BIG BAG</Text>
              <View style={styles.stepperControl}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setBigBag(Math.max(0, bigBag - 1))}
                >
                  <Minus size={11} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.stepperVal}>{bigBag}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setBigBag(Math.min(4, bigBag + 1))}
                >
                  <Plus size={11} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.stepperIcon}>🧳</Text>
            </View>

            {/* LUGGAGE */}
            <View style={styles.stepperCard}>
              <Text style={styles.stepperLabel}>LUGGAGE</Text>
              <View style={styles.stepperControl}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setLuggage(Math.max(0, luggage - 1))}
                >
                  <Minus size={11} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.stepperVal}>{luggage}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setLuggage(Math.min(6, luggage + 1))}
                >
                  <Plus size={11} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.stepperIcon}>💼</Text>
            </View>
          </View>
        </View>

        {/* 6. FARE DETAILS CARD */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeaderGreen}>FARE DETAILS</Text>

          <View style={styles.fareHeaderRow}>
            <View>
              <Text style={styles.estimateFareTitle}>Estimate Fare</Text>
              <Text style={styles.estimateFareSub}>27 Km • 35 min</Text>
            </View>
            <Text style={styles.estimateFareMainAmount}>₹{fareTotal}</Text>
          </View>

          <View style={styles.fareDivider} />

          {/* Breakdown Lines */}
          <View style={styles.fareBreakdownList}>
            <View style={styles.fareRow}>
              <Text style={styles.fareItemLabel}>Base Fare</Text>
              <Text style={styles.fareItemVal}>₹{baseFare}</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareItemLabel}>Taxes & Fees</Text>
              <Text style={styles.fareItemVal}>₹{taxes}</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareItemLabel}>Driver Allowance</Text>
              <Text style={styles.fareItemVal}>₹{driverAllowance}</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareItemLabel}>Extra Km Charge</Text>
              <Text style={styles.fareItemVal}>₹20.00/Km</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareItemLabel}>Extra Time Charge</Text>
              <Text style={styles.fareItemVal}>₹1.50/min</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareItemLabel}>Discount</Text>
              <Text style={[styles.fareItemVal, { color: '#10B981' }]}>₹0</Text>
            </View>
          </View>

          <View style={styles.dottedDivider} />

          {/* Advance & Final Remaining */}
          <View style={styles.fareRow}>
            <Text style={styles.advancePaidLabel}>Advance Paid</Text>
            <Text style={styles.advancePaidVal}>₹{advancePaid}</Text>
          </View>

          <View style={[styles.fareRow, { marginTop: 6, marginBottom: 14 }]}>
            <Text style={styles.finalPayoutLabel}>FINAL PAYOUT (REMAINING)</Text>
            <Text style={styles.finalPayoutVal}>₹{finalPayout}</Text>
          </View>

          {/* Notice pill */}
          <View style={styles.payNoticePill}>
            <Text style={styles.payNoticeText}>
              PAY NOW BUTTON AVAILABLE AFTER CAB AVAILABILITY SLOT
            </Text>
          </View>
        </View>

        {/* 7. RIDE TYPE & PAYMENT SUMMARY CARD */}
        <View style={styles.rideTypePaymentCard}>
          <View style={styles.rideTypeLeftCol}>
            <Tag size={16} color="#F59E0B" />
            <Text style={styles.rideTypeLabel}>
              Ride Type:{' '}
              <Text style={styles.rideTypeValue}>
                {rideType === 'ONEWAY' ? 'Oneway' : rideType}
              </Text>
            </Text>
          </View>

          <Text style={styles.paymentSummaryRight}>
            Payment:{' '}
            <Text style={styles.paymentMethodGreen}>
              {paymentMethod.toUpperCase()}
            </Text>
          </Text>
        </View>

        {/* 8. INCLUSIONS ACCORDION CARD */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.inclusionsHeader}
            onPress={() => setInclusionsExpanded(!inclusionsExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.inclusionsTitleRow}>
              <Check size={18} color="#10B981" strokeWidth={3} />
              <Text style={styles.inclusionsTitle}>INCLUSIONS</Text>
            </View>
            {inclusionsExpanded ? (
              <ChevronUp size={18} color="#64748B" />
            ) : (
              <ChevronDown size={18} color="#64748B" />
            )}
          </TouchableOpacity>

          {inclusionsExpanded && (
            <View style={styles.inclusionsBody}>
              <View style={styles.inclusionItemRow}>
                <View style={styles.inclusionGreenDot} />
                <Text style={styles.inclusionText}>
                  Dedicated Ride Captain support throughout the trip
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.inclusionGreenDot} />
                <Text style={styles.inclusionText}>
                  Verified drivers & vehicles for a secure journey
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.inclusionGreenDot} />
                <Text style={styles.inclusionText}>
                  Real-time support for safety and ride assistance
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.inclusionGreenDot} />
                <Text style={styles.inclusionText}>
                  Up to ₹25,000 compensation for missed flight/train (T&C apply)
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.inclusionGreenDot} />
                <Text style={styles.inclusionText}>
                  Intercity rides (4+ hrs prior): 100% advance refund + up to ₹300 credit if driver cancels
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.inclusionGreenDot} />
                <Text style={styles.inclusionText}>
                  Source and destination is same in case of rental booking. Dropping away from source will be chargeable if exceeding package.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 9. EXCLUSIONS ACCORDION CARD */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.inclusionsHeader}
            onPress={() => setExclusionsExpanded(!exclusionsExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.inclusionsTitleRow}>
              <AlertTriangle size={18} color="#F59E0B" strokeWidth={2.5} />
              <Text style={styles.inclusionsTitle}>EXCLUSIONS</Text>
            </View>
            {exclusionsExpanded ? (
              <ChevronUp size={18} color="#64748B" />
            ) : (
              <ChevronDown size={18} color="#64748B" />
            )}
          </TouchableOpacity>

          {exclusionsExpanded && (
            <View style={styles.inclusionsBody}>
              <View style={styles.inclusionItemRow}>
                <View style={styles.exclusionOrangeDot} />
                <Text style={styles.inclusionText}>
                  Toll charges (unless specified in package)
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.exclusionOrangeDot} />
                <Text style={styles.inclusionText}>
                  Parking fees and state entry taxes at border crossing
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.exclusionOrangeDot} />
                <Text style={styles.inclusionText}>
                  Waiting charges after 15 minutes of free waiting
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 10. RESTRICTIONS ACCORDION CARD */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.inclusionsHeader}
            onPress={() => setRestrictionsExpanded(!restrictionsExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.inclusionsTitleRow}>
              <Ban size={18} color="#EF4444" strokeWidth={2.5} />
              <Text style={styles.inclusionsTitle}>RESTRICTIONS</Text>
            </View>
            {restrictionsExpanded ? (
              <ChevronUp size={18} color="#64748B" />
            ) : (
              <ChevronDown size={18} color="#64748B" />
            )}
          </TouchableOpacity>

          {restrictionsExpanded && (
            <View style={styles.inclusionsBody}>
              <View style={styles.inclusionItemRow}>
                <View style={styles.restrictionRedDot} />
                <Text style={styles.inclusionText}>
                  No smoking or alcohol allowed inside the vehicle
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.restrictionRedDot} />
                <Text style={styles.inclusionText}>
                  No illegal items or hazardous luggage allowed
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.restrictionRedDot} />
                <Text style={styles.inclusionText}>
                  Maximum weight limit of luggage as specified per vehicle category
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 11. CANCELLATION POLICY ACCORDION CARD */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.inclusionsHeader}
            onPress={() => setCancellationExpanded(!cancellationExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.inclusionsTitleRow}>
              <Text style={{ fontSize: 16 }}>🗓️</Text>
              <Text style={styles.inclusionsTitle}>CANCELLATION POLICY</Text>
            </View>
            {cancellationExpanded ? (
              <ChevronUp size={18} color="#64748B" />
            ) : (
              <ChevronDown size={18} color="#64748B" />
            )}
          </TouchableOpacity>

          {cancellationExpanded && (
            <View style={styles.inclusionsBody}>
              <View style={styles.inclusionItemRow}>
                <View style={styles.cancellationBlueDot} />
                <Text style={styles.inclusionText}>
                  Free cancellation up to 4 hours before departure
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.cancellationBlueDot} />
                <Text style={styles.inclusionText}>
                  50% cancellation fee if cancelled between 2 to 4 hours before schedule
                </Text>
              </View>

              <View style={styles.inclusionItemRow}>
                <View style={styles.cancellationBlueDot} />
                <Text style={styles.inclusionText}>
                  No refund if cancelled less than 2 hours before schedule
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Dock: CANCEL RIDE & CONFIRM & BOOK */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelRideBtn}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelRideBtnText}>CANCEL RIDE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBookBtn}
          onPress={onConfirmRide}
          activeOpacity={0.85}
        >
          <Check size={18} color="#0F172A" strokeWidth={3} />
          <Text style={styles.confirmBookBtnText}>CONFIRM & BOOK</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.px_4,
    paddingTop: spacing.px_2,
    paddingBottom: spacing.px_3,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  rideIdText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 1,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F97316',
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#EA580C',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: spacing.px_4,
  },

  // 1. Map Card
  mapCard: {
    height: 190,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0B132B',
    marginBottom: spacing.px_4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  mapBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B132B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGridLine1: {
    position: 'absolute',
    width: '120%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ rotate: '25deg' }],
  },
  mapGridLine2: {
    position: 'absolute',
    width: '120%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ rotate: '-35deg' }],
  },
  mapGridLine3: {
    position: 'absolute',
    width: '120%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ rotate: '5deg' }],
  },
  routeCurveGlow: {
    position: 'absolute',
    width: 220,
    height: 70,
    borderBottomWidth: 3.5,
    borderBottomColor: '#10B981',
    borderRadius: 60,
    transform: [{ rotate: '-12deg' }],
  },
  carMarkerBox: {
    position: 'absolute',
    top: 95,
    left: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FACC15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  carMarkerEmoji: {
    fontSize: 12,
  },
  carMarkerText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#000000',
  },
  destMarkerBox: {
    position: 'absolute',
    top: 60,
    right: 50,
    alignItems: 'center',
  },
  destBadgePill: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  destBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  destOuterCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(225, 29, 72, 0.3)',
    borderWidth: 2,
    borderColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  routeInfoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  routeActiveLabel: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  routeDistanceText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    marginTop: 2,
  },
  fullScreenBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  fullScreenText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },

  // General Card Container
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: spacing.px_4,
    marginBottom: spacing.px_4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeaderGreen: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#059669',
    letterSpacing: 0.6,
    marginBottom: spacing.px_3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.px_3,
  },

  // 2. Pickup & Destination Timeline
  routeTimeline: {
    position: 'relative',
    marginVertical: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickupOuterRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pickupInnerRing: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  timelineDottedLine: {
    width: 2,
    height: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#CBD5E1',
    borderStyle: 'dotted',
    marginLeft: 8,
    marginVertical: 4,
  },
  dropoffOuterRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#F43F5E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropoffInnerRing: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F43F5E',
  },
  timelineTextCol: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  locationSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  dateTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginTop: spacing.px_3,
  },
  dateTimeText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },

  // 3. Schedule Switcher
  scheduleSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    padding: 4,
    marginBottom: spacing.px_4,
  },
  schedulePill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  schedulePillActive: {
    backgroundColor: '#0F172A',
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  scheduleTextActive: {
    color: '#FFFFFF',
  },

  // 4. Selected Vehicle
  acActiveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  acActiveText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#16A34A',
  },
  vehicleDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carEmoji: {
    fontSize: 26,
  },
  vehicleInfoCol: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  vehicleSub: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 1,
    marginBottom: 6,
  },
  specBadgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  specBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  specBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  vehiclePriceCol: {
    alignItems: 'flex-end',
  },
  vehiclePriceText: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  walletLabelText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  vehiclePickerContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  pickerTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginBottom: 4,
  },
  vehiclePickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  vehiclePickerOptionActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  vehiclePickerOptionName: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  vehiclePickerOptionPrice: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },

  // 5. Passenger Steppers
  noPetsBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  noPetsText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#DC2626',
  },
  steppersGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepperLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginBottom: 6,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  stepperBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  stepperIcon: {
    fontSize: 14,
  },

  // 6. Fare Details
  fareHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  estimateFareTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  estimateFareSub: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  estimateFareMainAmount: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  fareDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  fareBreakdownList: {
    gap: 8,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  fareItemVal: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  dottedDivider: {
    height: 1,
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  advancePaidLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  advancePaidVal: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  finalPayoutLabel: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  finalPayoutVal: {
    fontSize: 17,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#10B981',
  },
  payNoticePill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  payNoticeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // 7. Ride Type & Payment Summary
  rideTypePaymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: spacing.px_4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rideTypeLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rideTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  rideTypeValue: {
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  paymentSummaryRight: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  paymentMethodGreen: {
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#10B981',
  },

  // 8. Inclusions
  inclusionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inclusionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inclusionsTitle: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  inclusionsBody: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  inclusionItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  inclusionGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginTop: 6,
  },
  exclusionOrangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginTop: 6,
  },
  restrictionRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginTop: 6,
  },
  cancellationBlueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  inclusionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#334155',
    lineHeight: 18,
  },

  // Bottom Sticky Bar
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.px_4,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelRideBtn: {
    flex: 0.45,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelRideBtnText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  confirmBookBtn: {
    flex: 0.55,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#A8E63C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#A8E63C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBookBtnText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
    letterSpacing: 0.4,
  },
  changeVehicleBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  changeVehicleBtnText: {
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#059669',
    letterSpacing: 0.4,
  },

  // Step 1: SELECT RIDE Styles (Matching Exact Screenshots)
  selectRideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectRideHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  selectRideScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  selectRideHeroCard: {
    backgroundColor: '#0E1726',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectRideHeroTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#A3E635',
    letterSpacing: 0.5,
  },
  selectRideHeroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    marginTop: 2,
  },
  vehicleCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleCardSelected: {
    borderColor: '#0F172A',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 18,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  recommendedBadgeText: {
    color: '#000000',
    fontSize: 9.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleThumbBox: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vehicleInfoWrap: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  vehicleModelTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  vehicleCategorySub: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  starChar: {
    fontSize: 12,
  },
  starGold: {
    color: '#F59E0B',
  },
  starGray: {
    color: '#CBD5E1',
  },
  vehiclePriceBlock: {
    alignItems: 'flex-end',
  },
  startsAtSmallLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  priceRangeBold: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 1,
  },
  struckPrice: {
    fontSize: 10.5,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  specsBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 14,
  },
  specBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    gap: 4,
  },
  specBadgePillText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  fareBreakupLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareBreakupLinkText: {
    fontSize: 11.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#059669',
    letterSpacing: 0.3,
  },
  selectPillBtn: {
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 7.5,
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectPillBtnActive: {
    backgroundColor: '#0F172A',
  },
  selectPillBtnInactive: {
    backgroundColor: '#059669',
  },
  selectPillBtnTextActive: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  selectPillBtnTextInactive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  fareBreakupAccordion: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fareBreakupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fareBreakupRowLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  fareBreakupRowVal: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  stickyBottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  reviewRideCtaBtn: {
    backgroundColor: '#0F172A',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewRideCtaBtnText: {
    color: '#A3E635',
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
});
