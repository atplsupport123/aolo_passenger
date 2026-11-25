import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, X } from 'lucide-react-native';

interface RideScheduleModalProps {
  onClose: () => void;
  onScheduleNewRide?: () => void;
}

export default function RideScheduleModal({
  onClose,
  onScheduleNewRide,
}: RideScheduleModalProps) {
  const insets = useSafeAreaInsets();

  const handleScheduleNew = () => {
    onClose();
    if (onScheduleNewRide) {
      onScheduleNewRide();
    }
  };

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
              <Clock size={20} color="#5BB824" strokeWidth={2.2} />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>RIDE SCHEDULE</Text>
              <Text style={styles.headerSubtitle}>MANAGE FUTURE BOOKINGS</Text>
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
        <View style={styles.body}>
          {/* Upcoming Scheduled Ride Card */}
          <View style={styles.scheduledCard}>
            <View style={styles.clockIconBox}>
              <Clock size={16} color="#78350F" strokeWidth={2.2} />
            </View>

            <View style={styles.scheduledInfo}>
              <Text style={styles.cardHeading}>Upcoming Scheduled Ride</Text>
              <Text style={styles.routeText}>
                Patna Airport <Text style={styles.arrowText}>➔</Text> Saharsa Junction
              </Text>
              <Text style={styles.timeStatusText}>
                Tomorrow, 08:30 AM <Text style={styles.dotSeparator}>•</Text> Confirmed
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText}>
            Need to catch an early flight or meeting? Use the calendar scheduler on the booking screen to plan rides up to 30 days in advance!
          </Text>

          {/* Schedule A New Ride Button */}
          <TouchableOpacity
            style={styles.scheduleBtn}
            onPress={handleScheduleNew}
            activeOpacity={0.85}
          >
            <Text style={styles.scheduleBtnText}>SCHEDULE A NEW RIDE</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
    paddingBottom: 8,
  },
  scheduledCard: {
    backgroundColor: '#FFFEF5',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  clockIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  scheduledInfo: {
    flex: 1,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  arrowText: {
    color: '#64748B',
    fontWeight: '900',
  },
  timeStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  dotSeparator: {
    color: '#D97706',
  },
  descriptionText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
    marginBottom: 22,
  },
  scheduleBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#0F172A',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
});
