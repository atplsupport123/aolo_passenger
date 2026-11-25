import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, X } from 'lucide-react-native';

interface FavouriteDriversModalProps {
  onClose: () => void;
}

interface FavouriteDriverItem {
  id: string;
  name: string;
  rating: string;
  carModel: string;
  carPlate: string;
  ridesCompleted: number;
  status: 'ACTIVE' | 'OFFLINE';
  avatarEmoji: string;
}

const FAVOURITE_DRIVERS_LIST: FavouriteDriverItem[] = [
  {
    id: 'fd_1',
    name: 'Suresh Kumar',
    rating: '4.9',
    carModel: 'White Swift Dzire',
    carPlate: 'BR43-A-1024',
    ridesCompleted: 342,
    status: 'ACTIVE',
    avatarEmoji: '👨‍✈️',
  },
  {
    id: 'fd_2',
    name: 'Rahul Singh',
    rating: '4.8',
    carModel: 'Silver Ertiga',
    carPlate: 'BR01-P-7300',
    ridesCompleted: 189,
    status: 'OFFLINE',
    avatarEmoji: '👨‍✈️',
  },
];

export default function FavouriteDriversModal({ onClose }: FavouriteDriversModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Modal Card */}
      <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Heart size={20} color="#5BB824" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>FAVOURITE DRIVERS</Text>
              <Text style={styles.headerSubtitle}>PREFERRED DRIVER BOOKINGS</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <X size={18} color="#71717A" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Body Content */}
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {FAVOURITE_DRIVERS_LIST.map((driver) => (
            <View key={driver.id} style={styles.driverCard}>
              <View style={styles.driverLeft}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>{driver.avatarEmoji}</Text>
                </View>

                <View style={styles.driverInfo}>
                  <View style={styles.nameRatingRow}>
                    <Text style={styles.driverName}>{driver.name}</Text>
                    <Text style={styles.ratingText}>
                      {driver.rating} <Text style={styles.starIcon}>★</Text>
                    </Text>
                  </View>

                  <Text style={styles.carDetails}>
                    {driver.carModel} ({driver.carPlate})
                  </Text>

                  <Text style={styles.ridesText}>
                    {driver.ridesCompleted} rides completed
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  driver.status === 'ACTIVE'
                    ? styles.statusBadgeActive
                    : styles.statusBadgeOffline,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    driver.status === 'ACTIVE'
                      ? styles.statusTextActive
                      : styles.statusTextOffline,
                  ]}
                >
                  {driver.status === 'ACTIVE' ? 'Active Now' : 'Offline'}
                </Text>
              </View>
            </View>
          ))}

          {/* Bottom Notice */}
          <Text style={styles.footerNotice}>
            SAVE DRIVERS TO YOUR FAVORITES LIST AT THE END OF ANY RIDE RATING SCREEN!
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A9184',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  driverCard: {
    backgroundColor: '#F4F8F2',
    borderWidth: 1,
    borderColor: '#E2ECE0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  driverInfo: {
    flex: 1,
  },
  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F59E0B',
    fontFamily: 'Roboto',
  },
  starIcon: {
    color: '#F59E0B',
    fontSize: 12,
  },
  carDetails: {
    fontSize: 11.5,
    color: '#8A9184',
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  ridesText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  statusBadge: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusBadgeOffline: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  statusTextActive: {
    color: '#059669',
  },
  statusTextOffline: {
    color: '#64748B',
  },
  footerNotice: {
    color: '#8A9184',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
});
