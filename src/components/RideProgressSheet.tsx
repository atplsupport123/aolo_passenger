import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Phone,
  MessageSquare,
  X,
  Star,
  Menu,
  CloudSun,
  Check,
  CheckCircle2,
  Share2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Clock,
  Car,
  MapPin,
  Home,
  Calendar,
  Wallet,
  User,
} from 'lucide-react-native';
import { Driver, Ride } from '../types';
import BottomNavBar from './BottomNavBar';
import { brandColors, spacing, borderRadius } from '../theme';

import MapSimulator from './MapSimulator';

type TripStage = 'SEARCHING' | 'DRIVER_ASSIGNED' | 'RIDE_IN_PROGRESS' | 'TRIP_COMPLETE_PAY' | 'RATE_CAPTAIN';

interface RideProgressSheetProps {
  ride: Ride;
  driver: Driver | null;
  onOpenChat: () => void;
  onCancelRide: () => void;
  onCompleteRide: () => void;
}

export default function RideProgressSheet({
  ride,
  driver,
  onOpenChat,
  onCancelRide,
  onCompleteRide,
}: RideProgressSheetProps) {
  const insets = useSafeAreaInsets();

  // Dynamic trip lifecycle stages
  const [tripStage, setTripStage] = useState<TripStage>(
    ride.status === 'SEARCHING' ? 'SEARCHING' : 'DRIVER_ASSIGNED'
  );

  // Notification popup state (Image 3)
  const [activeNotification, setActiveNotification] = useState<'DRIVER_ARRIVED' | 'TRIP_STARTED' | null>(
    ride.status === 'SEARCHING' ? null : 'DRIVER_ARRIVED'
  );

  // In-ride metrics & simulation
  const [liveProgress, setLiveProgress] = useState(35);
  const [liveSpeed, setLiveSpeed] = useState(48);
  const [etaRemaining, setEtaRemaining] = useState('12 min');
  const [distanceRemaining, setDistanceRemaining] = useState('6.4 km');

  // Rating & Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Cash' | 'UPI' | 'Wallet'>('Cash');
  const [starRating, setStarRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Polite', 'Clean car', 'Safe driving', 'On time']);
  const [selectedTip, setSelectedTip] = useState<number>(10);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Fallback driver info matching screenshots
  const activeDriver: Driver = driver || {
    id: 'drv_rajesh',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.9,
    tripsCount: 1420,
    carModel: 'Maruti Dzire AC',
    carColor: 'Pearl White',
    carPlate: 'BR 01 PB 4892',
    lat: 25.5941,
    lng: 85.1376,
  };

  const pickupLocationName = ride.pickup?.name || 'Saharsa, Bihar';
  const dropoffLocationName = ride.dropoff?.name || 'Patna Junction Railway Station';
  const fareTotal = ride.fare ? Math.round(ride.fare) : 248;
  const otpCode = ride.otp || '9481';

  // Live in-ride simulation countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (tripStage === 'RIDE_IN_PROGRESS') {
      interval = setInterval(() => {
        setLiveProgress((prev) => {
          if (prev >= 95) {
            setEtaRemaining('1 min');
            setDistanceRemaining('0.3 km');
            return 95;
          }
          const next = prev + 5;
          const minsLeft = Math.max(1, Math.round(12 * (1 - next / 100)));
          const kmLeft = (6.4 * (1 - next / 100)).toFixed(1);
          setEtaRemaining(`${minsLeft} min`);
          setDistanceRemaining(`${kmLeft} km`);
          return next;
        });
        setLiveSpeed((prev) => 40 + Math.floor(Math.random() * 15));
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tripStage]);

  // Auto transition from SEARCHING to DRIVER_ASSIGNED after 2s if searching
  useEffect(() => {
    if (tripStage === 'SEARCHING') {
      const timer = setTimeout(() => {
        setTripStage('DRIVER_ASSIGNED');
        setActiveNotification('DRIVER_ARRIVED');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [tripStage]);

  // Handle Share Trip Link
  const handleShareTrip = async () => {
    try {
      await Share.share({
        message: `I'm riding with ${activeDriver.name} (${activeDriver.carPlate}) in AOLO Cab. Track my live journey to ${dropoffLocationName}: https://aolo.in/track/${ride.id || 'AOLO526646'}`,
      });
    } catch (error) {
      Alert.alert('Share Trip', `Live tracking link copied for ${dropoffLocationName}.`);
    }
  };

  // Toggle feedback tag chips
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const effectivePickup = ride.pickup || {
    id: 'loc_p_default',
    name: pickupLocationName,
    address: pickupLocationName,
    lat: 25.8824,
    lng: 86.5986,
  };

  const effectiveDropoff = ride.dropoff || {
    id: 'loc_d_default',
    name: dropoffLocationName,
    address: dropoffLocationName,
    lat: 25.6093,
    lng: 85.1376,
  };

  return (
    <View style={styles.container}>
      {/* ================= MAP BACKGROUND AREA ================= */}
      <View style={styles.mapArea}>
        {/* Real Ola SVG Map Simulator with Roads, Highways, Waterways & Live Vehicles */}
        <View style={StyleSheet.absoluteFill}>
          <MapSimulator
            pickup={effectivePickup}
            dropoff={effectiveDropoff}
            driver={activeDriver}
            rideStatus={
              tripStage === 'RIDE_IN_PROGRESS'
                ? 'PICKED_UP'
                : tripStage === 'DRIVER_ASSIGNED'
                  ? 'ACCEPTED'
                  : 'SEARCHING'
            }
          />
        </View>

        {/* Floating Top Controls Header */}
        <SafeAreaView edges={['top']} style={styles.floatingHeader}>
          {/* Hamburger Menu */}
          <TouchableOpacity style={styles.menuBtn} activeOpacity={0.8}>
            <Menu size={20} color="#0F172A" />
          </TouchableOpacity>

          {/* Weather Widget */}
          <TouchableOpacity style={styles.weatherPill} activeOpacity={0.8}>
            <CloudSun size={20} color="#84CC16" />
            <View style={styles.weatherCol}>
              <Text style={styles.weatherTemp}>25°</Text>
              <Text style={styles.weatherFeels}>FEELS 29°</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        {/* ================= LIVE TURN-BY-TURN NAVIGATION HUD (In-Progress) ================= */}
        {tripStage === 'RIDE_IN_PROGRESS' && (
          <View style={styles.navigationHudOverlay}>
            <View style={styles.navTurnIconCircle}>
              <Text style={{ fontSize: 16 }}>↱</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.navDistanceText}>In 350m</Text>
              <Text style={styles.navInstructionText} numberOfLines={1}>
                Continue straight towards {dropoffLocationName}
              </Text>
            </View>
            <View style={styles.navSpeedPill}>
              <Text style={styles.navSpeedVal}>{liveSpeed}</Text>
              <Text style={styles.navSpeedUnit}>KM/H</Text>
            </View>
          </View>
        )}

        {/* Floating Waypoint Destination Badge on Map */}
        <View style={styles.mapWaypointFloatingBadge}>
          <View style={styles.waypointOriginLine}>
            <View style={styles.waypointGreenDot} />
            <Text style={styles.waypointText} numberOfLines={1}>
              {pickupLocationName}
            </Text>
          </View>
          <View style={styles.waypointDottedLine} />
          <View style={styles.waypointDestLine}>
            <View style={styles.waypointRedDot} />
            <Text style={styles.waypointDestText} numberOfLines={1}>
              {dropoffLocationName}
            </Text>
          </View>
        </View>

        {/* Right Side Map Floating Utility Actions */}
        <View style={styles.mapFloatingActionsCol}>
          <TouchableOpacity
            style={styles.mapActionFab}
            onPress={() => Alert.alert('Recenter GPS', 'Map camera centered on live vehicle position.')}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16 }}>🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapActionFab}
            onPress={() => Alert.alert('Route Info', `Distance: ${distanceRemaining} • Remaining ETA: ${etaRemaining}`)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16 }}>🧭</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Notification Popups (Image 3) */}
        {activeNotification && (
          <View style={styles.floatingNotificationBanner}>
            <View style={styles.notificationHeaderRow}>
              <View style={styles.notificationTitleGroup}>
                <Text style={{ fontSize: 15 }}>⏰</Text>
                <Text style={{ fontSize: 15, marginLeft: 4 }}>
                  {activeNotification === 'DRIVER_ARRIVED' ? '🚖' : '🚀'}
                </Text>
                <Text style={styles.notificationTitleText}>
                  {activeNotification === 'DRIVER_ARRIVED'
                    ? 'DRIVER ARRIVED!'
                    : 'TRIP STARTED!'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setActiveNotification(null)}
                style={styles.notificationCloseBtn}
              >
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.notificationBodyText}>
              {activeNotification === 'DRIVER_ARRIVED'
                ? `${activeDriver.name} has arrived at your pickup location.`
                : `Your trip has started! Your driver is heading towards your destination: ${dropoffLocationName}.`}
            </Text>

            <View style={styles.notificationFooterRow}>
              <Text style={styles.notificationTimeText}>11:29 am</Text>
              <View style={styles.notificationActionBtns}>
                <TouchableOpacity
                  style={styles.notifDismissBtn}
                  onPress={() => setActiveNotification(null)}
                >
                  <Text style={styles.notifDismissBtnText}>DISMISS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.notifViewMapBtn}
                  onPress={() => setActiveNotification(null)}
                >
                  <Text style={styles.notifViewMapBtnText}>VIEW LIVE MAP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ================= BOTTOM SHEET CARD ================= */}
      <View
        style={[
          styles.bottomSheet,
          { paddingBottom: 72 + Math.max(insets.bottom, 12) },
        ]}
      >
        {/* Top Grab Handle */}
        <View style={styles.grabHandle} />

        {/* ================= STAGE 1: SEARCHING FOR CAB ================= */}
        {tripStage === 'SEARCHING' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScrollContent}
          >
            <View style={styles.radarWrapper}>
              <View style={styles.radarOuterRing}>
                <View style={styles.radarMiddleRing}>
                  <View style={styles.radarInnerCircle}>
                    <Text style={styles.radarTaxiEmoji}>🚗</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.findingTitle}>FINDING YOUR AOLO CAB...</Text>
            <Text style={styles.findingSubtitle}>
              We are searching for closest available taxi driver to Saharsa Junction.
            </Text>

            <View style={styles.infoGridRow}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>ESTIMATED PRICE</Text>
                <Text style={styles.estimatedPriceVal}>$209.00</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>CLASS SELECTED</Text>
                <Text style={styles.classSelectedVal}>AOLO MINI</Text>
              </View>
            </View>

            {/* Mint/Teal Courier & OTP Capsule matching screenshot */}
            <View style={styles.parcelCourierBadge}>
              <Text style={{ fontSize: 13 }}>📦</Text>
              <Text style={styles.parcelCourierText}>CITY PARCEL COURIER</Text>
              <Text style={styles.parcelCourierOtp}>OTP: {otpCode || '5540'}</Text>
            </View>

            <TouchableOpacity
              style={styles.cancelRequestBtn}
              onPress={onCancelRide}
              activeOpacity={0.8}
            >
              <X size={14} color="#64748B" strokeWidth={2.5} />
              <Text style={styles.cancelRequestText}>Cancel Request</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ================= STAGE 2: DRIVER ASSIGNED & OTP VERIFICATION (Image 1) ================= */}
        {tripStage === 'DRIVER_ASSIGNED' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 85 + Math.max(insets.bottom, 12) }}
          >
            {/* Driver Profile Row */}
            <View style={styles.driverProfileRow}>
              <View style={styles.driverAvatarBadge}>
                <Text style={styles.driverAvatarInitials}>RA</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.driverNameText}>{activeDriver.name}</Text>
                <View style={styles.driverRatingRow}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.driverRatingText}>
                    {activeDriver.rating} ★ ({activeDriver.tripsCount} trips)
                  </Text>
                </View>
                <Text style={styles.driverCarModelText}>
                  {activeDriver.carModel} • {activeDriver.carColor}
                </Text>
              </View>

              <View style={styles.plateNumberBadge}>
                <Text style={styles.plateNumberText}>{activeDriver.carPlate}</Text>
              </View>
            </View>

            {/* OTP Security Box */}
            <View style={styles.otpCardBox}>
              <Text style={styles.otpCardLabel}>
                SHARE OTP WITH CAPTAIN TO START RIDE
              </Text>
              <Text style={styles.otpCardCodeText}>
                {otpCode.split('').join(' ')}
              </Text>
            </View>

            {/* 3 Action Buttons: Call, Chat, Cancel */}
            <View style={styles.driverActionsRow}>
              <TouchableOpacity
                style={styles.actionBtnLight}
                onPress={() => Alert.alert('Calling Captain', `Dialing ${activeDriver.name} at ${activeDriver.phone}...`)}
                activeOpacity={0.8}
              >
                <Phone size={16} color="#0F172A" />
                <Text style={styles.actionBtnLightText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnLight}
                onPress={onOpenChat}
                activeOpacity={0.8}
              >
                <MessageSquare size={16} color="#0F172A" />
                <Text style={styles.actionBtnLightText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnCancel}
                onPress={onCancelRide}
                activeOpacity={0.8}
              >
                <X size={16} color="#EF4444" />
                <Text style={styles.actionBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Simulation CTA to Start Ride */}
            <TouchableOpacity
              style={styles.simulateRideStartBtn}
              onPress={() => {
                setTripStage('RIDE_IN_PROGRESS');
                setActiveNotification('TRIP_STARTED');
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.simulateRideStartBtnText}>START TRIP (SIMULATE) →</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ================= STAGE 3: RIDE IN PROGRESS (Image 2 - Step 1) ================= */}
        {tripStage === 'RIDE_IN_PROGRESS' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 85 + Math.max(insets.bottom, 12) }}
          >
            {/* Heading & ETA Subtitle */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.headingDestinationTitle}>
                Heading to {dropoffLocationName}
              </Text>
              <Text style={styles.arrivingEtaSubtitle}>
                Arriving in {etaRemaining} • {distanceRemaining}
              </Text>

              {/* Progress Bar Track */}
              <View style={styles.inRideProgressTrack}>
                <View
                  style={[
                    styles.inRideProgressFill,
                    { width: `${liveProgress}%` },
                  ]}
                />
              </View>
            </View>

            {/* Driver Summary Card */}
            <View style={styles.inRideDriverCard}>
              <View style={styles.driverAvatarSmall}>
                <Text style={styles.driverAvatarInitialsSmall}>RA</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.inRideDriverName}>{activeDriver.name}</Text>
                <Text style={styles.inRideDriverMeta}>
                  {activeDriver.rating} ★ • {activeDriver.carModel.replace('Maruti ', '')} • {activeDriver.carColor}
                </Text>
              </View>

              <View style={styles.plateNumberBadgeSmall}>
                <Text style={styles.plateNumberTextSmall}>{activeDriver.carPlate}</Text>
              </View>
            </View>

            {/* Actions: Share Trip, Chat, SOS */}
            <View style={styles.inRideActionsRow}>
              <TouchableOpacity
                style={styles.inRideActionBtn}
                onPress={handleShareTrip}
                activeOpacity={0.8}
              >
                <Share2 size={16} color="#0F172A" />
                <Text style={styles.inRideActionBtnText}>Share trip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inRideActionBtn}
                onPress={onOpenChat}
                activeOpacity={0.8}
              >
                <MessageSquare size={16} color="#0F172A" />
                <Text style={styles.inRideActionBtnText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inRideSosBtn}
                onPress={() => Alert.alert('🚨 Emergency SOS', 'Corporate security dispatch & emergency contacts notified with real-time GPS telemetry.')}
                activeOpacity={0.8}
              >
                <AlertTriangle size={16} color="#DC2626" />
                <Text style={styles.inRideSosBtnText}>SOS</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Fare Estimate & Simulate Finish */}
            <View style={styles.fareEstimateRow}>
              <Text style={styles.fareEstimateLabel}>Fare estimate</Text>
              <Text style={styles.fareEstimateValue}>₹{fareTotal} • Cash</Text>
            </View>

            <TouchableOpacity
              style={styles.simulateArrivalBtn}
              onPress={() => setTripStage('TRIP_COMPLETE_PAY')}
              activeOpacity={0.88}
            >
              <Text style={styles.simulateArrivalBtnText}>ARRIVE AT DESTINATION →</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ================= STAGE 4: TRIP COMPLETE & PAY (Image 2 - Step 2) ================= */}
        {tripStage === 'TRIP_COMPLETE_PAY' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 85 + Math.max(insets.bottom, 12) }}
          >
            {/* Top Arrived Green Banner */}
            <View style={styles.arrivedBannerCard}>
              <View style={styles.arrivedCheckmarkCircle}>
                <Check size={22} color="#10B981" strokeWidth={3} />
              </View>
              <Text style={styles.arrivedTitleText}>{"You've arrived"}</Text>
              <Text style={styles.arrivedSubtitleText}>
                {dropoffLocationName} • 24 min
              </Text>
            </View>

            {/* Detailed Fare Breakdown Card */}
            <View style={styles.receiptBreakdownCard}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Base fare</Text>
                <Text style={styles.receiptVal}>₹120</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Distance, 6.4 km</Text>
                <Text style={styles.receiptVal}>₹98</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Time</Text>
                <Text style={styles.receiptVal}>₹18</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Taxes</Text>
                <Text style={styles.receiptVal}>₹12</Text>
              </View>

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total</Text>
                <Text style={styles.receiptTotalVal}>₹{fareTotal}</Text>
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text style={styles.payWithSectionTitle}>Pay with</Text>
            <View style={styles.paymentMethodPillsRow}>
              {(['Cash', 'UPI', 'Wallet'] as const).map((method) => {
                const isSelected = selectedPaymentMethod === method;
                return (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.payMethodPill,
                      isSelected && styles.payMethodPillActive,
                    ]}
                    onPress={() => setSelectedPaymentMethod(method)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.payMethodPillText,
                        isSelected && styles.payMethodPillTextActive,
                      ]}
                    >
                      {method === 'Wallet' ? 'Wallet ₹250' : method}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pay CTA Button */}
            <TouchableOpacity
              style={styles.payMainCtaBtn}
              onPress={() => setTripStage('RATE_CAPTAIN')}
              activeOpacity={0.88}
            >
              <Text style={styles.payMainCtaBtnText}>Pay ₹{fareTotal}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ================= STAGE 5: RATE YOUR CAPTAIN (Image 2 - Step 3 & Image 3) ================= */}
        {tripStage === 'RATE_CAPTAIN' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 85 + Math.max(insets.bottom, 12) }}
          >
            {/* Top Captain Avatar */}
            <View style={styles.rateAvatarWrap}>
              <View style={styles.rateAvatarCircle}>
                <Text style={styles.rateAvatarInitials}>RA</Text>
              </View>
            </View>

            {/* Heading & Subtitle */}
            <Text style={styles.rateHeadingTitle}>
              How was your ride with {activeDriver.name.split(' ')[0]}?
            </Text>
            <Text style={styles.rateSubtitleText}>
              Your feedback helps keep rides safe
            </Text>

            {/* 5 Big Interactive Gold Stars */}
            <View style={styles.ratingStarsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setStarRating(star)}
                  activeOpacity={0.7}
                  style={styles.starTouchable}
                >
                  <Text
                    style={[
                      styles.bigStarIcon,
                      star <= starRating ? styles.starFilledGold : styles.starUnfilledGray,
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Feedback Tags */}
            <View style={styles.feedbackChipsRow}>
              {['Polite', 'Clean car', 'Safe driving', 'On time'].map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.feedbackChip,
                      isSelected && styles.feedbackChipActive,
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.feedbackChipText,
                        isSelected && styles.feedbackChipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add a Tip Row */}
            <Text style={styles.addTipTitle}>Add a tip</Text>
            <View style={styles.tipPillsRow}>
              {[0, 10, 20, 50].map((tipAmt) => {
                const isSelected = selectedTip === tipAmt;
                return (
                  <TouchableOpacity
                    key={tipAmt}
                    style={[
                      styles.tipPillBtn,
                      isSelected && styles.tipPillBtnActive,
                    ]}
                    onPress={() => setSelectedTip(tipAmt)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.tipPillBtnText,
                        isSelected && styles.tipPillBtnTextActive,
                      ]}
                    >
                      ₹{tipAmt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Optional Comment Input Box */}
            <TextInput
              style={styles.commentTextarea}
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              placeholder="Add a comment about your ride (optional)..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
            />

            {/* Bottom Actions: Skip & Submit */}
            <View style={styles.rateBottomBtnsRow}>
              <TouchableOpacity
                style={styles.rateSkipBtn}
                onPress={onCompleteRide}
                activeOpacity={0.8}
              >
                <Text style={styles.rateSkipBtnText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rateSubmitBtn}
                onPress={() => {
                  Alert.alert('Feedback Submitted', `Thank you for rating ${activeDriver.name}! Your tip of ₹${selectedTip} was added.`);
                  onCompleteRide();
                }}
                activeOpacity={0.88}
              >
                <Text style={styles.rateSubmitBtnText}>Submit & Finish</Text>
                <ChevronRight size={16} color="#A3E635" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Docked Bottom Navigation Bar matching screenshot */}
      <BottomNavBar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF4FA',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },

  // Navigation HUD & Waypoints Floating Badges
  navigationHudOverlay: {
    position: 'absolute',
    top: 76,
    left: 16,
    right: 16,
    backgroundColor: '#0E1726',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 50,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  navTurnIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDistanceText: {
    color: '#A3E635',
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  navInstructionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  navSpeedPill: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 42,
  },
  navSpeedVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  navSpeedUnit: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  mapWaypointFloatingBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 40,
  },
  waypointOriginLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waypointGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  waypointText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#475569',
    flex: 1,
  },
  waypointDottedLine: {
    width: 1.5,
    height: 6,
    backgroundColor: '#CBD5E1',
    marginLeft: 3.5,
    marginVertical: 1,
  },
  waypointDestLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waypointRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  waypointDestText: {
    fontSize: 11.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    flex: 1,
  },
  mapFloatingActionsCol: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    gap: 8,
    zIndex: 40,
  },
  mapActionFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapCanvas: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EBF4FA',
    overflow: 'hidden',
  },
  airportDistrictCone: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    bottom: '20%',
    backgroundColor: '#D7EBF8',
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
    opacity: 0.8,
  },
  airportDistrictLabel: {
    position: 'absolute',
    top: '28%',
    left: 24,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  sectorLineLeft: {
    position: 'absolute',
    top: 0,
    left: '14%',
    height: '80%',
    width: 1,
    borderLeftWidth: 1.5,
    borderLeftColor: '#CBD5E1',
    borderStyle: 'dashed',
    transform: [{ rotate: '15deg' }],
  },
  sectorLineRight: {
    position: 'absolute',
    top: 0,
    right: '14%',
    height: '80%',
    width: 1,
    borderLeftWidth: 1.5,
    borderLeftColor: '#CBD5E1',
    borderStyle: 'dashed',
    transform: [{ rotate: '-15deg' }],
  },
  taxiPin1: {
    position: 'absolute',
    top: '32%',
    right: '25%',
  },
  taxiPin2: {
    position: 'absolute',
    top: '48%',
    left: '42%',
  },
  taxiPinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  taxiPinEmoji: {
    fontSize: 14,
  },

  // Active Route Map View (Image 2 - Step 1)
  routeMapView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
  },
  routeCurveLine: {
    position: 'absolute',
    left: '18%',
    top: '18%',
    width: '65%',
    height: '60%',
    borderColor: '#2563EB',
    borderWidth: 4,
    borderRadius: 60,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  routeOriginDot: {
    position: 'absolute',
    left: '16%',
    bottom: '22%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  routeDestSquare: {
    position: 'absolute',
    right: '16%',
    top: '18%',
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destInnerWhite: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  routeCarMarker: {
    position: 'absolute',
    top: '38%',
  },
  routeCarMarkerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  rideStartedBadgePill: {
    position: 'absolute',
    top: '14%',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  greenPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  rideStartedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#065F46',
  },

  // Floating Header Controls
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.px_4,
    paddingTop: spacing.px_2,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  weatherCol: {
    alignItems: 'flex-start',
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  weatherFeels: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
  },

  // Floating Notification Popups (Image 3)
  floatingNotificationBanner: {
    position: 'absolute',
    top: 76,
    left: 16,
    right: 16,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  notificationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notificationTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTitleText: {
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#A3E635',
    marginLeft: 6,
    letterSpacing: 0.4,
  },
  notificationCloseBtn: {
    padding: 2,
  },
  notificationBodyText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#F1F5F9',
    lineHeight: 17,
    marginBottom: 10,
  },
  notificationFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTimeText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
  notificationActionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  notifDismissBtn: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  notifDismissBtnText: {
    color: '#CBD5E1',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  notifViewMapBtn: {
    backgroundColor: '#A3E635',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  notifViewMapBtnText: {
    color: '#070C1A',
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },

  // Bottom Sheet Core
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.px_5,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  grabHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetScrollContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },

  // Stage 1: Searching State
  radarWrapper: {
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarOuterRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  radarMiddleRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarInnerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#84CC16',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#84CC16',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  radarTaxiEmoji: {
    fontSize: 22,
  },
  findingTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
  findingSubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoGridRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  estimatedPriceVal: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#84CC16',
  },
  classSelectedVal: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  parcelCourierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
    marginTop: 2,
    marginBottom: 16,
  },
  parcelCourierText: {
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0D9488',
    letterSpacing: 0.5,
  },
  parcelCourierOtp: {
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0D9488',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  cancelRequestBtn: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cancelRequestText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 10.5,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  activeNavText: {
    color: '#65A30D',
    fontWeight: '800',
  },

  // Stage 2: Driver Assigned & OTP Verification (Image 1)
  driverProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  driverAvatarBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  driverNameText: {
    fontSize: 15.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: 2,
  },
  driverRatingText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  driverCarModelText: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  plateNumberBadge: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  plateNumberText: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  otpCardBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  otpCardLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  otpCardCodeText: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 6,
  },
  driverActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionBtnLight: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnLightText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  actionBtnCancel: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnCancelText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#EF4444',
  },
  simulateRideStartBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  simulateRideStartBtnText: {
    color: '#A3E635',
    fontSize: 12.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },

  // Stage 3: Ride In Progress (Image 2 - Step 1)
  headingDestinationTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  arrivingEtaSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  inRideProgressTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2.5,
    marginTop: 8,
  },
  inRideProgressFill: {
    height: 5,
    backgroundColor: '#84CC16',
    borderRadius: 2.5,
  },
  inRideDriverCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  driverAvatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarInitialsSmall: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  inRideDriverName: {
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  inRideDriverMeta: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto',
    marginTop: 1,
  },
  plateNumberBadgeSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  plateNumberTextSmall: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  inRideActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  inRideActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inRideActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  inRideSosBtn: {
    flex: 0.9,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inRideSosBtnText: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#DC2626',
  },
  fareEstimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 10,
  },
  fareEstimateLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  fareEstimateValue: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  simulateArrivalBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulateArrivalBtnText: {
    color: '#A3E635',
    fontSize: 12.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },

  // Stage 4: Trip Complete & Pay (Image 2 - Step 2)
  arrivedBannerCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  arrivedCheckmarkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  arrivedTitleText: {
    fontSize: 17,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#065F46',
  },
  arrivedSubtitleText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#047857',
    marginTop: 2,
  },
  receiptBreakdownCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  receiptVal: {
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingTop: 10,
    marginTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  receiptTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  payWithSectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  paymentMethodPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  payMethodPill: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payMethodPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  payMethodPillText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  payMethodPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  payMainCtaBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payMainCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },

  // Stage 5: Rate Your Captain (Image 2 - Step 3 & Image 3)
  rateAvatarWrap: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  rateAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateAvatarInitials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  rateHeadingTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    textAlign: 'center',
  },
  rateSubtitleText: {
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  starTouchable: {
    padding: 2,
  },
  bigStarIcon: {
    fontSize: 34,
  },
  starFilledGold: {
    color: '#F59E0B',
  },
  starUnfilledGray: {
    color: '#CBD5E1',
  },
  feedbackChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  feedbackChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedbackChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  feedbackChipText: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  feedbackChipTextActive: {
    color: '#FFFFFF',
  },
  addTipTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  tipPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipPillBtn: {
    width: 58,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipPillBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tipPillBtnText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  tipPillBtnTextActive: {
    color: '#A3E635',
    fontWeight: '900',
  },
  commentTextarea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 14,
  },
  rateBottomBtnsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rateSkipBtn: {
    flex: 0.4,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateSkipBtnText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  rateSubmitBtn: {
    flex: 0.6,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rateSubmitBtnText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
