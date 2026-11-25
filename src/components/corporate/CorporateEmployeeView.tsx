import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Home as HomeIcon,
  Calendar,
  User as UserIcon,
  Phone,
  Shield,
  Star,
  MapPin,
  Clock,
  WifiOff,
  Bell,
  AlertTriangle,
  Building,
  CheckCircle2,
  FileText,
  Share2,
} from 'lucide-react-native';
import {
  EmployeeScreenId,
  TripBooking,
  INITIAL_TRIPS,
} from './corporateTypes';

interface CorporateEmployeeViewProps {
  trips: TripBooking[];
  onAddTrip: (trip: TripBooking) => void;
  onCancelTrip: (tripId: string) => void;
  onStartTrip: (tripId: string) => void;
  onCompleteTrip: (tripId: string) => void;
  onExit: () => void;
}

export default function CorporateEmployeeView({
  trips,
  onAddTrip,
  onCancelTrip,
  onStartTrip,
  onCompleteTrip,
  onExit,
}: CorporateEmployeeViewProps) {
  const [currentScreen, setCurrentScreen] = useState<EmployeeScreenId>('HOME');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Login form state
  const [loginEmpId, setLoginEmpId] = useState('AOLO-EMP-0482');
  const [loginPass, setLoginPass] = useState('••••••');

  // Booking form state (Page 3)
  const [travellerType, setTravellerType] = useState<'SELF' | 'GUEST VISITOR'>('SELF');
  const [bookingType, setBookingType] = useState<'ONEWAY' | 'ROUNDTRIP' | 'RENTAL' | 'AIRPORT'>('ONEWAY');
  const [pickupAddr, setPickupAddr] = useState('Office HQ (Exhibition Road, Patna)');
  const [dropAddr, setDropAddr] = useState('Darbhanga Junction Platform 1');
  const [pickupDate, setPickupDate] = useState('07/14/2026');
  const [pickupTime, setPickupTime] = useState('06:00 AM');
  const [vehicleClass, setVehicleClass] = useState('AOLO Sedan (Dzire)');
  const [passengers, setPassengers] = useState('1');
  const [specialInstructions, setSpecialInstructions] = useState('VIP client travel');
  const [costCenter, setCostCenter] = useState('Operations (AOLO-OPS-LAUNCH)');
  const [projectCode, setProjectCode] = useState('AOLO-OPS-LAUNCH');
  const [ridePurpose, setRidePurpose] = useState('Business Meeting');

  // Trips filter (Page 5)
  const [tripTab, setTripTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'COMPLETED'>('ALL');
  const [selectedTripId, setSelectedTripId] = useState<string>('ACB-0482-2026');

  // Daily ride state (Page 8)
  const [activeDays, setActiveDays] = useState<string[]>(['M', 'T', 'W', 'T2', 'F', 'S1']);
  const [dailyPickupTime, setDailyPickupTime] = useState('09:00 AM');
  const [dailyPickupAddress, setDailyPickupAddress] = useState('[Home address]');
  const [dailyDropAddress, setDailyDropAddress] = useState('Office HQ, Exhibition Road');
  const [dailyReturnEnabled, setDailyReturnEnabled] = useState(true);
  const [dailyReturnTime, setDailyReturnTime] = useState('06:00 PM');
  const [dailyCostCenter, setDailyCostCenter] = useState('[Department]');

  // Ratings & completed state (Page 10)
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState('');

  // Notifications (Page 11)
  const [notifSubTab, setNotifSubTab] = useState<'ALERTS' | 'SETTINGS'>('ALERTS');
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifApp, setNotifApp] = useState(true);
  const [language, setLanguage] = useState<'HI' | 'EN'>('EN');

  // Safety state (Page 13)
  const [trustedContact1, setTrustedContact1] = useState('Ravi Verma (+91 98765 00112)');
  const [trustedContact2, setTrustedContact2] = useState('Suresh Roy (+91 98111 88990)');
  const [autoShareTrip, setAutoShareTrip] = useState(true);
  const [sosAlertAdmin, setSosAlertAdmin] = useState(true);

  // Selected trip for details
  const activeDetailTrip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const isTripsSubPage =
    currentScreen === 'DAILY_OFFICE_RIDE' ||
    currentScreen === 'TRIP_IN_PROGRESS' ||
    currentScreen === 'TRIP_COMPLETED';

  const handleCreateRide = () => {
    const newId = `ACB-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    const newTrip: TripBooking = {
      id: newId,
      traveler: travellerType === 'SELF' ? 'Amit Roy' : 'Executive Guest',
      employeeId: 'AOLO-EMP-0482',
      department: 'Operations',
      costCenter,
      projectCode,
      pickup: pickupAddr.includes('HQ') ? 'Office HQ' : pickupAddr.split(',')[0],
      pickupAddress: pickupAddr,
      dropoff: dropAddr.split(',')[0],
      dropoffAddress: dropAddr,
      date: pickupDate,
      time: pickupTime,
      bookingType,
      vehicleClass,
      passengers: parseInt(passengers, 10) || 1,
      specialInstructions,
      purpose: ridePurpose,
      billingMode: 'Corporate Wallet',
      fare: '₹3100',
      status: 'PENDING',
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      progressStep: 'Requested',
      createdAt: new Date().toISOString(),
    };
    onAddTrip(newTrip);
    setSelectedTripId(newId);
    setCurrentScreen('MY_TRIPS');
  };

  const handleSaveDailyRide = () => {
    if (activeDays.length === 0) {
      Alert.alert('Choose your days', 'Select at least one day for your office ride.');
      return;
    }

    const newId = `ACB-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    const dayLabels = activeDays.map((day) => day.replace(/[12]/g, '')).join(', ');
    const dailyTrip: TripBooking = {
      id: newId,
      traveler: 'Amit Roy',
      employeeId: 'AOLO-EMP-0482',
      department: 'Operations',
      costCenter: dailyCostCenter,
      projectCode: 'AOLO-OPS-LAUNCH',
      pickup: dailyPickupAddress,
      pickupAddress: dailyPickupAddress,
      dropoff: dailyDropAddress,
      dropoffAddress: dailyDropAddress,
      date: `Repeats ${dayLabels}`,
      time: dailyPickupTime,
      bookingType: dailyReturnEnabled ? 'ROUNDTRIP' : 'ONEWAY',
      vehicleClass: 'AOLO Sedan (Dzire)',
      passengers: 1,
      specialInstructions: dailyReturnEnabled
        ? `Daily office ride. Evening return at ${dailyReturnTime}.`
        : 'Daily office ride.',
      purpose: 'Daily office commute',
      billingMode: 'Department Billing',
      fare: 'Pending approval',
      status: 'PENDING',
      progressStep: 'Requested',
      createdAt: new Date().toISOString(),
    };

    onAddTrip(dailyTrip);
    setSelectedTripId(newId);
    setTripTab('ALL');
    setCurrentScreen('MY_TRIPS');
  };

  // ---------------- PAGE 1: LOGIN ----------------
  if (!isLoggedIn || currentScreen === 'LOGIN') {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginContent}>
          <Text style={styles.loginBrandTitle}>AOLO</Text>
          <Text style={styles.loginBrandSubtitle}>Corporate</Text>
          <Text style={styles.loginSubDesc}>Company rides, billed to your organisation.</Text>

          <View style={styles.loginFormBox}>
            <Text style={styles.inputLabelWhite}>Employee ID</Text>
            <TextInput
              style={styles.whiteInput}
              value={loginEmpId}
              onChangeText={setLoginEmpId}
              placeholder="[Employee ID]"
              placeholderTextColor="#71717A"
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabelWhite, { marginTop: 16 }]}>Password or OTP</Text>
            <TextInput
              style={styles.whiteInput}
              value={loginPass}
              onChangeText={setLoginPass}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="#71717A"
            />

            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={() => {
                setIsLoggedIn(true);
                setCurrentScreen('HOME');
              }}
            >
              <Text style={styles.loginBtnText}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 24, alignItems: 'center' }}
              onPress={() => Alert.alert('Admin Help', 'Please contact admin@abccorp.com to reset credentials.')}
            >
              <Text style={styles.loginForgotText}>Forgot password? Contact your admin.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ---------------- MAIN EMPLOYEE SCREENS ----------------
  return (
    <View style={styles.mainWrapper}>
      {/* Top Black Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <Text style={styles.companyNameHeader}>ABC CORPORATION</Text>
          <Text style={styles.pageTitleHeader}>
            {currentScreen === 'HOME' && 'Hello, [Employee Name]'}
            {currentScreen === 'REQUEST_RIDE' && 'Request a ride'}
            {currentScreen === 'REVIEW_REQUEST' && 'Review request'}
            {currentScreen === 'MY_TRIPS' && 'My trips'}
            {currentScreen === 'TRIP_DETAILS' && (activeDetailTrip?.id || 'Trip details')}
            {currentScreen === 'ACCOUNT' && 'Account'}
            {currentScreen === 'DAILY_OFFICE_RIDE' && 'Daily office ride'}
            {currentScreen === 'TRIP_IN_PROGRESS' && 'Trip in progress'}
            {currentScreen === 'TRIP_COMPLETED' && 'Trip completed'}
            {currentScreen === 'NOTIFICATIONS' && 'Notifications'}
            {currentScreen === 'OFFLINE_MODE' && 'Request a ride'}
            {currentScreen === 'SAFETY' && 'Safety'}
          </Text>
        </View>

        {/* Quick Screen Switcher Pill for Demo / Review */}
        <View style={styles.topNavPills}>
          {currentScreen !== 'HOME' &&
            currentScreen !== 'REVIEW_REQUEST' &&
            currentScreen !== 'TRIP_DETAILS' && (
            <TouchableOpacity
              style={styles.backButtonPill}
              onPress={() => setCurrentScreen(isTripsSubPage ? 'MY_TRIPS' : 'HOME')}
            >
              <ArrowLeft size={14} color="#000000" />
              <Text style={styles.backButtonText}>{isTripsSubPage ? 'My Trips' : 'Home'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Screen Body */}
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* ================= PAGE 2: EMPLOYEE HOME ================= */}
        {currentScreen === 'HOME' && (
          <View>
            {/* Where to? Box */}
            <TouchableOpacity
              style={styles.whereToBox}
              activeOpacity={0.8}
              onPress={() => setCurrentScreen('REQUEST_RIDE')}
            >
              <Text style={styles.whereToTitle}>Where to?</Text>
            </TouchableOpacity>

            {/* 4 Service Tiles */}
            <View style={styles.serviceGrid}>
              <TouchableOpacity
                style={styles.serviceTile}
                activeOpacity={0.8}
                onPress={() => {
                  setBookingType('ONEWAY');
                  setCurrentScreen('REQUEST_RIDE');
                }}
              >
                <View style={styles.serviceLetterBadge}>
                  <Text style={styles.serviceLetterText}>O</Text>
                </View>
                <Text style={styles.serviceNameText}>Oneway</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.serviceTile}
                activeOpacity={0.8}
                onPress={() => {
                  setBookingType('ROUNDTRIP');
                  setCurrentScreen('REQUEST_RIDE');
                }}
              >
                <View style={styles.serviceLetterBadge}>
                  <Text style={styles.serviceLetterText}>R</Text>
                </View>
                <Text style={styles.serviceNameText}>Roundtrip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.serviceTile}
                activeOpacity={0.8}
                onPress={() => {
                  setBookingType('RENTAL');
                  setCurrentScreen('REQUEST_RIDE');
                }}
              >
                <View style={styles.serviceLetterBadge}>
                  <Text style={styles.serviceLetterText}>R</Text>
                </View>
                <Text style={styles.serviceNameText}>Rental</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.serviceTile}
                activeOpacity={0.8}
                onPress={() => {
                  setBookingType('AIRPORT');
                  setDropAddr('Jay Prakash Narayan Airport, Terminal 1');
                  setCurrentScreen('REQUEST_RIDE');
                }}
              >
                <View style={styles.serviceLetterBadge}>
                  <Text style={styles.serviceLetterText}>A</Text>
                </View>
                <Text style={styles.serviceNameText}>Airport</Text>
              </TouchableOpacity>
            </View>

            {/* Upcoming Trip Section */}
            <Text style={styles.sectionHeaderTitle}>Upcoming trip</Text>

            {trips.length > 0 && (
              <TouchableOpacity
                style={styles.upcomingTripCard}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedTripId(trips[0].id);
                  setCurrentScreen('TRIP_DETAILS');
                }}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.tripIdBold}>{trips[0].id}</Text>
                  <View
                    style={[
                      styles.statusBadgePill,
                      trips[0].status === 'PENDING'
                        ? styles.pillPending
                        : trips[0].status === 'APPROVED'
                        ? styles.pillApproved
                        : styles.pillCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        trips[0].status === 'PENDING' && { color: '#000000' },
                      ]}
                    >
                      {trips[0].status === 'PENDING' ? 'PENDING APPROVAL' : trips[0].status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.tripRouteText}>
                  {trips[0].pickup} to {trips[0].dropoff}
                </Text>
                <Text style={styles.tripDateTimeText}>
                  {trips[0].date} at {trips[0].time}
                </Text>
              </TouchableOpacity>
            )}

            {/* Billed to company notice */}
            <View style={styles.companyBilledNoticeBox}>
              <Text style={styles.companyBilledNoticeText}>
                Billed to your company. No payment needed.
              </Text>
            </View>
          </View>
        )}

        {/* ================= PAGE 3: REQUEST A RIDE ================= */}
        {currentScreen === 'REQUEST_RIDE' && (
          <View>
            {/* Who is travelling */}
            <Text style={styles.fieldLabel}>Who is travelling</Text>
            <View style={styles.pillSelectorRow}>
              <TouchableOpacity
                style={[styles.selectorPill, travellerType === 'SELF' && styles.selectorPillActive]}
                onPress={() => setTravellerType('SELF')}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    travellerType === 'SELF' && styles.selectorPillTextActive,
                  ]}
                >
                  SELF
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectorPill,
                  travellerType === 'GUEST VISITOR' && styles.selectorPillActive,
                ]}
                onPress={() => setTravellerType('GUEST VISITOR')}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    travellerType === 'GUEST VISITOR' && styles.selectorPillTextActive,
                  ]}
                >
                  GUEST VISITOR
                </Text>
              </TouchableOpacity>
            </View>

            {/* Booking Type */}
            <Text style={styles.fieldLabel}>Booking type</Text>
            <View style={styles.bookingTypeRow}>
              {(['ONEWAY', 'ROUNDTRIP', 'RENTAL', 'AIRPORT'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bookingTypePill,
                    bookingType === type && styles.bookingTypePillActive,
                  ]}
                  onPress={() => setBookingType(type)}
                >
                  <Text
                    style={[
                      styles.bookingTypePillText,
                      bookingType === type && styles.bookingTypePillTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pickup Address */}
            <Text style={styles.fieldLabel}>Pickup address</Text>
            <View style={styles.inputWithChipRow}>
              <TextInput
                style={styles.flexInput}
                value={pickupAddr}
                onChangeText={setPickupAddr}
                placeholder="Enter pickup"
                placeholderTextColor="#71717A"
              />
              <TouchableOpacity
                style={styles.quickChipBtn}
                onPress={() => setPickupAddr('Office HQ (Exhibition Road, Patna)')}
              >
                <Text style={styles.quickChipText}>HQ</Text>
              </TouchableOpacity>
            </View>

            {/* Destination */}
            <Text style={styles.fieldLabel}>Destination</Text>
            <View style={styles.inputWithChipRow}>
              <TextInput
                style={styles.flexInput}
                value={dropAddr}
                onChangeText={setDropAddr}
                placeholder="Enter destination"
                placeholderTextColor="#71717A"
              />
              <TouchableOpacity
                style={styles.quickChipBtn}
                onPress={() => setDropAddr('Jay Prakash Narayan Airport, Terminal 1')}
              >
                <Text style={styles.quickChipText}>Airport</Text>
              </TouchableOpacity>
            </View>

            {/* Date & Time */}
            <View style={styles.twoColumnRow}>
              <View style={styles.halfColumn}>
                <Text style={styles.fieldLabel}>Date</Text>
                <TextInput
                  style={styles.columnInput}
                  value={pickupDate}
                  onChangeText={setPickupDate}
                />
              </View>
              <View style={styles.halfColumn}>
                <Text style={styles.fieldLabel}>Time</Text>
                <TextInput
                  style={styles.columnInput}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                />
              </View>
            </View>

            {/* Vehicle & Passengers */}
            <View style={styles.twoColumnRow}>
              <View style={styles.halfColumn}>
                <Text style={styles.fieldLabel}>Vehicle</Text>
                <TextInput
                  style={styles.columnInput}
                  value={vehicleClass}
                  onChangeText={setVehicleClass}
                />
              </View>
              <View style={styles.halfColumn}>
                <Text style={styles.fieldLabel}>Passengers</Text>
                <TextInput
                  style={styles.columnInput}
                  value={passengers}
                  onChangeText={setPassengers}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Special Instructions */}
            <Text style={styles.fieldLabel}>Special instructions</Text>
            <TextInput
              style={[styles.columnInput, { height: 70, textAlignVertical: 'top' }]}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="e.g. VIP client travel"
              placeholderTextColor="#71717A"
              multiline
            />

            {/* Cost Center */}
            <Text style={styles.fieldLabel}>Cost center</Text>
            <TextInput
              style={styles.columnInput}
              value={costCenter}
              onChangeText={setCostCenter}
            />

            {/* Project Code */}
            <Text style={styles.fieldLabel}>Project code</Text>
            <TextInput
              style={styles.columnInput}
              value={projectCode}
              onChangeText={setProjectCode}
            />

            {/* Ride Purpose */}
            <Text style={styles.fieldLabel}>Ride purpose</Text>
            <TextInput
              style={styles.columnInput}
              value={ridePurpose}
              onChangeText={setRidePurpose}
            />

            {/* Primary Action */}
            <TouchableOpacity
              style={styles.primaryBlackBtn}
              activeOpacity={0.85}
              onPress={() => setCurrentScreen('REVIEW_REQUEST')}
            >
              <Text style={styles.primaryBlackBtnText}>SEND FOR APPROVAL →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 4: REVIEW REQUEST ================= */}
        {currentScreen === 'REVIEW_REQUEST' && (
          <View>
            <View style={styles.reviewRouteCard}>
              <View style={styles.routePointRow}>
                <View style={styles.squareIconBox} />
                <Text style={styles.routePointText}>[Pickup address]</Text>
              </View>
              <View style={[styles.routePointRow, { marginTop: 16 }]}>
                <View style={styles.circleIconBox} />
                <Text style={styles.routePointText}>[Destination]</Text>
              </View>
            </View>

            <View style={styles.reviewDetailsTable}>
              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Type</Text>
                <Text style={styles.reviewTableRowValue}>
                  {bookingType === 'ONEWAY'
                    ? 'Oneway'
                    : bookingType === 'ROUNDTRIP'
                    ? 'Roundtrip'
                    : bookingType.charAt(0) + bookingType.slice(1).toLowerCase()}
                </Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Date and time</Text>
                <Text style={styles.reviewTableRowValue}>
                  {pickupDate}, {pickupTime}
                </Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Vehicle</Text>
                <Text style={styles.reviewTableRowValue}>{vehicleClass}</Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Passengers</Text>
                <Text style={styles.reviewTableRowValue}>{passengers}</Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Cost center</Text>
                <Text style={styles.reviewTableRowValue}>{costCenter}</Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Project code</Text>
                <Text style={styles.reviewTableRowValue}>{projectCode}</Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Purpose</Text>
                <Text style={styles.reviewTableRowValue}>{ridePurpose}</Text>
              </View>
              <View style={styles.reviewTableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.reviewTableRowLabel}>Billing</Text>
                <Text style={styles.reviewTableRowValue}>Corporate Wallet</Text>
              </View>
            </View>

            {/* Admin Notice Banner */}
            <View style={[styles.noticeBannerBox, styles.reviewNoticeBanner]}>
              <Text style={styles.noticeBannerText}>
                Your request goes to the admin for approval. You will be notified here.
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.primaryBlackBtn, styles.reviewPrimaryButton]}
              activeOpacity={0.85}
              onPress={handleCreateRide}
            >
              <Text style={[styles.primaryBlackBtnText, styles.reviewActionButtonText]}>CONFIRM AND SEND</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryGrayBtn, styles.reviewSecondaryButton]}
              activeOpacity={0.85}
              onPress={() => setCurrentScreen('REQUEST_RIDE')}
            >
              <Text style={[styles.secondaryGrayBtnText, styles.reviewActionButtonText]}>EDIT DETAILS</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 5: MY TRIPS ================= */}
        {currentScreen === 'MY_TRIPS' && (
          <View>
            <TouchableOpacity
              style={styles.dailyRideShortcut}
              activeOpacity={0.82}
              onPress={() => setCurrentScreen('DAILY_OFFICE_RIDE')}
            >
              <View style={styles.dailyRideShortcutIcon}>
                <Calendar size={18} color="#000000" strokeWidth={2.2} />
              </View>
              <View style={styles.dailyRideShortcutCopy}>
                <Text style={styles.dailyRideShortcutTitle}>Daily office ride</Text>
                <Text style={styles.dailyRideShortcutSubtitle}>Set up a repeating commute</Text>
              </View>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            {/* Filter Tabs */}
            <View style={styles.filterTabsRow}>
              {(['ALL', 'PENDING', 'APPROVED', 'COMPLETED'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterTabPill, tripTab === tab && styles.filterTabPillActive]}
                  onPress={() => setTripTab(tab)}
                >
                  <Text
                    style={[
                      styles.filterTabPillText,
                      tripTab === tab && styles.filterTabPillTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Trips Cards List */}
            {trips
              .filter((t) => {
                if (tripTab === 'ALL') return true;
                if (tripTab === 'PENDING') return t.status === 'PENDING';
                if (tripTab === 'APPROVED') return t.status === 'APPROVED' || t.status === 'SCHEDULED' || t.status === 'ON_THE_WAY';
                if (tripTab === 'COMPLETED') return t.status === 'COMPLETED';
                return true;
              })
              .map((item) => {
                const canStartTrip =
                  item.status === 'APPROVED' || item.status === 'SCHEDULED';
                const isTripInProgress = item.status === 'ON_THE_WAY';

                return (
                <View key={item.id} style={styles.tripListItemCard}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedTripId(item.id);
                      setCurrentScreen('TRIP_DETAILS');
                    }}
                  >
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.tripIdBold}>{item.id}</Text>
                      <View
                        style={[
                          styles.statusBadgePill,
                          item.status === 'PENDING'
                            ? styles.pillPending
                            : item.status === 'APPROVED' || item.status === 'SCHEDULED' || item.status === 'ON_THE_WAY'
                            ? styles.pillApproved
                            : item.status === 'COMPLETED'
                            ? styles.pillCompleted
                            : styles.pillRejected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            item.status === 'PENDING' && { color: '#000000' },
                          ]}
                        >
                          {item.status === 'PENDING' ? 'PENDING APPROVAL' : item.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.tripRouteText}>
                      {item.pickup} to {item.dropoff}
                    </Text>
                    <Text style={styles.tripDateTimeText}>
                      {item.date} at {item.time} · Fare {item.fare}
                    </Text>
                  </TouchableOpacity>

                  {item.status === 'PENDING' && (
                    <TouchableOpacity
                      style={styles.cancelRequestBtn}
                      onPress={() => onCancelTrip(item.id)}
                    >
                      <Text style={styles.cancelRequestBtnText}>CANCEL REQUEST</Text>
                    </TouchableOpacity>
                  )}

                  {item.status === 'APPROVED' && (
                    <Text style={styles.assignedNoticeText}>
                      Cab will be assigned before pickup time.
                    </Text>
                  )}

                  {(canStartTrip || isTripInProgress) && (
                    <TouchableOpacity
                      style={styles.startTripButton}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedTripId(item.id);
                        if (canStartTrip) onStartTrip(item.id);
                        setCurrentScreen('TRIP_IN_PROGRESS');
                      }}
                    >
                      <Text style={styles.startTripButtonText}>
                        {isTripInProgress ? 'CONTINUE TRIP' : 'START TRIP'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {item.status === 'COMPLETED' && (
                    <TouchableOpacity
                      style={styles.downloadInvoiceBtn}
                      onPress={() =>
                        Alert.alert('Invoice Downloaded', `Invoice for ${item.id} saved as PDF.`)
                      }
                    >
                      <Text style={styles.downloadInvoiceBtnText}>DOWNLOAD INVOICE</Text>
                    </TouchableOpacity>
                  )}
                </View>
                );
              })}
          </View>
        )}

        {/* ================= PAGE 6: TRIP DETAILS ================= */}
        {currentScreen === 'TRIP_DETAILS' && activeDetailTrip && (
          <View>
            <View style={{ marginBottom: 12 }}>
              <View
                style={[
                  styles.statusBadgePill,
                  styles.pillPending,
                  { alignSelf: 'flex-start', marginBottom: 14 },
                ]}
              >
                <Text style={[styles.statusBadgeText, { color: '#000000' }]}>
                  {activeDetailTrip.status === 'PENDING' ? 'PENDING APPROVAL' : activeDetailTrip.status}
                </Text>
              </View>

              <View style={styles.reviewRouteCard}>
                <View style={styles.routePointRow}>
                  <View style={styles.squareIconBox} />
                  <View>
                    <Text style={styles.routePointBold}>{activeDetailTrip.pickup}</Text>
                    <Text style={styles.routePointSub}>{activeDetailTrip.pickupAddress}</Text>
                  </View>
                </View>

                <View style={[styles.routePointRow, { marginTop: 14 }]}>
                  <View style={styles.circleIconBox} />
                  <View>
                    <Text style={styles.routePointBold}>{activeDetailTrip.dropoff}</Text>
                    <Text style={styles.routePointSub}>{activeDetailTrip.dropoffAddress}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.reviewDetailsTable, styles.tripDetailTable]}>
              <View style={[styles.tableRow, styles.tripDetailTableRow]}>
                <Text style={styles.tripDetailTableLabel}>Date and time</Text>
                <Text style={styles.tripDetailTableValue}>
                  {activeDetailTrip.date} at {activeDetailTrip.time}
                </Text>
              </View>
              <View style={styles.tripDetailTableDivider} />

              <View style={[styles.tableRow, styles.tripDetailTableRow]}>
                <Text style={styles.tripDetailTableLabel}>Cost center</Text>
                <Text style={styles.tripDetailTableValue}>{activeDetailTrip.costCenter}</Text>
              </View>
              <View style={styles.tripDetailTableDivider} />

              <View style={[styles.tableRow, styles.tripDetailTableRow]}>
                <Text style={styles.tripDetailTableLabel}>Billing</Text>
                <Text style={styles.tripDetailTableValue}>{activeDetailTrip.billingMode}</Text>
              </View>
              <View style={styles.tripDetailTableDivider} />

              <View style={[styles.tableRow, styles.tripDetailTableRow]}>
                <Text style={styles.tripDetailTableLabel}>Fare</Text>
                <Text style={[styles.tripDetailTableValue, { fontSize: 18, fontWeight: '700' }]}>
                  {activeDetailTrip.fare}
                </Text>
              </View>
            </View>

            {/* Progress Step Tracker */}
            <Text style={[styles.sectionHeaderTitle, { marginTop: 18, marginBottom: 16 }]}>
              Progress
            </Text>

            <View style={styles.stepProgressContainer}>
              <View style={styles.stepRow}>
                <View style={[styles.stepBullet, styles.stepBulletFilled]} />
                  <Text style={styles.detailStepText}>Requested</Text>
              </View>

              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepBullet,
                    activeDetailTrip.status !== 'PENDING'
                      ? styles.stepBulletFilled
                      : styles.stepBulletOutline,
                  ]}
                />
                <Text
                  style={styles.detailStepText}
                >
                  Approved by admin
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepBullet,
                    activeDetailTrip.status === 'SCHEDULED' ||
                    activeDetailTrip.status === 'ON_THE_WAY' ||
                    activeDetailTrip.status === 'COMPLETED'
                      ? styles.stepBulletFilled
                      : styles.stepBulletOutline,
                  ]}
                />
                <Text
                  style={styles.detailStepText}
                >
                  Cab assigned
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepBullet,
                    activeDetailTrip.status === 'COMPLETED'
                      ? styles.stepBulletFilled
                      : styles.stepBulletOutline,
                  ]}
                />
                <Text
                  style={styles.detailStepText}
                >
                  Trip completed
                </Text>
              </View>
            </View>

            {activeDetailTrip.status === 'PENDING' && (
              <TouchableOpacity
                style={styles.cancelRequestBtnRed}
                onPress={() => {
                  onCancelTrip(activeDetailTrip.id);
                  setCurrentScreen('MY_TRIPS');
                }}
              >
                <Text style={styles.cancelRequestBtnRedText}>CANCEL REQUEST</Text>
              </TouchableOpacity>
            )}

            {(activeDetailTrip.status === 'APPROVED' ||
              activeDetailTrip.status === 'SCHEDULED' ||
              activeDetailTrip.status === 'ON_THE_WAY') && (
              <TouchableOpacity
                style={[styles.primaryBlackBtn, { marginTop: 18 }]}
                activeOpacity={0.85}
                onPress={() => {
                  if (activeDetailTrip.status !== 'ON_THE_WAY') {
                    onStartTrip(activeDetailTrip.id);
                  }
                  setCurrentScreen('TRIP_IN_PROGRESS');
                }}
              >
                <Text style={styles.primaryBlackBtnText}>
                  {activeDetailTrip.status === 'ON_THE_WAY' ? 'VIEW LIVE TRIP' : 'START TRIP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ================= PAGE 7: ACCOUNT ================= */}
        {currentScreen === 'ACCOUNT' && (
          <View>
            <View style={styles.accountProfileCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>AB</Text>
              </View>
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.accountName}>Amit Roy</Text>
                <Text style={styles.accountIdText}>ID: AOLO-EMP-0482</Text>
              </View>
            </View>

            <View style={styles.reviewDetailsTable}>
              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Department</Text>
                <Text style={styles.tableRowValue}>Operations</Text>
              </View>
              <View style={styles.tableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Cost center</Text>
                <Text style={styles.tableRowValue}>AOLO-OPS-LAUNCH</Text>
              </View>
              <View style={styles.tableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Company</Text>
                <Text style={styles.tableRowValue}>ABC CORPORATION</Text>
              </View>
            </View>

            {/* Saved Places */}
            <Text style={[styles.sectionHeaderTitle, { marginTop: 20 }]}>Saved places</Text>
            <View style={styles.savedPlacesRow}>
              <TouchableOpacity style={styles.savedPlaceChip}>
                <Text style={styles.savedPlaceChipText}>HQ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.savedPlaceChip}>
                <Text style={styles.savedPlaceChipText}>Airport</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.savedPlaceChip, styles.savedPlaceChipAdd]}>
                <Text style={styles.savedPlaceChipAddText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {/* Notifications */}
            <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Notifications</Text>
            <View style={styles.toggleSettingCard}>
              <Text style={styles.toggleSettingText}>Ride approval updates</Text>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                setIsLoggedIn(false);
                setCurrentScreen('LOGIN');
              }}
            >
              <Text style={styles.logoutBtnText}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 8: DAILY OFFICE RIDE ================= */}
        {currentScreen === 'DAILY_OFFICE_RIDE' && (
          <View>
            <View style={styles.noticeBannerBox}>
              <Text style={styles.noticeBannerText}>
                Set once. A ride is requested for you every working day.
              </Text>
            </View>

            {/* Days Circles */}
            <Text style={styles.fieldLabel}>Days</Text>
            <View style={styles.daysRow}>
              {[
                { id: 'M', label: 'M' },
                { id: 'T', label: 'T' },
                { id: 'W', label: 'W' },
                { id: 'T2', label: 'T' },
                { id: 'F', label: 'F' },
                { id: 'S1', label: 'S' },
                { id: 'S2', label: 'S' },
              ].map((day) => {
                const isSelected = activeDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
                    onPress={() => {
                      if (isSelected) {
                        setActiveDays(activeDays.filter((d) => d !== day.id));
                      } else {
                        setActiveDays([...activeDays, day.id]);
                      }
                    }}
                  >
                    <Text style={[styles.dayCircleText, isSelected && styles.dayCircleTextActive]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pickup time */}
            <Text style={styles.fieldLabel}>Pickup time</Text>
            <TextInput
              style={styles.columnInput}
              value={dailyPickupTime}
              onChangeText={setDailyPickupTime}
            />

            {/* Pickup address */}
            <Text style={styles.fieldLabel}>Pickup address</Text>
            <TextInput
              style={styles.columnInput}
              value={dailyPickupAddress}
              onChangeText={setDailyPickupAddress}
            />

            {/* Drop */}
            <Text style={styles.fieldLabel}>Drop</Text>
            <TextInput
              style={styles.columnInput}
              value={dailyDropAddress}
              onChangeText={setDailyDropAddress}
            />

            {/* Return ride in the evening toggle */}
            <View style={[styles.toggleSettingCard, { marginTop: 16 }]}>
              <Text style={styles.toggleSettingText}>Return ride in the evening</Text>
              <Switch
                value={dailyReturnEnabled}
                onValueChange={setDailyReturnEnabled}
                trackColor={{ false: '#D4D4D8', true: '#000000' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {dailyReturnEnabled && (
              <View>
                <Text style={styles.fieldLabel}>Evening pickup time</Text>
                <TextInput
                  style={styles.columnInput}
                  value={dailyReturnTime}
                  onChangeText={setDailyReturnTime}
                />
              </View>
            )}

            {/* Cost center */}
            <Text style={styles.fieldLabel}>Cost center</Text>
            <TextInput
              style={styles.columnInput}
              value={dailyCostCenter}
              onChangeText={setDailyCostCenter}
            />

            <TouchableOpacity
              style={[styles.primaryBlackBtn, { marginTop: 28 }]}
              onPress={handleSaveDailyRide}
            >
              <Text style={styles.primaryBlackBtnText}>SAVE AND SEND FOR APPROVAL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 9: TRIP IN PROGRESS ================= */}
        {currentScreen === 'TRIP_IN_PROGRESS' && (
          <View>
            {/* Live Map Area */}
            <View style={styles.liveMapMockArea}>
              <View style={styles.mapGridLines} />
              <Text style={styles.liveMapCenterLabel}>Live map</Text>
            </View>

            {/* OTP Box */}
            <View style={styles.otpCard}>
              <View>
                <Text style={styles.otpLabel}>Pickup OTP</Text>
                <Text style={styles.otpValueDigits}>[  •  •  •  •  ]</Text>
              </View>
              <View style={styles.arrivingBadgePill}>
                <Text style={styles.arrivingBadgeText}>ARRIVING</Text>
              </View>
            </View>

            {/* Driver Card */}
            <View style={styles.driverInfoCard}>
              <Text style={styles.driverNameBold}>
                {activeDetailTrip?.driverName || 'Driver details coming soon'}
              </Text>
              <Text style={styles.cabDetailsSub}>
                {activeDetailTrip?.cabModel || activeDetailTrip?.vehicleClass || 'Cab details'}
                {activeDetailTrip?.cabNumber ? ` · ${activeDetailTrip.cabNumber}` : ''}
                {activeDetailTrip?.driverEta ? ` · ${activeDetailTrip.driverEta} min` : ''}
              </Text>
            </View>

            {/* Two Action Buttons */}
            <View style={styles.twoColumnRow}>
              <TouchableOpacity
                style={[styles.secondaryGrayBtn, { flex: 1, marginRight: 6 }]}
                onPress={() => Alert.alert('Trip Shared', 'Live tracking link copied to clipboard.')}
              >
                <Text style={styles.secondaryGrayBtnText}>SHARE TRIP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryGrayBtn, { flex: 1, marginLeft: 6 }]}
                onPress={() => Alert.alert('Calling Driver', 'Connecting to Rameshwar Kumar (+91 94310 11223)...')}
              >
                <Text style={styles.secondaryGrayBtnText}>CALL DRIVER</Text>
              </TouchableOpacity>
            </View>

            {/* SOS Button */}
            <TouchableOpacity
              style={styles.sosButton}
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert('SOS Emergency', 'Emergency alert broadcast to company safety admin and local authorities.')
              }
            >
              <Text style={styles.sosButtonText}>SOS EMERGENCY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBlackBtn, { marginTop: 14 }]}
              activeOpacity={0.85}
              onPress={() => {
                if (activeDetailTrip) onCompleteTrip(activeDetailTrip.id);
                setCurrentScreen('TRIP_COMPLETED');
              }}
            >
              <Text style={styles.primaryBlackBtnText}>COMPLETE TRIP</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 10: TRIP COMPLETED ================= */}
        {currentScreen === 'TRIP_COMPLETED' && (
          <View>
            <View style={styles.completedFareCard}>
              <Text style={styles.completedFareAmount}>
                {activeDetailTrip?.fare || '₹3100'}
              </Text>
              <Text style={styles.completedFareSub}>Billed to your company</Text>
            </View>

            {/* Star Rating */}
            <Text style={styles.rateRideTitle}>Rate your ride</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.starChar, star <= rating ? styles.starFilled : styles.starEmpty]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback */}
            <Text style={styles.fieldLabel}>Feedback</Text>
            <TextInput
              style={[styles.columnInput, { height: 90, textAlignVertical: 'top' }]}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Tell us how it went"
              placeholderTextColor="#71717A"
              multiline
            />

            {/* Actions */}
            <View style={[styles.twoColumnRow, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.secondaryGrayBtn, { flex: 1, marginRight: 6 }]}
                onPress={() =>
                  Alert.alert(
                    'Report Issue',
                    `Support ticket opened for ride ${activeDetailTrip?.id || 'booking'}.`,
                  )
                }
              >
                <Text style={styles.secondaryGrayBtnText}>REPORT ISSUE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryGrayBtn, { flex: 1, marginLeft: 6 }]}
                onPress={() =>
                  Alert.alert(
                    'Download Invoice',
                    `Tax invoice for ${activeDetailTrip?.id || 'your trip'} downloaded.`,
                  )
                }
              >
                <Text style={styles.secondaryGrayBtnText}>DOWNLOAD INVOICE</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBlackBtn, { marginTop: 20 }]}
              onPress={() => {
                Alert.alert('Thank you!', 'Your rating and feedback have been submitted.');
                setCurrentScreen('MY_TRIPS');
              }}
            >
              <Text style={styles.primaryBlackBtnText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 11: NOTIFICATIONS ================= */}
        {currentScreen === 'NOTIFICATIONS' && (
          <View>
            <View style={styles.pillSelectorRow}>
              <TouchableOpacity
                style={[styles.selectorPill, notifSubTab === 'ALERTS' && styles.selectorPillActive]}
                onPress={() => setNotifSubTab('ALERTS')}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    notifSubTab === 'ALERTS' && styles.selectorPillTextActive,
                  ]}
                >
                  ALERTS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.selectorPill, notifSubTab === 'SETTINGS' && styles.selectorPillActive]}
                onPress={() => setNotifSubTab('SETTINGS')}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    notifSubTab === 'SETTINGS' && styles.selectorPillTextActive,
                  ]}
                >
                  SETTINGS
                </Text>
              </TouchableOpacity>
            </View>

            {notifSubTab === 'ALERTS' ? (
              <View>
                <View style={styles.notifCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.notifTitleBold}>Ride approved</Text>
                    <Text style={styles.notifTimeText}>10 mins ago</Text>
                  </View>
                  <Text style={styles.notifSubText}>ACB-0482-2026 is approved.</Text>
                </View>

                <View style={styles.notifCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.notifTitleBold}>Cab assigned</Text>
                    <Text style={styles.notifTimeText}>25 mins ago</Text>
                  </View>
                  <Text style={styles.notifSubText}>
                    Rameshwar Kumar will pick you up at 06:00 AM.
                  </Text>
                </View>

                <View style={styles.notifCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.notifTitleBold}>Ride rejected</Text>
                    <Text style={styles.notifTimeText}>Yesterday</Text>
                  </View>
                  <Text style={styles.notifSubText}>Budget cap exceeded for Q2 client visit.</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text style={[styles.sectionHeaderTitle, { marginTop: 14 }]}>Send alerts on</Text>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNotifWhatsApp(!notifWhatsApp)}
                >
                  <Text style={styles.checkboxLabel}>WhatsApp</Text>
                  <View style={[styles.checkboxSquare, notifWhatsApp && styles.checkboxSquareChecked]}>
                    {notifWhatsApp && <Check size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNotifSMS(!notifSMS)}
                >
                  <Text style={styles.checkboxLabel}>SMS</Text>
                  <View style={[styles.checkboxSquare, notifSMS && styles.checkboxSquareChecked]}>
                    {notifSMS && <Check size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNotifApp(!notifApp)}
                >
                  <Text style={styles.checkboxLabel}>App</Text>
                  <View style={[styles.checkboxSquare, notifApp && styles.checkboxSquareChecked]}>
                    {notifApp && <Check size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>

                {/* Language */}
                <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Language</Text>
                <View style={styles.pillSelectorRow}>
                  <TouchableOpacity
                    style={[styles.selectorPill, language === 'HI' && styles.selectorPillActive]}
                    onPress={() => setLanguage('HI')}
                  >
                    <Text
                      style={[
                        styles.selectorPillText,
                        language === 'HI' && styles.selectorPillTextActive,
                      ]}
                    >
                      हिंदी
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.selectorPill, language === 'EN' && styles.selectorPillActive]}
                    onPress={() => setLanguage('EN')}
                  >
                    <Text
                      style={[
                        styles.selectorPillText,
                        language === 'EN' && styles.selectorPillTextActive,
                      ]}
                    >
                      ENGLISH
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ================= PAGE 12: OFFLINE MODE ================= */}
        {currentScreen === 'OFFLINE_MODE' && (
          <View>
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineBannerText}>
                No network. Your request will be sent when you are back online.
              </Text>
            </View>

            <View style={styles.upcomingTripCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.tripRouteText}>Office HQ to Darbhanga Junction</Text>
                <View style={[styles.statusBadgePill, styles.pillPending]}>
                  <Text style={[styles.statusBadgeText, { color: '#000000' }]}>SAVED ON PHONE</Text>
                </View>
              </View>
              <Text style={styles.tripDateTimeText}>
                2026-07-14 at 06:00 · Business Meeting
              </Text>
            </View>

            <TouchableOpacity
              style={styles.secondaryGrayBtn}
              onPress={() => setCurrentScreen('REQUEST_RIDE')}
            >
              <Text style={styles.secondaryGrayBtnText}>EDIT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBlackBtn}>
              <Text style={styles.primaryBlackBtnText}>WAITING FOR NETWORK...</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 13: SAFETY ================= */}
        {currentScreen === 'SAFETY' && (
          <View>
            <View style={styles.noticeBannerBox}>
              <Text style={styles.noticeBannerText}>
                Choose who gets your live trip link.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Trusted contact 1</Text>
            <TextInput
              style={styles.columnInput}
              value={trustedContact1}
              onChangeText={setTrustedContact1}
              placeholder="[Name, phone]"
              placeholderTextColor="#71717A"
            />

            <Text style={styles.fieldLabel}>Trusted contact 2</Text>
            <TextInput
              style={styles.columnInput}
              value={trustedContact2}
              onChangeText={setTrustedContact2}
              placeholder="[Name, phone]"
              placeholderTextColor="#71717A"
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAutoShareTrip(!autoShareTrip)}
            >
              <Text style={styles.checkboxLabel}>Share trip automatically at pickup</Text>
              <View style={[styles.checkboxSquare, autoShareTrip && styles.checkboxSquareChecked]}>
                {autoShareTrip && <Check size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setSosAlertAdmin(!sosAlertAdmin)}
            >
              <Text style={styles.checkboxLabel}>Alert company admin when SOS is pressed</Text>
              <View style={[styles.checkboxSquare, sosAlertAdmin && styles.checkboxSquareChecked]}>
                {sosAlertAdmin && <Check size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBlackBtn, { marginTop: 28 }]}
              onPress={() => {
                Alert.alert('Safety Preferences Saved', 'Emergency contacts and auto-tracking alerts updated.');
                setCurrentScreen('HOME');
              }}
            >
              <Text style={styles.primaryBlackBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      {currentScreen !== 'REVIEW_REQUEST' &&
        currentScreen !== 'TRIP_DETAILS' &&
        currentScreen !== 'DAILY_OFFICE_RIDE' &&
        currentScreen !== 'TRIP_IN_PROGRESS' &&
        currentScreen !== 'TRIP_COMPLETED' && (
        <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setCurrentScreen('HOME')}
        >
          <HomeIcon
            size={20}
            color={currentScreen === 'HOME' ? '#000000' : '#71717A'}
            strokeWidth={currentScreen === 'HOME' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              currentScreen === 'HOME' && styles.bottomNavTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setCurrentScreen('MY_TRIPS')}
        >
          <Calendar
            size={20}
            color={currentScreen === 'MY_TRIPS' ? '#000000' : '#71717A'}
            strokeWidth={currentScreen === 'MY_TRIPS' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              currentScreen === 'MY_TRIPS' && styles.bottomNavTextActive,
            ]}
          >
            My Trips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setCurrentScreen('ACCOUNT')}
        >
          <UserIcon
            size={20}
            color={currentScreen === 'ACCOUNT' ? '#000000' : '#71717A'}
            strokeWidth={currentScreen === 'ACCOUNT' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              currentScreen === 'ACCOUNT' && styles.bottomNavTextActive,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 24,
  },
  loginContent: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  loginBrandTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: -0.5,
  },
  loginBrandSubtitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    marginTop: -4,
  },
  loginSubDesc: {
    fontSize: 15,
    color: '#9CA3AF',
    fontFamily: 'Roboto',
    marginTop: 8,
    marginBottom: 40,
  },
  loginFormBox: {
    width: '100%',
  },
  inputLabelWhite: {
    fontSize: 13,
    color: '#E4E4E7',
    fontFamily: 'Roboto',
    fontWeight: '600',
    marginBottom: 8,
  },
  whiteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  loginBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  loginForgotText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto',
  },

  // Main Header
  topHeader: {
    backgroundColor: '#000000',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topHeaderLeft: {
    flex: 1,
  },
  companyNameHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Roboto',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  pageTitleHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  topNavPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Body
  scrollBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 36,
  },

  // Home Page Elements
  whereToBox: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
  },
  whereToTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  serviceTile: {
    width: '48%',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
  },
  serviceLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceLetterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  serviceNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
    marginBottom: 12,
  },
  upcomingTripCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripIdBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  tripRouteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  tripDateTimeText: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  companyBilledNoticeBox: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  companyBilledNoticeText: {
    fontSize: 13,
    color: '#52525B',
    fontFamily: 'Roboto',
  },

  // Pills and Badges
  statusBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  pillPending: {
    backgroundColor: '#FBBF24',
  },
  pillApproved: {
    backgroundColor: '#10B981',
  },
  pillCompleted: {
    backgroundColor: '#10B981',
  },
  pillRejected: {
    backgroundColor: '#DC2626',
  },

  // Request a Ride Form
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181B',
    fontFamily: 'Roboto',
    marginTop: 14,
    marginBottom: 6,
  },
  pillSelectorRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  selectorPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectorPillActive: {
    backgroundColor: '#000000',
  },
  selectorPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181B',
    fontFamily: 'Roboto',
  },
  selectorPillTextActive: {
    color: '#FFFFFF',
  },
  bookingTypeRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  bookingTypePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingTypePillActive: {
    backgroundColor: '#000000',
  },
  bookingTypePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Roboto',
  },
  bookingTypePillTextActive: {
    color: '#FFFFFF',
  },
  inputWithChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Roboto',
  },
  quickChipBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfColumn: {
    flex: 1,
  },
  columnInput: {
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Roboto',
  },

  // Primary and secondary buttons
  primaryBlackBtn: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  primaryBlackBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  secondaryGrayBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryGrayBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Review Page
  reviewRouteCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  routePointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  squareIconBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#000000',
  },
  circleIconBox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000000',
  },
  routePointText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  routePointBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  routePointSub: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  reviewDetailsTable: {
    marginBottom: 16,
  },
  tripDetailTable: {
    marginBottom: 0,
  },
  tripDetailTableRow: {
    paddingVertical: 16,
  },
  tripDetailTableLabel: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Roboto',
  },
  tripDetailTableValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  tripDetailTableDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tableRowLabel: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  tableRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  tableDivider: {
    height: 1,
    backgroundColor: '#F4F4F5',
  },
  reviewTableRowLabel: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Roboto',
  },
  reviewTableRowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  reviewTableDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  noticeBannerBox: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  reviewNoticeBanner: {
    marginBottom: 16,
  },
  reviewPrimaryButton: {
    marginTop: 0,
    paddingVertical: 18,
  },
  reviewSecondaryButton: {
    marginTop: 16,
    paddingVertical: 18,
  },
  reviewActionButtonText: {
    fontSize: 16,
  },
  noticeBannerText: {
    fontSize: 13,
    color: '#52525B',
    fontFamily: 'Roboto',
    lineHeight: 18,
  },

  // Filter Tabs in My Trips
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dailyRideShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F4F4F5',
    marginBottom: 16,
  },
  dailyRideShortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dailyRideShortcutCopy: {
    flex: 1,
  },
  dailyRideShortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#000000',
  },
  dailyRideShortcutSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: '#71717A',
    marginTop: 2,
  },
  filterTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
  },
  filterTabPillActive: {
    backgroundColor: '#000000',
  },
  filterTabPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  filterTabPillTextActive: {
    color: '#FFFFFF',
  },
  tripListItemCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cancelRequestBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelRequestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  cancelRequestBtnRed: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  cancelRequestBtnRedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF1A0A',
    fontFamily: 'Roboto',
  },
  assignedNoticeText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 10,
  },
  startTripButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  startTripButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.35,
  },
  downloadInvoiceBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  downloadInvoiceBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Progress Steps
  stepProgressContainer: {
    gap: 16,
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBullet: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stepBulletFilled: {
    backgroundColor: '#000000',
  },
  stepBulletOutline: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  detailStepText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Account Page
  accountProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  accountName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  accountIdText: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  savedPlacesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  savedPlaceChip: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  savedPlaceChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  savedPlaceChipAdd: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  savedPlaceChipAddText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  toggleSettingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  toggleSettingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  logoutBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Daily Ride Page
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#000000',
  },
  dayCircleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Roboto',
  },
  dayCircleTextActive: {
    color: '#FFFFFF',
  },

  // Live Map & Trip in Progress
  liveMapMockArea: {
    height: 220,
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapGridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
    borderWidth: 1,
    borderColor: '#D4D4D8',
  },
  liveMapCenterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52525B',
    fontFamily: 'Roboto',
  },
  otpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  otpLabel: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  otpValueDigits: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
    letterSpacing: 2,
  },
  arrivingBadgePill: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  arrivingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  driverInfoCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  driverNameBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  cabDetailsSub: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  sosButton: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  sosButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  // Trip Completed
  completedFareCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  completedFareAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  completedFareSub: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 4,
  },
  rateRideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  starChar: {
    fontSize: 28,
  },
  starFilled: {
    color: '#000000',
  },
  starEmpty: {
    color: '#D4D4D8',
  },

  // Notifications
  notifCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  notifTitleBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  notifTimeText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  notifSubText: {
    fontSize: 13,
    color: '#52525B',
    fontFamily: 'Roboto',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#18181B',
    fontFamily: 'Roboto',
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquareChecked: {
    backgroundColor: '#000000',
  },

  // Offline Banner
  offlineBanner: {
    backgroundColor: '#FBBF24',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  offlineBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Roboto',
    lineHeight: 18,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 4,
  },
  bottomNavTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
});
