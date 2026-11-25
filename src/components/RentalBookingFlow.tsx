import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Minus,
  Home,
  Wallet,
  User,
} from 'lucide-react-native';

interface RentalBookingFlowProps {
  onClose: () => void;
  onConfirmRental?: (pkg: string, fare: number) => void;
}
import BottomNavBar from './BottomNavBar';

const RENTAL_PACKAGES = [
  { id: 'p1', hours: 4, km: 40, price: 49, displayPrice: '$49', title: '4 Hours Pack' },
  { id: 'p2', hours: 8, km: 80, price: 89, displayPrice: '$89', title: '8 Hours Pack' },
  { id: 'p3', hours: 12, km: 120, price: 129, displayPrice: '$129', title: '12 Hours Pack' },
  { id: 'p4', hours: 15, km: 150, price: 159, displayPrice: '$159', title: '15 Hours Pack' },
];

export default function RentalBookingFlow({
  onClose,
  onConfirmRental,
}: RentalBookingFlowProps) {
  const [activeTab, setActiveTab] = useState<'PACKAGE' | 'DAILY'>('PACKAGE');
  const [selectedPkgId, setSelectedPkgId] = useState('p1');
  const [pickupDate, setPickupDate] = useState('14-10-2026');
  const [pickupTime, setPickupTime] = useState('12:00');
  const [dailyDays, setDailyDays] = useState(1);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const calculateUntilDate = (days: number) => {
    const d = 14 + days;
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    return `2026-10-${dayStr}`;
  };

  const calculateDropDate = (days: number) => {
    const d = 14 + days;
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    return `${dayStr}-10-2026`;
  };

  const handleSelectPackage = (pkg: typeof RENTAL_PACKAGES[0]) => {
    setSelectedPkgId(pkg.id);
    if (onConfirmRental) {
      onConfirmRental(pkg.title, pkg.price);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RENTAL BOOKING</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section 1: PICKUP LOCATION */}
        <Text style={styles.sectionLabel}>PICKUP LOCATION</Text>
        <View style={styles.locationCard}>
          <View style={styles.targetDotOuter}>
            <View style={styles.targetDotInner} />
          </View>
          <View style={styles.locationTextCol}>
            <Text style={styles.locationTitle}>Saharsa, Bihar</Text>
            <Text style={styles.locationSubtitle}>
              Saharsa Junction, Saharsa, Bihar, 852201
            </Text>
          </View>
        </View>

        {/* Section 2: BY PACKAGE / DAILY RENTAL Tabs */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'PACKAGE' && styles.activeTabPill]}
            onPress={() => setActiveTab('PACKAGE')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'PACKAGE' && styles.activeTabText,
              ]}
            >
              BY PACKAGE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'DAILY' && styles.activeTabPill]}
            onPress={() => setActiveTab('DAILY')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'DAILY' && styles.activeTabText,
              ]}
            >
              DAILY RENTAL
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: PICKUP DATE & PICKUP TIME */}
        <View style={styles.dateTimeRow}>
          {/* Pickup Date Column */}
          <View style={styles.dateTimeCol}>
            <Text style={styles.sectionLabel}>PICKUP DATE</Text>
            <TouchableOpacity
              style={styles.dateTimeInputBox}
              onPress={() => setIsEditingDate(!isEditingDate)}
              activeOpacity={0.85}
            >
              <Calendar size={16} color="#84CC16" strokeWidth={2.2} />
              {isEditingDate ? (
                <TextInput
                  style={styles.dateTimeTextInput}
                  value={pickupDate}
                  onChangeText={setPickupDate}
                  autoFocus
                  onBlur={() => setIsEditingDate(false)}
                />
              ) : (
                <Text style={styles.dateTimeValueText}>{pickupDate}</Text>
              )}
              <Calendar size={15} color="#64748B" strokeWidth={1.8} />
            </TouchableOpacity>
          </View>

          {/* Pickup Time Column */}
          <View style={styles.dateTimeCol}>
            <Text style={styles.sectionLabel}>PICKUP TIME</Text>
            <TouchableOpacity
              style={styles.dateTimeInputBox}
              onPress={() => setIsEditingTime(!isEditingTime)}
              activeOpacity={0.85}
            >
              <Clock size={16} color="#84CC16" strokeWidth={2.2} />
              {isEditingTime ? (
                <TextInput
                  style={styles.dateTimeTextInput}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                  autoFocus
                  onBlur={() => setIsEditingTime(false)}
                />
              ) : (
                <Text style={styles.dateTimeValueText}>{pickupTime}</Text>
              )}
              <Clock size={15} color="#64748B" strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'PACKAGE' ? (
          <>
            {/* Section 4: SELECT PACKAGE */}
            <Text style={styles.sectionLabel}>SELECT PACKAGE</Text>
            <View style={styles.packageGrid}>
              {RENTAL_PACKAGES.map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;

                return (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[
                      styles.packageCard,
                      isSelected && styles.packageCardSelected,
                    ]}
                    onPress={() => handleSelectPackage(pkg)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.pkgTitle}>{pkg.title}</Text>
                    <Text style={styles.pkgKmText}>{pkg.km} km included</Text>
                    <View style={styles.pkgPriceRow}>
                      <Text style={styles.pkgPriceVal}>{pkg.displayPrice}</Text>
                      <Text style={styles.pkgStartingText}>starting</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          /* DAILY RENTAL CARD */
          <View style={styles.dailyRentalCard}>
            {/* Top Section: Duration & Stepper */}
            <Text style={styles.sectionLabel}>RENTAL DURATION</Text>
            <View style={styles.durationRow}>
              <View>
                <Text style={styles.durationMainText}>
                  {dailyDays} {dailyDays === 1 ? 'Day' : 'Days'}
                </Text>
                <Text style={styles.durationUntilText}>
                  Until {calculateUntilDate(dailyDays)}
                </Text>
              </View>

              {/* Stepper Capsule */}
              <View style={styles.stepperCapsule}>
                <TouchableOpacity
                  style={styles.stepperCircleBtn}
                  onPress={() => setDailyDays((d) => Math.max(1, d - 1))}
                  activeOpacity={0.7}
                >
                  <Minus size={14} color="#0F172A" strokeWidth={2.6} />
                </TouchableOpacity>

                <Text style={styles.stepperCountText}>{dailyDays}</Text>

                <TouchableOpacity
                  style={styles.stepperCircleBtn}
                  onPress={() => setDailyDays((d) => d + 1)}
                  activeOpacity={0.7}
                >
                  <Plus size={14} color="#0F172A" strokeWidth={2.6} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider Line */}
            <View style={styles.cardDivider} />

            {/* Bottom Section: DROP DATE & DROP TIME */}
            <View style={styles.dropDateTimeRow}>
              {/* Drop Date */}
              <View style={styles.dropDateTimeCol}>
                <Text style={styles.dropSectionLabel}>DROP DATE</Text>
                <View style={styles.dropInputBox}>
                  <Calendar size={16} color="#84CC16" strokeWidth={2.2} />
                  <Text style={styles.dropValueText}>{calculateDropDate(dailyDays)}</Text>
                  <Calendar size={15} color="#94A3B8" strokeWidth={1.8} />
                </View>
              </View>

              {/* Drop Time */}
              <View style={styles.dropDateTimeCol}>
                <Text style={styles.dropSectionLabel}>DROP TIME</Text>
                <View style={styles.dropInputBox}>
                  <Clock size={16} color="#84CC16" strokeWidth={2.2} />
                  <Text style={styles.dropValueText}>{pickupTime}</Text>
                  <Clock size={15} color="#94A3B8" strokeWidth={1.8} />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Docked Bottom Navigation Bar matching screenshot */}
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
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    backgroundColor: '#F7F9F5',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 95,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  locationCard: {
    backgroundColor: '#EFF3EA',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  targetDotOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#84CC16',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#84CC16',
  },
  locationTextCol: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  locationSubtitle: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#EFF3EA',
    borderRadius: 24,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  activeTabPill: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '800',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  dateTimeCol: {
    flex: 1,
  },
  dateTimeInputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeValueText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  dateTimeTextInput: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    padding: 0,
    margin: 0,
    minWidth: 60,
    textAlign: 'center',
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  packageCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  packageCardSelected: {
    backgroundColor: '#FFFDF5',
    borderColor: '#84CC16',
    borderWidth: 1.5,
  },
  pkgTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  pkgKmText: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 3,
    marginBottom: 8,
  },
  pkgPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  pkgPriceVal: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#EA580C',
  },
  pkgStartingText: {
    fontSize: 10.5,
    fontFamily: 'Roboto',
    color: '#94A3B8',
  },
  dailyRentalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 20,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  durationMainText: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  durationUntilText: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#94A3B8',
    marginTop: 2,
  },
  stepperCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF3EA',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepperCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  stepperCountText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    minWidth: 16,
    textAlign: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  dropDateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropDateTimeCol: {
    flex: 1,
  },
  dropSectionLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dropInputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropValueText: {
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
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
});
