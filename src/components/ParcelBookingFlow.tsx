import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  X,
  MapPin,
  ArrowUpDown,
  User,
  Package,
  Send,
  Inbox,
  Wallet,
  CreditCard,
  Banknote,
  Home,
  Calendar,
} from 'lucide-react-native';
import { ParcelOrder } from '../types';
import BottomNavBar from './BottomNavBar';

interface ParcelBookingFlowProps {
  onClose: () => void;
  onOpenHistory?: () => void;
  onConfirmParcel?: (parcel: ParcelOrder) => void;
}

interface PackageTypeItem {
  id: string;
  name: string;
  icon: string;
}

interface WeightBracket {
  id: string;
  weight: string;
  desc: string;
  priceText: string;
  extraFare: number;
}

interface DeliveryVehicle {
  id: string;
  name: string;
  badge?: string;
  eta: string;
  desc: string;
  fare: number;
  subFare: string;
  iconEmoji: string;
}

const PACKAGE_TYPES: PackageTypeItem[] = [
  { id: 't1', name: 'Documents &\nBooks', icon: '📄' },
  { id: 't2', name: 'Tiffin & Food', icon: '🍱' },
  { id: 't3', name: 'Medicine &\nHealth', icon: '💊' },
  { id: 't4', name: 'Electronics', icon: '📱' },
  { id: 't5', name: 'Clothes &\nApparel', icon: '👕' },
  { id: 't6', name: 'Other Packages', icon: '📦' },
];

const WEIGHT_BRACKETS: WeightBracket[] = [
  { id: 'w1', weight: 'Up to 2 kg', desc: 'Standard / Light', priceText: 'Included', extraFare: 0 },
  { id: 'w2', weight: '2 - 5 kg', desc: 'Medium Box', priceText: '+ ₹25', extraFare: 25 },
  { id: 'w3', weight: '5 - 15 kg', desc: 'Heavy / Bulky', priceText: '+ ₹60', extraFare: 60 },
];

const DELIVERY_VEHICLES: DeliveryVehicle[] = [
  {
    id: 'v1',
    name: 'Bike Courier',
    badge: 'FASTEST',
    eta: 'ETA: 12-15 mins',
    desc: 'Swift city delivery',
    fare: 49,
    subFare: 'Instant',
    iconEmoji: '🛵',
  },
  {
    id: 'v2',
    name: 'E-Rickshaw / Auto',
    eta: 'ETA: 20-25 mins',
    desc: 'Best for boxes & tiffins',
    fare: 89,
    subFare: 'Eco Saver',
    iconEmoji: '🛺',
  },
  {
    id: 'v3',
    name: 'Cab Parcel',
    eta: 'ETA: 18-22 mins',
    desc: 'Weatherproof AC Trunk',
    fare: 149,
    subFare: 'Premium',
    iconEmoji: '🚗',
  },
];

export default function ParcelBookingFlow({
  onClose,
  onOpenHistory,
  onConfirmParcel,
}: ParcelBookingFlowProps) {
  const [parcelMode, setParcelMode] = useState<'SEND' | 'RECEIVE'>('SEND');
  const [pickupAddress, setPickupAddress] = useState('Saharsa Junction, Saharsa, Bihar, 852201');
  const [dropAddress, setDropAddress] = useState('Terminal 2, Airport Bypass Rd');
  const [receiverName, setReceiverName] = useState('Yuvraj Singh (Friend)');
  const [receiverPhone, setReceiverPhone] = useState('+91 98765 43210');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [selectedType, setSelectedType] = useState('t1');
  const [selectedWeight, setSelectedWeight] = useState('w1');
  const [selectedVehicle, setSelectedVehicle] = useState('v1');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'UPI' | 'HANDOVER'>('WALLET');

  const activeVehicle = DELIVERY_VEHICLES.find((v) => v.id === selectedVehicle) || DELIVERY_VEHICLES[0];
  const activeWeight = WEIGHT_BRACKETS.find((w) => w.id === selectedWeight) || WEIGHT_BRACKETS[0];
  const totalFare = activeVehicle.fare + activeWeight.extraFare;

  const handleSwapAddresses = () => {
    setPickupAddress(dropAddress);
    setDropAddress(pickupAddress);
  };

  const handleBookDelivery = () => {
    const selectedPkg = PACKAGE_TYPES.find((p) => p.id === selectedType)?.name.replace('\n', ' ') || 'Parcel Item';
    const newParcel: ParcelOrder = {
      id: 'pcl_' + Math.random().toString(36).substring(2, 9),
      type: parcelMode,
      senderAddress: pickupAddress,
      recipientAddress: dropAddress,
      senderPhone: '+91 98123 45678',
      recipientPhone: receiverPhone,
      packageDescription: `${selectedPkg} (${activeWeight.weight}) via ${activeVehicle.name}`,
      fare: totalFare,
      status: 'IN_TRANSIT',
      createdAt: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (onConfirmParcel) {
      onConfirmParcel(newParcel);
    }

    Alert.alert(
      'Parcel Delivery Confirmed!',
      `Your ${activeVehicle.name} has been dispatched.\n\nPickup PIN: 4829\nDrop PIN: 7193\nTotal Fare: ₹${totalFare}`,
      [
        {
          text: 'View in History',
          onPress: () => {
            onClose();
            if (onOpenHistory) onOpenHistory();
          },
        },
        {
          text: 'OK',
          onPress: onClose,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header matching screenshot */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.headerBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Package size={18} color="#10B981" strokeWidth={2.4} />
            <Text style={styles.headerTitle}>PARCEL DELIVERY</Text>
          </View>
          <Text style={styles.headerSubtitle}>Instant City Courier • PIN Verified</Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={styles.headerBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={20} color="#64748B" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Toggle Bar: [ ↗ SEND A PARCEL ] | [ 📥 RECEIVE A PARCEL ] */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.togglePill,
              parcelMode === 'SEND' && styles.activeTogglePill,
            ]}
            onPress={() => setParcelMode('SEND')}
            activeOpacity={0.8}
          >
            <Send
              size={14}
              color={parcelMode === 'SEND' ? '#10B981' : '#64748B'}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.toggleText,
                parcelMode === 'SEND' && styles.activeToggleText,
              ]}
            >
              SEND A PARCEL
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.togglePill,
              parcelMode === 'RECEIVE' && styles.activeTogglePill,
            ]}
            onPress={() => setParcelMode('RECEIVE')}
            activeOpacity={0.8}
          >
            <Inbox
              size={14}
              color={parcelMode === 'RECEIVE' ? '#10B981' : '#64748B'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.toggleText,
                parcelMode === 'RECEIVE' && styles.activeToggleText,
              ]}
            >
              RECEIVE A PARCEL
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 1: PICKUP & DESTINATION ADDRESS */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <MapPin size={16} color="#10B981" strokeWidth={2.2} />
              <Text style={styles.cardHeaderTitle}>PICKUP & DESTINATION ADDRESS</Text>
            </View>
            <TouchableOpacity
              style={styles.swapBtn}
              onPress={handleSwapAddresses}
              activeOpacity={0.7}
            >
              <ArrowUpDown size={13} color="#64748B" strokeWidth={2.2} />
              <Text style={styles.swapBtnText}>SWAP</Text>
            </TouchableOpacity>
          </View>

          {/* Pickup Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputSubLabel}>PICKUP ADDRESS (YOUR LOCATION / SENDER)</Text>
            <View style={styles.addressPill}>
              <View style={[styles.dotMarker, { backgroundColor: '#10B981' }]} />
              <TextInput
                style={styles.addressInputText}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="Enter pickup address"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Drop Address */}
          <View style={[styles.inputGroup, { marginTop: 10 }]}>
            <Text style={styles.inputSubLabel}>DROP ADDRESS (RECEIVER LOCATION)</Text>
            <View style={styles.addressPill}>
              <View style={[styles.dotMarker, { backgroundColor: '#EF4444' }]} />
              <TextInput
                style={styles.addressInputText}
                value={dropAddress}
                onChangeText={setDropAddress}
                placeholder="Enter drop address"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Card 2: RECEIVER CONTACT DETAILS */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <User size={16} color="#10B981" strokeWidth={2.2} />
              <Text style={styles.cardHeaderTitle}>RECEIVER CONTACT DETAILS</Text>
            </View>
          </View>

          {/* Contact Name & Mobile Number */}
          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.inputSubLabel}>CONTACT NAME</Text>
              <View style={styles.compactInputBox}>
                <TextInput
                  style={styles.compactInput}
                  value={receiverName}
                  onChangeText={setReceiverName}
                  placeholder="Receiver name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.inputSubLabel}>MOBILE NUMBER</Text>
              <View style={styles.compactInputBox}>
                <TextInput
                  style={styles.compactInput}
                  value={receiverPhone}
                  onChangeText={setReceiverPhone}
                  placeholder="+91..."
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Delivery Instructions */}
          <View style={[styles.inputGroup, { marginTop: 10 }]}>
            <Text style={styles.inputSubLabel}>DELIVERY INSTRUCTIONS (OPTIONAL)</Text>
            <View style={styles.compactInputBox}>
              <TextInput
                style={styles.compactInput}
                value={deliveryInstructions}
                onChangeText={setDeliveryInstructions}
                placeholder="e.g. Fragile item, call before ring, leave at reception"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Card 3: PACKAGE ITEM TYPE */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>PACKAGE ITEM TYPE</Text>
            <Text style={styles.requiredTag}>REQUIRED</Text>
          </View>

          <View style={styles.typesGrid}>
            {PACKAGE_TYPES.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.typeCard,
                    isSelected && styles.typeCardSelected,
                  ]}
                  onPress={() => setSelectedType(item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.typeIconEmoji}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.typeCardName,
                      isSelected && styles.typeCardNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 4: APPROXIMATE WEIGHT BRACKET */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>APPROXIMATE WEIGHT BRACKET</Text>
          <Text style={styles.dynamicPricingTag}>DYNAMIC PRICING</Text>
        </View>

        <View style={styles.weightGrid}>
          {WEIGHT_BRACKETS.map((w) => {
            const isSelected = selectedWeight === w.id;
            return (
              <TouchableOpacity
                key={w.id}
                style={[
                  styles.weightCard,
                  isSelected && styles.weightCardSelected,
                ]}
                onPress={() => setSelectedWeight(w.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.weightTitle}>{w.weight}</Text>
                <Text style={styles.weightDesc}>{w.desc}</Text>
                <Text
                  style={[
                    styles.weightPriceText,
                    isSelected && styles.weightPriceTextSelected,
                  ]}
                >
                  {w.priceText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 5: DELIVERY PARTNER VEHICLE */}
        <View style={[styles.sectionHeaderRow, { marginTop: 18 }]}>
          <Text style={styles.sectionTitle}>DELIVERY PARTNER VEHICLE</Text>
          <Text style={styles.dynamicPricingTag}>REAL-TIME FARE</Text>
        </View>

        <View style={styles.vehiclesList}>
          {DELIVERY_VEHICLES.map((v) => {
            const isSelected = selectedVehicle === v.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.vehicleCard,
                  isSelected && styles.vehicleCardSelected,
                ]}
                onPress={() => setSelectedVehicle(v.id)}
                activeOpacity={0.85}
              >
                <View style={styles.vehicleEmojiBox}>
                  <Text style={styles.vehicleEmojiText}>{v.iconEmoji}</Text>
                </View>

                <View style={styles.vehicleInfoCol}>
                  <View style={styles.vehicleTitleRow}>
                    <Text style={styles.vehicleName}>{v.name}</Text>
                    {v.badge && (
                      <View style={styles.fastestBadge}>
                        <Text style={styles.fastestBadgeText}>{v.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.vehicleDesc}>
                    {v.eta} • {v.desc}
                  </Text>
                </View>

                <View style={styles.vehicleFareCol}>
                  <Text style={styles.vehicleFareValue}>₹{v.fare}</Text>
                  <Text style={styles.vehicleSubFare}>{v.subFare}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 6: PAYMENT METHOD */}
        <View style={[styles.cardContainer, { marginTop: 8 }]}>
          <Text style={styles.cardHeaderTitle}>PAYMENT METHOD</Text>
          <View style={styles.paymentsRow}>
            {/* Wallet */}
            <TouchableOpacity
              style={[
                styles.paymentPill,
                paymentMethod === 'WALLET' && styles.paymentPillSelected,
              ]}
              onPress={() => setPaymentMethod('WALLET')}
              activeOpacity={0.8}
            >
              <Wallet
                size={16}
                color={paymentMethod === 'WALLET' ? '#10B981' : '#64748B'}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.paymentPillText,
                  paymentMethod === 'WALLET' && styles.paymentPillTextSelected,
                ]}
              >
                AOLO Wallet
              </Text>
            </TouchableOpacity>

            {/* UPI / Card */}
            <TouchableOpacity
              style={[
                styles.paymentPill,
                paymentMethod === 'UPI' && styles.paymentPillSelected,
              ]}
              onPress={() => setPaymentMethod('UPI')}
              activeOpacity={0.8}
            >
              <CreditCard
                size={16}
                color={paymentMethod === 'UPI' ? '#10B981' : '#64748B'}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.paymentPillText,
                  paymentMethod === 'UPI' && styles.paymentPillTextSelected,
                ]}
              >
                UPI / Card
              </Text>
            </TouchableOpacity>

            {/* Pay on Handover */}
            <TouchableOpacity
              style={[
                styles.paymentPill,
                paymentMethod === 'HANDOVER' && styles.paymentPillSelected,
              ]}
              onPress={() => setPaymentMethod('HANDOVER')}
              activeOpacity={0.8}
            >
              <Banknote
                size={16}
                color={paymentMethod === 'HANDOVER' ? '#10B981' : '#64748B'}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.paymentPillText,
                  paymentMethod === 'HANDOVER' && styles.paymentPillTextSelected,
                ]}
              >
                Pay on Handover
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.bookActionBtn}
          onPress={handleBookDelivery}
          activeOpacity={0.85}
        >
          <Package size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.bookActionBtnText}>
            BOOK PARCEL DELIVERY • ₹{totalFare}
          </Text>
        </TouchableOpacity>

        {/* Subtext info */}
        <Text style={styles.bookDisclaimer}>
          Generates instant 4-digit Pickup & Drop OTPs for verified handover
        </Text>
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
    paddingVertical: Platform.OS === 'ios' ? 10 : 12,
    backgroundColor: '#F7F9F5',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#059669',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 95,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF3EA',
    borderRadius: 24,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  togglePill: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    gap: 6,
  },
  activeTogglePill: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  activeToggleText: {
    color: '#0F172A',
    fontWeight: '800',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  swapBtnText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  inputGroup: {
    width: '100%',
  },
  inputSubLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.4,
    marginBottom: 5,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
    gap: 8,
  },
  dotMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addressInputText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    padding: 0,
    margin: 0,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colHalf: {
    flex: 1,
  },
  compactInputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  compactInput: {
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    padding: 0,
    margin: 0,
  },
  requiredTag: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  typeCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
  },
  typeIconEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeCardName: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 13,
  },
  typeCardNameSelected: {
    color: '#065F46',
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  dynamicPricingTag: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#10B981',
    letterSpacing: 0.4,
  },
  weightGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  weightCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  weightCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
  },
  weightTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  weightDesc: {
    fontSize: 9.5,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  weightPriceText: {
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  weightPriceTextSelected: {
    color: '#059669',
  },
  vehiclesList: {
    gap: 10,
    marginBottom: 14,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  vehicleCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
  },
  vehicleEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vehicleEmojiText: {
    fontSize: 22,
  },
  vehicleInfoCol: {
    flex: 1,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  fastestBadge: {
    backgroundColor: '#0F766E',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  fastestBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  vehicleDesc: {
    fontSize: 10.5,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  vehicleFareCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  vehicleFareValue: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  vehicleSubFare: {
    fontSize: 9.5,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 1,
  },
  paymentsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  paymentPill: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 5,
  },
  paymentPillSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
  },
  paymentPillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
  },
  paymentPillTextSelected: {
    color: '#065F46',
    fontWeight: '800',
  },
  bookActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 26,
    height: 52,
    gap: 8,
    marginTop: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bookActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  bookDisclaimer: {
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
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
