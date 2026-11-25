import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Animated, Modal as RNModal, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Menu,
  Cloud,
  CloudSun,
  Navigation2,
  Repeat,
  ArrowLeftRight,
  Clock,
  Plane,
  Phone,
  Home,
  Calendar,
  Wallet,
  User,
  Briefcase,
  Search,
  Coffee,
  ChevronRight,
  Luggage,
  Package,
  MapPin,
  Sparkles,
  Check,
  Building,
  ArrowRight,
} from 'lucide-react-native';
import MapSimulator from '../components/MapSimulator';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Screen flex ratios: 52% map, 48% bottom sheet
const MAP_FLEX_RATIO = 52;
const SHEET_FLEX_RATIO = 48;

export type RideCategory = 'ONEWAY' | 'ROUNDTRIP' | 'RENTAL' | 'AIRPORT';
export type MainCategoryTab = 'DAILY' | 'OUTSTATION' | 'RENTALS' | 'PARCEL';
export type ActiveCategory = 'CITY' | 'OUTSTATION' | 'RENTAL' | 'AIRPORT' | 'PARCEL';

export interface RideCategoryConfig {
  primary: string;
  background: string;
  label: string;
}

export const RIDE_CATEGORY_CONFIG: Record<RideCategory, RideCategoryConfig> = {
  ONEWAY: {
    primary: '#84CC16',
    background: '#F4FBE8',
    label: 'ONE-WAY',
  },
  ROUNDTRIP: {
    primary: '#F97316',
    background: '#FFF1E6',
    label: 'ROUND',
  },
  RENTAL: {
    primary: '#EAB308',
    background: '#FEF9DB',
    label: 'RENTAL',
  },
  AIRPORT: {
    primary: '#3B82F6',
    background: '#E8F0FE',
    label: 'AIRPORT',
  },
};
import PickupDestinationFlow from '../components/PickupDestinationFlow';
import BookingSheet from '../components/BookingSheet';
import RideProgressSheet from '../components/RideProgressSheet';
import ChatDrawer from '../components/ChatDrawer';
import WalletSheet from '../components/WalletSheet';
import BottomNavBar from '../components/BottomNavBar';
import RideHistory from '../components/RideHistory';
import ProfileSheet from '../components/ProfileSheet';
import RentalBookingFlow from '../components/RentalBookingFlow';
import AirportBookingFlow from '../components/AirportBookingFlow';
import ParcelBookingFlow from '../components/ParcelBookingFlow';
import ChaiPaniBookingFlow from '../components/ChaiPaniBookingFlow';
import ChaiCupIcon from '../components/ChaiCupIcon';
import SidebarDrawer from '../components/SidebarDrawer';
import TravelModeScreen from '../components/TravelModeScreen';
import CorporateScreen from '../components/CorporateScreen';
import RoadTripsModal from '../components/RoadTripsModal';
import OffersModal from '../components/OffersModal';
import ReferralModal from '../components/ReferralModal';
import SavedPlacesModal from '../components/SavedPlacesModal';
import TripPoliciesModal from '../components/TripPoliciesModal';
import RideScheduleModal from '../components/RideScheduleModal';
import FavouriteDriversModal from '../components/FavouriteDriversModal';
import SafetyCenterModal from '../components/SafetyCenterModal';
import WhatsNewModal from '../components/WhatsNewModal';
import SupportModal from '../components/SupportModal';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../components/TermsOfServiceModal';
import LanguageModal from '../components/LanguageModal';
import WeatherModal from '../components/WeatherModal';
import OffersSlider from '../components/OffersSlider';

import { brandColors, spacing, borderRadius } from '../theme';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Location, VehicleClass, Ride, Driver, ChatMessage, ParcelOrder } from '../types';
import { openCorporatePortalInNewTab } from '../utils/corporatePortal';

interface ModalProps {
  visible?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
}

function Modal({ visible, animationType, transparent, onRequestClose, children }: ModalProps) {
  if (!visible) return null;

  if (Platform.OS === 'web') {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: transparent ? 'transparent' : brandColors.aoloBlack,
        }}
      >
        {children}
      </View>
    );
  }

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onRequestClose}
    >
      {children}
    </RNModal>
  );
}

const POPULAR_LOCATIONS: Location[] = [
  { id: 'loc_1', name: 'Stadium Road, Saharsa', address: 'Stadium Road, Ward 10, Saharsa, Bihar 852201', lat: 25.8824, lng: 86.5986 },
  { id: 'loc_2', name: 'Patna Junction Railway Station', address: 'Station Road, Fraser Road Area, Patna, Bihar 800001', lat: 25.6093, lng: 85.1376 },
  { id: 'loc_3', name: 'Jay Prakash Narayan Airport, Patna', address: 'Shaheed Pir Ali Khan Marg, Patna, Bihar 800014', lat: 25.5913, lng: 85.0880 },
];

const VEHICLE_CLASSES: VehicleClass[] = [
  { id: 'veh_1', name: 'AOLO Compact', description: 'Swift / WagonR AC • 4 Seats • 1 Bag', basePrice: 1276, multiplier: 1.0, capacity: 4, eta: 4, icon: 'car' },
  { id: 'veh_2', name: 'AOLO Sedan', description: 'Dzire / Etios AC • 4 Seats • 2 Bags', basePrice: 1559, multiplier: 1.22, capacity: 4, eta: 3, icon: 'car' },
];

const MOCK_DRIVER: Driver = {
  id: 'drv_101',
  name: 'Rajesh Kumar',
  phone: '+91 98123 45678',
  avatar: '',
  rating: 4.9,
  tripsCount: 1420,
  carModel: 'Maruti Dzire AC',
  carColor: 'Pearl White',
  carPlate: 'BR 01 PB 4892',
  lat: 25.8824,
  lng: 86.5986,
};

const RENTAL_PACKAGES = [
  { id: 'pkg_1', label: '1 hr', sub: '10 km', hours: 1, kms: 10, fare: 299 },
  { id: 'pkg_2', label: '2 hr', sub: '20 km', hours: 2, kms: 20, fare: 499 },
  { id: 'pkg_3', label: '3 hr', sub: '30 km', hours: 3, kms: 30, fare: 699 },
  { id: 'pkg_4', label: '4 hr', sub: '40 km', hours: 4, kms: 40, fare: 899 },
  { id: 'pkg_6', label: '6 hr', sub: '60 km', hours: 6, kms: 60, fare: 1299 },
  { id: 'pkg_8', label: '8 hr', sub: '80 km', hours: 8, kms: 80, fare: 1699 },
];

export default function HomeScreen() {
  const { currentSheet, setCurrentSheet, activeTab, setActiveTab, drawerOpen, setDrawerOpen } = useUIStore();
  const { userProfile, setUserProfile, logout } = useAuthStore();
  const { t } = useLanguageStore();

  const handleCloseSection = () => {
    setCurrentSheet('NONE');
    setDrawerOpen(true);
  };

  const handleOpenCorporate = () => {
    if (openCorporatePortalInNewTab()) return;
    setActiveTab('corporate');
  };

  const [modeToggle, setModeToggle] = useState<'RIDE' | 'TRAVEL'>('RIDE');
  const [selectedMode, setSelectedMode] = useState<RideCategory>('ONEWAY');
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('CITY');
  const [selectedParcelType, setSelectedParcelType] = useState<'bike' | 'auto' | 'cab'>('bike');

  const [pickup, setPickup] = useState<Location | null>(POPULAR_LOCATIONS[0]);
  const [dropoff, setDropoff] = useState<Location | null>(POPULAR_LOCATIONS[1]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleClass>(VEHICLE_CLASSES[0]);
  const [paymentMethod, setPaymentMethod] = useState('Wallet (₹250)');
  const [rideType, setRideType] = useState<'ONEWAY' | 'ROUNDTRIP'>('ONEWAY');
  const [addInsurance, setAddInsurance] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [rideHistoryList, setRideHistoryList] = useState<Ride[]>([]);

  // Main 4 Category Tabs from User Screenshot: Daily | Outstation | Rentals | Parcel
  const [mainCategoryTab, setMainCategoryTab] = useState<MainCategoryTab>('DAILY');
  const [selectedRentalPkg, setSelectedRentalPkg] = useState({
    id: 'pkg_1',
    label: '1 hr',
    sub: '10 km',
    hours: 1,
    kms: 10,
    fare: 299,
  });
  const [parcelList, setParcelList] = useState<ParcelOrder[]>([]);
  const [historyInitialTab, setHistoryInitialTab] = useState<'Rides' | 'Parcel'>('Rides');

  const handleSelectCategoryTab = (tab: MainCategoryTab) => {
    setMainCategoryTab(tab);
    if (tab === 'PARCEL') {
      setCurrentSheet('PARCEL');
    }
  };

  const handleWorkPress = () => {
    const workLoc = userProfile?.workLocation || {
      id: 'sp_work',
      name: 'Work / Office',
      address: 'Boring Road, Patna, Bihar 800001',
      lat: 25.6133,
      lng: 85.1200,
    };
    setDropoff(workLoc);
    setRideType('ONEWAY');
    setCurrentSheet('BOOKING');
  };

  const handleChaiPaniPress = () => {
    setCurrentSheet('CHAI_PANI');
  };

  const handleBookRentalPackage = () => {
    setCurrentSheet('RENTAL');
  };

  const handleConfirmBooking = () => {
    if (!pickup || !dropoff) return;

    const newRide: Ride = {
      id: 'ride_' + Math.random().toString(36).substring(2, 9),
      userId: userProfile?.uid || 'user_1',
      userName: userProfile?.name || 'Passenger',
      pickup,
      dropoff,
      vehicleClass: selectedVehicle.name || 'AOLO MINI',
      fare: 209,
      paymentMethod,
      status: 'SEARCHING',
      driverId: null,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      otp: '5540',
    };

    setActiveRide(newRide);
    setCurrentSheet('RIDE_PROGRESS');

    setTimeout(() => {
      setAssignedDriver(MOCK_DRIVER);
      setActiveRide((prev) => (prev ? { ...prev, status: 'ACCEPTED', driverId: MOCK_DRIVER.id } : null));

      setChatMessages([
        {
          id: 'msg_1',
          rideId: newRide.id,
          sender: 'driver',
          text: `Namaste ${userProfile?.name}! I have accepted your booking in ${MOCK_DRIVER.carModel}. Heading to pickup.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 7000);
  };

  const handleSendMessage = (text: string) => {
    if (!activeRide) return;
    const msg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      rideId: activeRide.id,
      sender: 'passenger',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleQuickTabPress = (tab: RideCategory) => {
    setSelectedMode(tab);
    if (tab === 'RENTAL') {
      setCurrentSheet('RENTAL');
    } else if (tab === 'AIRPORT') {
      setCurrentSheet('AIRPORT');
    } else {
      setRideType(tab === 'ROUNDTRIP' ? 'ROUNDTRIP' : 'ONEWAY');
      setCurrentSheet('PICKUP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Bottom Layer: Map Simulator Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <MapSimulator
          pickup={pickup}
          dropoff={dropoff}
          driver={assignedDriver}
          rideStatus={activeRide?.status || 'IDLE'}
        />
      </View>

      {/* Upper Area: Clean Light Map with Floating Header Controls */}
      <View style={styles.mapArea} pointerEvents="box-none">
        {/* Floating Top Controls Overlay */}
        <View style={styles.floatingHeader}>
          {/* Top Left: Rounded Square Hamburger Menu */}
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.8}
          >
            <Menu size={22} color="#0F172A" />
          </TouchableOpacity>

          {/* Top Right: Weather Widget Capsule matching screenshot */}
          <TouchableOpacity
            style={styles.weatherWidget}
            activeOpacity={0.8}
            onPress={() => setCurrentSheet('WEATHER')}
          >
            <CloudSun size={24} color="#84CC16" strokeWidth={2.2} />
            <View style={styles.weatherTextCol}>
              <Text style={styles.weatherTemp}>31°</Text>
              <Text style={styles.weatherFeels}>FEELS 34°</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Floating Centered Black Capsule: RESUME BOOKING FLOW */}
        <View style={styles.resumeBookingWrap} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.resumeBookingBtn}
            onPress={() => setCurrentSheet('BOOKING')}
            activeOpacity={0.85}
          >
            <View style={styles.resumeGreenDot} />
            <Text style={styles.resumeBookingText}>RESUME BOOKING FLOW</Text>
            <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        {activeCategory !== 'PARCEL' && (
          <TouchableOpacity
            style={[styles.searchDestinationBtn, styles.searchDestinationMapBtn]}
            onPress={() => setCurrentSheet('PICKUP')}
            activeOpacity={0.85}
          >
            <Search size={22} color="#00D25B" strokeWidth={2.8} />
            <Text style={styles.searchDestinationText}>Search Destination</Text>
          </TouchableOpacity>
        )}

        {/* Active Ride Banner if ride is in progress */}
        {activeRide && currentSheet === 'NONE' && (
          <TouchableOpacity
            style={styles.activeRideBar}
            onPress={() => setCurrentSheet('RIDE_PROGRESS')}
          >
            <Text style={styles.activeRideBarText}>
              {activeRide.status === 'SEARCHING' && '🔍 Searching for nearby captains...'}
              {activeRide.status === 'ACCEPTED' && '🚗 Captain assigned! Tap to view details.'}
              {activeRide.status === 'ARRIVING' && '⌛ Captain arriving. Share OTP.'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Area: White Bottom Sheet */}
      <View style={styles.sheetContainer}>
        {/* Top Grab Handle */}
        <View style={styles.sheetHandle} />

        {/* Scrollable sheet content */}
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetScrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Mode Toggle: RIDE MODE (active) | TRAVEL MODE */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity
              style={[
                styles.modeTogglePill,
                modeToggle === 'RIDE' && styles.activeModePill,
              ]}
              onPress={() => setModeToggle('RIDE')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.modeToggleText,
                  modeToggle === 'RIDE' && styles.activeModeText,
                ]}
              >
                RIDE MODE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeTogglePill,
                modeToggle === 'TRAVEL' && styles.activeModePill,
              ]}
              onPress={() => {
                setModeToggle('TRAVEL');
                setCurrentSheet('TRAVEL_MODE');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.modeToggleText,
                  modeToggle === 'TRAVEL' && styles.activeModeText,
                ]}
              >
                TRAVEL MODE
              </Text>
            </TouchableOpacity>
          </View>

          {/* 5 Service Category Tabs matching screenshot: CITY, OUTSTATION, RENTAL, AIRPORT, PARCEL */}
          <View style={styles.fiveCategoriesRow}>
            {/* CITY */}
            <TouchableOpacity
              style={[
                styles.fiveCategoryItem,
                activeCategory === 'CITY' && styles.fiveCategoryItemActive,
              ]}
              onPress={() => {
                setActiveCategory('CITY');
                setRideType('ONEWAY');
                setCurrentSheet('PICKUP');
              }}
              // @ts-ignore
              onMouseEnter={() => {
                setActiveCategory('CITY');
              }}
              // @ts-ignore
              onHoverIn={() => {
                setActiveCategory('CITY');
              }}
              activeOpacity={0.8}
            >
              <Building
                size={23}
                color={activeCategory === 'CITY' ? '#3F6212' : '#64748B'}
                strokeWidth={activeCategory === 'CITY' ? 2.8 : 1.8}
              />
              <Text
                style={[
                  styles.fiveCategoryLabel,
                  activeCategory === 'CITY' && styles.fiveCategoryLabelActive,
                ]}
              >
                CITY
              </Text>
            </TouchableOpacity>

            {/* OUTSTATION */}
            <TouchableOpacity
              style={[
                styles.fiveCategoryItem,
                activeCategory === 'OUTSTATION' && styles.fiveCategoryItemActive,
              ]}
              onPress={() => {
                setActiveCategory('OUTSTATION');
                setRideType('ROUNDTRIP');
                setDropoff(null);
                setCurrentSheet('PICKUP');
              }}
              // @ts-ignore
              onMouseEnter={() => {
                setActiveCategory('OUTSTATION');
              }}
              // @ts-ignore
              onHoverIn={() => {
                setActiveCategory('OUTSTATION');
              }}
              activeOpacity={0.8}
            >
              <ArrowLeftRight
                size={21}
                color={activeCategory === 'OUTSTATION' ? '#3F6212' : '#64748B'}
                strokeWidth={activeCategory === 'OUTSTATION' ? 2.8 : 1.8}
              />
              <Text
                style={[
                  styles.fiveCategoryLabel,
                  activeCategory === 'OUTSTATION' && styles.fiveCategoryLabelActive,
                ]}
              >
                OUTSTATION
              </Text>
            </TouchableOpacity>

            {/* RENTAL */}
            <TouchableOpacity
              style={[
                styles.fiveCategoryItem,
                activeCategory === 'RENTAL' && styles.fiveCategoryItemActive,
              ]}
              onPress={() => {
                setActiveCategory('RENTAL');
                setCurrentSheet('RENTAL');
              }}
              // @ts-ignore
              onMouseEnter={() => {
                setActiveCategory('RENTAL');
              }}
              // @ts-ignore
              onHoverIn={() => {
                setActiveCategory('RENTAL');
              }}
              activeOpacity={0.8}
            >
              <Clock
                size={21}
                color={activeCategory === 'RENTAL' ? '#3F6212' : '#64748B'}
                strokeWidth={activeCategory === 'RENTAL' ? 2.8 : 1.8}
              />
              <Text
                style={[
                  styles.fiveCategoryLabel,
                  activeCategory === 'RENTAL' && styles.fiveCategoryLabelActive,
                ]}
              >
                RENTAL
              </Text>
            </TouchableOpacity>

            {/* AIRPORT */}
            <TouchableOpacity
              style={[
                styles.fiveCategoryItem,
                activeCategory === 'AIRPORT' && styles.fiveCategoryItemActive,
              ]}
              onPress={() => {
                setActiveCategory('AIRPORT');
                setCurrentSheet('AIRPORT');
              }}
              // @ts-ignore
              onMouseEnter={() => {
                setActiveCategory('AIRPORT');
              }}
              // @ts-ignore
              onHoverIn={() => {
                setActiveCategory('AIRPORT');
              }}
              activeOpacity={0.8}
            >
              <Plane
                size={21}
                color={activeCategory === 'AIRPORT' ? '#3F6212' : '#64748B'}
                strokeWidth={activeCategory === 'AIRPORT' ? 2.8 : 1.8}
              />
              <Text
                style={[
                  styles.fiveCategoryLabel,
                  activeCategory === 'AIRPORT' && styles.fiveCategoryLabelActive,
                ]}
              >
                AIRPORT
              </Text>
            </TouchableOpacity>

            {/* PARCEL */}
            <TouchableOpacity
              style={[
                styles.fiveCategoryItem,
                activeCategory === 'PARCEL' && styles.fiveCategoryItemActive,
              ]}
              onPress={() => {
                setActiveCategory('PARCEL');
              }}
              // @ts-ignore
              onMouseEnter={() => {
                setActiveCategory('PARCEL');
              }}
              // @ts-ignore
              onHoverIn={() => {
                setActiveCategory('PARCEL');
              }}
              activeOpacity={0.8}
            >
              <Package
                size={21}
                color={activeCategory === 'PARCEL' ? '#3F6212' : '#64748B'}
                strokeWidth={activeCategory === 'PARCEL' ? 2.8 : 1.8}
              />
              <Text
                style={[
                  styles.fiveCategoryLabel,
                  activeCategory === 'PARCEL' && styles.fiveCategoryLabelActive,
                ]}
              >
                PARCEL
              </Text>
            </TouchableOpacity>
          </View>

          {activeCategory === 'PARCEL' ? (
            /* PARCEL DELIVERY MODE Card matching screenshot */
            <View style={styles.parcelDeliveryCard}>
              {/* Header: Icon, Titles & 4-Digit PIN Badge */}
              <View style={styles.parcelCardHeader}>
                <View style={styles.parcelIconContainer}>
                  <Text style={styles.parcelEmojiIcon}>📦</Text>
                </View>
                <View style={styles.parcelTitleCol}>
                  <Text style={styles.parcelCardTitle}>PARCEL DELIVERY{'\n'}MODE</Text>
                  <Text style={styles.parcelCardSubtitle}>
                    City courier for documents, food, medicines & boxes
                  </Text>
                </View>
                <View style={styles.parcelPinBadge}>
                  <Text style={styles.parcelPinBadgeText}>4-Digit{'\n'}PIN</Text>
                </View>
              </View>

              {/* 3 Courier Option Cards */}
              <View style={styles.parcelOptionsRow}>
                {/* 1: Bike Courier */}
                <TouchableOpacity
                  style={[
                    styles.parcelOptionBox,
                    selectedParcelType === 'bike' && styles.parcelOptionBoxActive,
                  ]}
                  onPress={() => setSelectedParcelType('bike')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.parcelOptionEmoji}>🛵</Text>
                  <Text style={styles.parcelOptionName}>Bike Courier</Text>
                  <Text style={styles.parcelOptionMeta}>12-15 mins</Text>
                </TouchableOpacity>

                {/* 2: Auto Parcel */}
                <TouchableOpacity
                  style={[
                    styles.parcelOptionBox,
                    selectedParcelType === 'auto' && styles.parcelOptionBoxActive,
                  ]}
                  onPress={() => setSelectedParcelType('auto')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.parcelOptionEmoji}>🛺</Text>
                  <Text style={styles.parcelOptionName}>Auto Parcel</Text>
                  <Text style={styles.parcelOptionMeta}>Eco Saver</Text>
                </TouchableOpacity>

                {/* 3: Cab Trunk */}
                <TouchableOpacity
                  style={[
                    styles.parcelOptionBox,
                    selectedParcelType === 'cab' && styles.parcelOptionBoxActive,
                  ]}
                  onPress={() => setSelectedParcelType('cab')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.parcelOptionEmoji}>🚗</Text>
                  <Text style={styles.parcelOptionName}>Cab Trunk</Text>
                  <Text style={styles.parcelOptionMeta}>All-weather</Text>
                </TouchableOpacity>
              </View>

              {/* Action Button: OPEN PARCEL DELIVERY BOOKING -> */}
              <TouchableOpacity
                style={styles.openParcelBtn}
                onPress={() => setCurrentSheet('PARCEL')}
                activeOpacity={0.85}
              >
                <Package size={18} color="#000000" strokeWidth={2.4} />
                <Text style={styles.openParcelBtnText}>OPEN PARCEL DELIVERY BOOKING</Text>
                <ArrowRight size={18} color="#000000" strokeWidth={2.6} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Card 1: Chai Pani Mode Card matching screenshot */}
              <TouchableOpacity
                style={styles.chaiPaniCard}
                onPress={handleChaiPaniPress}
                activeOpacity={0.85}
              >
                <View style={styles.chaiPaniIconBox}>
                  <ChaiCupIcon size={32} />
                </View>
                <View style={styles.chaiPaniContentCol}>
                  <View style={styles.chaiPaniTitleRow}>
                    <ChaiCupIcon size={16} />
                    <Text style={styles.chaiPaniTitle}>Chai Pani Mode</Text>
                    <View style={styles.flexibleRideBadge}>
                      <Text style={styles.flexibleRideBadgeText}>FLEXIBLE RIDE</Text>
                    </View>
                  </View>
                  <Text style={styles.chaiPaniSubtitle}>
                    Flexible city ride for tea & hangouts • No fixed destination needed
                  </Text>
                </View>
                <View style={styles.chaiPaniArrowCircle}>
                  <ChevronRight size={18} color="#334155" strokeWidth={2.4} />
                </View>
              </TouchableOpacity>

              {/* Card 2: OFFERS Card matching screenshot */}
              <TouchableOpacity
                style={styles.offersPromoCard}
                onPress={() => setCurrentSheet('OFFERS')}
                activeOpacity={0.85}
              >
                <View style={styles.offersTag}>
                  <Text style={styles.offersTagText}>OFFERS</Text>
                </View>
                <Text style={styles.offersPromoTitle}>Up to 20% off</Text>
                <Text style={styles.offersPromoSubtitle}>on all cab bookings*</Text>
              </TouchableOpacity>

            </>
          )}
        </ScrollView>
      </View>

      {/* Floating iPhone-Style Oval Bottom Navigation Bar */}
      <BottomNavBar />

      {/* All Modal Sheets */}
      <Modal visible={currentSheet === 'PICKUP'} animationType="slide" onRequestClose={handleCloseSection}>
        <PickupDestinationFlow
          pickup={pickup}
          dropoff={dropoff}
          onSelectPickup={setPickup}
          onSelectDropoff={setDropoff}
          onConfirmLocations={() => setCurrentSheet('BOOKING')}
          onClose={handleCloseSection}
          rideType={rideType}
          setRideType={setRideType}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          flowMode={activeCategory === 'OUTSTATION' ? 'OUTSTATION' : 'CITY'}
        />
      </Modal>

      <Modal visible={currentSheet === 'BOOKING'} animationType="slide" onRequestClose={() => setCurrentSheet('PICKUP')}>
        {pickup && dropoff && (
          <BookingSheet
            pickup={pickup}
            dropoff={dropoff}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={setSelectedVehicle}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onConfirmRide={handleConfirmBooking}
            onCancel={() => setCurrentSheet('PICKUP')}
            rideType={rideType}
            addInsurance={addInsurance}
            setAddInsurance={setAddInsurance}
          />
        )}
      </Modal>

      <Modal visible={currentSheet === 'RIDE_PROGRESS'} animationType="slide">
        {activeRide && (
          <RideProgressSheet
            ride={activeRide}
            driver={assignedDriver}
            onOpenChat={() => setCurrentSheet('CHAT')}
            onCancelRide={() => {
              setActiveRide(null);
              handleCloseSection();
            }}
            onCompleteRide={() => {
              if (activeRide) {
                setRideHistoryList((prev) => [{ ...activeRide, status: 'COMPLETED' }, ...prev]);
              }
              setActiveRide(null);
              handleCloseSection();
            }}
          />
        )}
      </Modal>

      <Modal visible={currentSheet === 'CHAT'} animationType="slide" onRequestClose={() => setCurrentSheet('RIDE_PROGRESS')}>
        <ChatDrawer
          driver={assignedDriver}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setCurrentSheet('RIDE_PROGRESS')}
        />
      </Modal>

      {/* Wallet Screen Overlay (stops above bottom tab bar) */}
      {currentSheet === 'WALLET' && (
        <WalletSheet
          balance={userProfile?.walletBalance || 250}
          onAddMoney={(amt) =>
            setUserProfile((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance + amt } : null))
          }
          onClose={handleCloseSection}
        />
      )}

      <Modal visible={currentSheet === 'HISTORY'} animationType="slide" onRequestClose={handleCloseSection}>
        <RideHistory
          rides={rideHistoryList}
          parcels={parcelList}
          initialTab={historyInitialTab}
          onClose={handleCloseSection}
          onBookRide={() => {
            setModeToggle('RIDE');
            setActiveTab('home');
            setCurrentSheet('PICKUP');
          }}
          onUpcomingRides={() => setCurrentSheet('SCHEDULE')}
          onScheduleRide={() => {
            setModeToggle('RIDE');
            setActiveTab('home');
            setCurrentSheet('PICKUP');
          }}
          onBookParcel={() => setCurrentSheet('PARCEL')}
          onRebook={(ride) => {
            setPickup(ride.pickup);
            setDropoff(ride.dropoff);
            setCurrentSheet('BOOKING');
          }}
        />
      </Modal>

      <Modal visible={currentSheet === 'PARCEL'} animationType="slide" onRequestClose={handleCloseSection}>
        <ParcelBookingFlow
          onClose={handleCloseSection}
          onOpenHistory={() => {
            setHistoryInitialTab('Parcel');
            setCurrentSheet('HISTORY');
          }}
          onConfirmParcel={(newParcel) => {
            setParcelList((prev) => [newParcel, ...prev]);
            const searchingRide: Ride = {
              id: newParcel.id,
              userId: userProfile?.uid || 'user_1',
              userName: userProfile?.name || 'Passenger',
              pickup: { id: 'p_1', name: 'Saharsa Junction', address: newParcel.senderAddress, lat: 25.8824, lng: 86.5986 },
              dropoff: { id: 'p_2', name: 'Terminal 2, Airport Bypass Rd', address: newParcel.recipientAddress, lat: 25.5913, lng: 85.0880 },
              vehicleClass: 'AOLO MINI',
              fare: 209,
              paymentMethod: 'AOLO Wallet',
              status: 'SEARCHING',
              driverId: null,
              createdAt: newParcel.createdAt,
              otp: '5540',
            };
            setActiveRide(searchingRide);
            setCurrentSheet('RIDE_PROGRESS');
          }}
        />
      </Modal>

      <Modal visible={currentSheet === 'PROFILE'} animationType="slide" onRequestClose={handleCloseSection}>
        <ProfileSheet
          userProfile={userProfile}
          onUpdateProfile={(updated) =>
            setUserProfile((prev) => (prev ? { ...prev, ...updated } : null))
          }
          onClose={handleCloseSection}
        />
      </Modal>

      <Modal visible={currentSheet === 'RENTAL'} animationType="slide" onRequestClose={handleCloseSection}>
        <RentalBookingFlow
          onClose={handleCloseSection}
          onConfirmRental={() => setCurrentSheet('BOOKING')}
        />
      </Modal>

      <Modal visible={currentSheet === 'CHAI_PANI'} animationType="slide" onRequestClose={handleCloseSection}>
        <ChaiPaniBookingFlow
          onClose={handleCloseSection}
          pickupLocation={pickup || undefined}
          walletBalance={userProfile?.walletBalance || 150}
          onNavTabPress={(tab) => {
            if (tab === 'home') {
              setActiveTab('home');
              handleCloseSection();
            } else if (tab === 'bookings') {
              setCurrentSheet('HISTORY');
            } else if (tab === 'wallet') {
              setCurrentSheet('WALLET');
            } else if (tab === 'account') {
              setCurrentSheet('PROFILE');
            }
          }}
          onConfirmBooking={({ package: pkg, paymentMethod: pMethod, pickup: pLoc, dropoff: dLoc }) => {
            const chaiPaniRide: Ride = {
              id: 'ride_' + Math.random().toString(36).substring(2, 9),
              userId: userProfile?.uid || 'user_1',
              userName: userProfile?.name || 'Passenger',
              pickup: pLoc,
              dropoff: dLoc,
              vehicleClass: pkg.name,
              fare: pkg.basePrice,
              paymentMethod: pMethod,
              status: 'SEARCHING',
              driverId: null,
              createdAt: new Date().toISOString(),
              rideType: 'CHAI_PANI',
              otp: Math.floor(1000 + Math.random() * 9000).toString(),
            };
            setActiveRide(chaiPaniRide);
            setCurrentSheet('RIDE_PROGRESS');
          }}
        />
      </Modal>

      <Modal visible={currentSheet === 'AIRPORT'} animationType="slide" onRequestClose={handleCloseSection}>
        <AirportBookingFlow
          onClose={handleCloseSection}
          onConfirmAirportRide={() => setCurrentSheet('BOOKING')}
        />
      </Modal>

      <Modal
        visible={currentSheet === 'ROAD_TRIPS'}
        animationType="slide"
        onRequestClose={handleCloseSection}
      >
        <RoadTripsModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'OFFERS'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <OffersModal onClose={handleCloseSection} />
      </Modal>


      <Modal
        visible={currentSheet === 'REFERRAL'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <ReferralModal
          onClose={handleCloseSection}
          referralCode={userProfile?.name ? `AOLO_${userProfile.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}729` : 'AOLO_SAURABH729'}
        />
      </Modal>

      <Modal
        visible={currentSheet === 'SAVED_PLACES'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <SavedPlacesModal
          onClose={handleCloseSection}
          onSelectPlace={(name, address) => {
            setDropoff({
              id: 'sp_selected',
              name,
              address,
              lat: 25.6093,
              lng: 85.1376,
            });
            setCurrentSheet('BOOKING');
          }}
        />
      </Modal>

      <Modal
        visible={currentSheet === 'SCHEDULE'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <RideScheduleModal
          onClose={handleCloseSection}
          onScheduleNewRide={() => {
            setCurrentSheet('PICKUP');
          }}
        />
      </Modal>

      <Modal
        visible={currentSheet === 'FAVOURITES'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <FavouriteDriversModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'SAFETY'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <SafetyCenterModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'UPDATES'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <WhatsNewModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'SUPPORT'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <SupportModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'PRIVACY'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <PrivacyPolicyModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'TERMS'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <TermsOfServiceModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'LANGUAGE'}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseSection}
      >
        <LanguageModal onClose={handleCloseSection} />
      </Modal>

      <Modal
        visible={currentSheet === 'WEATHER'}
        animationType="slide"
        onRequestClose={handleCloseSection}
      >
        <WeatherModal onClose={handleCloseSection} />
      </Modal>

      <Modal visible={currentSheet === 'TRIP_POLICIES'} animationType="slide" onRequestClose={handleCloseSection}>
        <TripPoliciesModal onClose={handleCloseSection} />
      </Modal>

      <Modal visible={currentSheet === 'TRAVEL_MODE'} animationType="slide" onRequestClose={handleCloseSection}>
        <TravelModeScreen onClose={() => {
          setModeToggle('RIDE');
          handleCloseSection();
        }} />
      </Modal>

      <Modal visible={activeTab === 'corporate'} animationType="slide" onRequestClose={handleCloseSection}>
        <CorporateScreen onClose={() => {
          setActiveTab('home');
          handleCloseSection();
        }} />
      </Modal>

      {/* Sidebar Drawer Overlay (Last child of root View) */}
      {drawerOpen && (
        <SidebarDrawer
          userProfile={userProfile}
          currentRideType={RIDE_CATEGORY_CONFIG[selectedMode]?.label || selectedMode}
          onClose={() => setDrawerOpen(false)}
          onOpenHistory={() => {
            setHistoryInitialTab('Rides');
            setCurrentSheet('HISTORY');
          }}
          onOpenParcel={() => setCurrentSheet('PARCEL')}
          onOpenWallet={() => setCurrentSheet('WALLET')}
          onOpenProfile={() => setCurrentSheet('PROFILE')}
          onOpenCorporate={handleOpenCorporate}
          onLogout={logout}
          onOpenRoadTrips={() => setCurrentSheet('ROAD_TRIPS')}
          onOpenOffers={() => setCurrentSheet('OFFERS')}
          onOpenReferral={() => setCurrentSheet('REFERRAL')}
          onOpenSavedPlaces={() => setCurrentSheet('SAVED_PLACES')}
          onOpenSchedule={() => setCurrentSheet('SCHEDULE')}
          onOpenFavourites={() => setCurrentSheet('FAVOURITES')}
          onOpenSafety={() => setCurrentSheet('SAFETY')}
          onOpenUpdates={() => setCurrentSheet('UPDATES')}
          onOpenSupport={() => setCurrentSheet('SUPPORT')}
          onOpenPrivacy={() => setCurrentSheet('PRIVACY')}
          onOpenTerms={() => setCurrentSheet('TERMS')}
          onOpenLanguage={() => setCurrentSheet('LANGUAGE')}
          onOpenPolicies={() => setCurrentSheet('TRIP_POLICIES')}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  mapArea: {
    flex: MAP_FLEX_RATIO,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 14 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchAccountBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  switchAccountIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4FBE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchAccountTextCol: {
    alignItems: 'flex-start',
  },
  switchAccountBadge: {
    fontSize: 7.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#65A30D',
    letterSpacing: 0.5,
  },
  switchAccountTitle: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    lineHeight: 14,
  },
  weatherWidget: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  weatherTextCol: {
    alignItems: 'flex-start',
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    lineHeight: 15,
  },
  weatherFeels: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  gpsBtn: {
    position: 'absolute',
    bottom: spacing.px_6,
    right: spacing.px_4,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: brandColors.aoloCardBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  sheetContainer: {
    flex: SHEET_FLEX_RATIO,
    backgroundColor: brandColors.aoloCardBg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.px_4,
    paddingTop: spacing.px_2,
    marginTop: -spacing.px_3, // slight overlap over the map
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 95 : 85,
  },

  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    padding: 3,
    marginBottom: 10,
  },
  modeTogglePill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeModePill: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modeToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  activeModeText: {
    color: '#0F172A',
    fontWeight: '800',
  },
  categoryTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  activeCategoryTab: {
    backgroundColor: '#F4FBE8',
    borderColor: '#84CC16',
  },
  categoryLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 4,
    letterSpacing: 0.4,
  },
  activeCategoryLabel: {
    color: '#84CC16',
    fontWeight: '800',
  },
  resumeBookingWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 76,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  resumeBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  resumeGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#84CC16',
  },
  resumeBookingText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },

  fiveCategoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginBottom: 12,
  },
  fiveCategoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: 64,
  },
  fiveCategoryItemActive: {
    borderColor: '#84CC16',
    backgroundColor: '#A3E635',
    shadowColor: '#65A30D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
    elevation: 5,
    transform: [{ translateY: -2 }],
  },
  fiveCategoryLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 5,
    letterSpacing: 0.3,
  },
  fiveCategoryLabelActive: {
    color: '#3F6212',
    fontWeight: '900',
  },

  /* PARCEL DELIVERY MODE Card Styles matching screenshot */
  parcelDeliveryCard: {
    backgroundColor: '#EDFAF3',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  parcelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parcelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#00875A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  parcelEmojiIcon: {
    fontSize: 24,
  },
  parcelTitleCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  parcelCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  parcelCardSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#047857',
    marginTop: 3,
    lineHeight: 15,
  },
  parcelPinBadge: {
    backgroundColor: '#C6F6D5',
    borderWidth: 1,
    borderColor: '#9AE6B4',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parcelPinBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#047857',
    textAlign: 'center',
    lineHeight: 12,
  },
  parcelOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },
  parcelOptionBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  parcelOptionBoxActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  parcelOptionEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  parcelOptionName: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 4,
    textAlign: 'center',
  },
  parcelOptionMeta: {
    fontSize: 9.5,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  openParcelBtn: {
    backgroundColor: '#00B368',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  openParcelBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    marginLeft: 8,
    marginRight: 6,
  },

  chaiPaniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
    borderColor: '#FACC15',
    borderRadius: 22,
    padding: 13,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chaiPaniIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FF8800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chaiPaniContentCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  chaiPaniTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  chaiPaniEmoji: {
    fontSize: 13,
  },
  chaiPaniTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  flexibleRideBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  flexibleRideBadgeText: {
    color: '#15803D',
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  chaiPaniSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto',
    marginTop: 3,
    lineHeight: 15,
  },
  chaiPaniArrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  offersPromoCard: {
    backgroundColor: '#F9FCF5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  offersTag: {
    backgroundColor: '#A3E635',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  offersTagText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  offersPromoTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 8,
  },
  offersPromoSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: 'Roboto',
    marginTop: 2,
  },

  offersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  offersBadge: {
    backgroundColor: '#A3E635',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  offersBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  offersTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 8,
  },
  offersSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 3,
  },
  expertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expertLeft: {
    flex: 1,
    paddingRight: 8,
  },
  expertEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  expertTitle: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 2,
  },
  expertDesc: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  callExpertBtn: {
    backgroundColor: '#A3E635',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callExpertText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  activeRideBar: {
    position: 'absolute',
    bottom: 20,
    left: spacing.px_4,
    right: spacing.px_4,
    backgroundColor: '#A3E635',
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.px_4,
    alignItems: 'center',
    zIndex: 20,
  },
  activeRideBarText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
    fontFamily: 'Roboto',
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
  activeNavItem: {},
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
  serviceTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingBottom: 6,
    marginBottom: 6,
  },
  serviceTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    position: 'relative',
    minWidth: 70,
  },
  serviceTabIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4FBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  serviceTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  serviceTabLabelActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  serviceActiveLine: {
    position: 'absolute',
    bottom: -6,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  tabContentContainer: {
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  searchDestinationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 7,
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 9,
    elevation: 8,
  },
  searchDestinationMapBtn: {
    position: 'absolute',
    bottom: 20,
    left: '14%',
    right: '14%',
    zIndex: 30,
  },
  searchDestinationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Roboto',
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickActionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  selectPackageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 10,
  },
  selectPackageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  packagesScroll: {
    marginBottom: 12,
  },
  packageChip: {
    width: 86,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginRight: 10,
  },
  packageChipActive: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  packageChipHours: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  packageChipHoursActive: {
    color: '#0F172A',
  },
  packageChipKms: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  packageChipKmsActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  rentalsGreenBanner: {
    backgroundColor: '#84CC16',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rentalsGreenBannerText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 16,
  },
  bookRentalBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 14,
  },
  bookRentalBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  outstationToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  outstationPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  outstationPillActive: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  outstationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  outstationPillTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
});


