import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Calendar,
  Download,
  RefreshCw,
  Package,
  Inbox,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react-native';
import { brandColors } from '../theme';
import { Ride, ParcelOrder } from '../types';
import BottomNavBar from './BottomNavBar';

interface RideHistoryProps {
  rides: Ride[];
  parcels?: ParcelOrder[];
  initialTab?: 'Rides' | 'Parcel';
  onClose: () => void;
  onRebook?: (ride: Ride) => void;
  onBookParcel?: () => void;
  onBookRide: () => void;
  onUpcomingRides: () => void;
  onScheduleRide: () => void;
}

const MOCK_PAST_RIDES: Ride[] = [
  {
    id: 'ride_100',
    userId: 'user_1',
    userName: 'User',
    pickup: {
      id: 'p0',
      name: 'Naya Bazar, Saharsa',
      address: 'Naya Bazar, Saharsa, Bihar 852201',
      lat: 25.8824,
      lng: 86.5986,
    },
    dropoff: {
      id: 'd0',
      name: 'Sheikhpura, Patna',
      address: 'Sheikhpura, Patna, Bihar, 800014, India',
      lat: 25.6093,
      lng: 85.1376,
    },
    vehicleClass: 'Prime Sedan',
    fare: 2150,
    paymentMethod: 'UPI',
    status: 'CANCELLED',
    driverId: null,
    createdAt: 'Yesterday 05:10 PM',
  },
  {
    id: 'ride_101',
    userId: 'user_1',
    userName: 'User',
    pickup: {
      id: 'p1',
      name: 'Stadium Road, Saharsa',
      address: 'Stadium Road, Saharsa, Bihar',
      lat: 25.8824,
      lng: 86.5986,
    },
    dropoff: {
      id: 'd1',
      name: 'Patna Junction Railway Station',
      address: 'Station Road, Patna, Bihar',
      lat: 25.6093,
      lng: 85.1376,
    },
    vehicleClass: 'Prime Sedan',
    fare: 2499,
    paymentMethod: 'AOLO Wallet',
    status: 'COMPLETED',
    driverId: 'drv_1',
    createdAt: '25 Sep 2026, 03:00 PM',
  },
  {
    id: 'ride_102',
    userId: 'user_1',
    userName: 'User',
    pickup: {
      id: 'p2',
      name: 'Patna Airport',
      address: 'Patna Airport, Bihar',
      lat: 25.5913,
      lng: 85.0880,
    },
    dropoff: {
      id: 'd2',
      name: 'Darbhanga Hub',
      address: 'Darbhanga, Bihar',
      lat: 26.1542,
      lng: 85.8918,
    },
    vehicleClass: 'AOLO Compact',
    fare: 1499,
    paymentMethod: 'UPI (GPay)',
    status: 'COMPLETED',
    driverId: 'drv_2',
    createdAt: '22 Sep 2026, 11:15 AM',
  },
];

const MOCK_PARCEL_ORDERS: ParcelOrder[] = [
  {
    id: 'pcl_101',
    type: 'SEND',
    senderAddress: 'Naya Bazar, Saharsa, Bihar 852201',
    recipientAddress: 'Sheikhpura, Patna, Bihar, 800014, India',
    senderPhone: '+91 98765 43210',
    recipientPhone: '+91 91234 56789',
    packageDescription: 'Documents & Certificates',
    fare: 85,
    status: 'DELIVERED',
    createdAt: 'Today 02:30 PM',
  },
  {
    id: 'pcl_102',
    type: 'RECEIVE',
    senderAddress: 'Station Road, Patna Junction, Bihar',
    recipientAddress: 'Zila School, Saharsa, Bihar 852201',
    senderPhone: '+91 94312 88765',
    recipientPhone: '+91 98765 43210',
    packageDescription: 'Electronics Accessories',
    fare: 120,
    status: 'CANCELLED',
    createdAt: 'Yesterday 11:15 AM',
  },
];

export default function RideHistory({
  rides,
  parcels = [],
  initialTab = 'Rides',
  onClose,
  onRebook,
  onBookParcel,
  onBookRide,
  onUpcomingRides,
  onScheduleRide,
}: RideHistoryProps) {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);
  const [activeMainTab, setActiveMainTab] = useState<'Rides' | 'Parcel'>(initialTab);

  // Combine dynamic rides with mock if empty
  const allRides = rides.length > 0 ? [...rides, ...MOCK_PAST_RIDES] : MOCK_PAST_RIDES;
  const allParcels = parcels.length > 0 ? [...parcels, ...MOCK_PARCEL_ORDERS] : MOCK_PARCEL_ORDERS;

  const handleInvoice = (ride: Ride) => {
    Alert.alert(
      'Invoice Downloaded',
      `Tax invoice for booking #${ride.id.replace('ride_', 'A0L0')} (₹${ride.fare.toLocaleString('en-IN')}) has been downloaded.`,
      [{ text: 'OK' }]
    );
  };

  const handleRebook = (ride: Ride) => {
    if (onRebook) {
      onRebook(ride);
    } else {
      Alert.alert(
        'Rebook Ride',
        `Rebooking from ${ride.pickup.name} to ${ride.dropoff.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Proceed', onPress: onClose },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Matching Screenshot 4 */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* Two Main Tabs Matching Screenshot 4: "Rides" | "Parcel" */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeMainTab === 'Rides' && styles.tabItemActive]}
          onPress={() => setActiveMainTab('Rides')}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabLabel, activeMainTab === 'Rides' && styles.tabLabelActive]}
          >
            Rides
          </Text>
          {activeMainTab === 'Rides' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeMainTab === 'Parcel' && styles.tabItemActive]}
          onPress={() => setActiveMainTab('Parcel')}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabLabel, activeMainTab === 'Parcel' && styles.tabLabelActive]}
          >
            Parcel
          </Text>
          {activeMainTab === 'Parcel' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

      </View>

      <View style={styles.rideQuickActions}>
        <TouchableOpacity
          style={styles.quickActionGlassButton}
          onPress={onBookRide}
          activeOpacity={0.8}
        >
          <Plus size={15} color="#3F6212" strokeWidth={2.8} />
          <Text style={styles.quickActionGlassText}>Book a Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionGlassButton}
          onPress={onUpcomingRides}
          activeOpacity={0.8}
        >
          <Clock size={15} color="#3F6212" strokeWidth={2.4} />
          <Text style={styles.quickActionGlassText}>Upcoming Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionGlassButton}
          onPress={onScheduleRide}
          activeOpacity={0.8}
        >
          <Calendar size={15} color="#3F6212" strokeWidth={2.4} />
          <Text style={styles.quickActionGlassText}>Schedule Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeMainTab === 'Rides' ? (
          allRides.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Inbox size={44} color="#94A3B8" />
              <Text style={styles.emptyTitle}>NO RIDES YET</Text>
              <Text style={styles.emptySubtitle}>You haven&apos;t completed any rides yet.</Text>
            </View>
          ) : (
            allRides.map((ride, index) => {
              const isCancelled = (ride.status || '').toUpperCase() === 'CANCELLED';
              const isCompleted = (ride.status || '').toUpperCase() === 'COMPLETED';

              return (
                <View key={ride.id + index} style={styles.historyRow}>
                  <Text style={styles.rowTimestamp}>{ride.createdAt}</Text>

                  <Text style={styles.rowTitle}>
                    {ride.vehicleClass.replace('AOLO ', '')} to
                  </Text>

                  <Text style={styles.rowAddress} numberOfLines={2}>
                    {ride.dropoff?.address || ride.dropoff?.name}
                  </Text>

                  <View style={styles.rowBottom}>
                    <View
                      style={[
                        styles.statusBadge,
                        isCancelled ? styles.statusBadgeCancelled : styles.statusBadgeCompleted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isCancelled ? styles.statusTextCancelled : styles.statusTextCompleted,
                        ]}
                      >
                        {ride.status.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.outlineActionBtn}
                        onPress={() => handleInvoice(ride)}
                        activeOpacity={0.7}
                      >
                        <Download size={13} color="#475569" />
                        <Text style={styles.outlineActionText}>Invoice</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.outlineActionBtn}
                        onPress={() => handleRebook(ride)}
                        activeOpacity={0.7}
                      >
                        <RefreshCw size={13} color="#475569" />
                        <Text style={styles.outlineActionText}>Rebook</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )
        ) : (
          allParcels.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Package size={44} color="#94A3B8" />
              <Text style={styles.emptyTitle}>NO PARCEL BOOKINGS</Text>
              <Text style={styles.emptySubtitle}>You haven&apos;t sent or received any parcels yet.</Text>
              {onBookParcel && (
                <TouchableOpacity
                  style={styles.bookParcelEmptyBtn}
                  onPress={onBookParcel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bookParcelEmptyBtnText}>Send a Parcel Now</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            allParcels.map((parcel, index) => {
              const isCancelled = parcel.status === 'CANCELLED';
              const isDelivered = parcel.status === 'DELIVERED';

              return (
                <View key={parcel.id + index} style={styles.historyRow}>
                  <Text style={styles.rowTimestamp}>{parcel.createdAt}</Text>

                  <Text style={styles.rowTitle}>
                    {parcel.type === 'SEND' ? 'Send Parcel' : 'Receive Parcel'} to
                  </Text>

                  <Text style={styles.rowAddress} numberOfLines={2}>
                    {parcel.recipientAddress}
                  </Text>

                  <View style={styles.rowBottom}>
                    <View
                      style={[
                        styles.statusBadge,
                        isCancelled
                          ? styles.statusBadgeCancelled
                          : isDelivered
                          ? styles.statusBadgeCompleted
                          : styles.statusBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isCancelled
                            ? styles.statusTextCancelled
                            : isDelivered
                            ? styles.statusTextCompleted
                            : styles.statusTextActive,
                        ]}
                      >
                        {parcel.status.replace('_', ' ')}
                      </Text>
                    </View>

                    <Text style={styles.parcelFareText}>₹{parcel.fare}</Text>
                  </View>
                </View>
              );
            })
          )
        )}
      </ScrollView>

      <BottomNavBar activeTab="bookings" />
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
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    marginRight: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 28,
    position: 'relative',
  },
  tabItemActive: {},
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#000000',
    fontWeight: '700',
  },
  rideQuickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  quickActionGlassButton: {
    flex: 1,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#ECFCCB',
    borderWidth: 1,
    borderColor: '#84CC16',
    shadowColor: '#65A30D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionGlassText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#3F6212',
    flexShrink: 1,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  historyRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowTimestamp: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 4,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 3,
  },
  rowAddress: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeCancelled: {
    backgroundColor: '#E2E8F0',
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeActive: {
    backgroundColor: '#FEF9C3',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusTextCancelled: {
    color: '#475569',
  },
  statusTextCompleted: {
    color: '#166534',
  },
  statusTextActive: {
    color: '#854D0E',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  outlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  outlineActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  parcelFareText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  bookParcelEmptyBtn: {
    marginTop: 16,
    backgroundColor: '#84CC16',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookParcelEmptyBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 13,
  },
});
