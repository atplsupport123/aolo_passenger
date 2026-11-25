import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building,
  MapPin,
  Plus,
  X,
  Ban,
  Home,
  Calendar,
  Wallet,
  User,
  ArrowLeftRight,
  Clock,
} from 'lucide-react-native';
import { Location } from '../types';
import BottomNavBar from './BottomNavBar';

export const POPULAR_HUBS: Location[] = [
  {
    id: 'hub_1',
    name: 'AOLO Headquarters',
    address: 'AOLO Tower, 45 Grand Avenue, Suite A',
    lat: 25.8824,
    lng: 86.5986,
  },
  {
    id: 'hub_2',
    name: 'International Airport (AOL)',
    address: 'Terminal 2, Airport Bypass Rd',
    lat: 25.5913,
    lng: 85.0880,
  },
  {
    id: 'hub_3',
    name: 'Downtown Shopping Mall',
    address: '77 Broadway St, Core District',
    lat: 25.6093,
    lng: 85.1376,
  },
];

interface PickupDestinationFlowProps {
  pickup: Location | null;
  dropoff: Location | null;
  onSelectPickup: (loc: Location) => void;
  onSelectDropoff: (loc: Location) => void;
  onConfirmLocations: () => void;
  onClose: () => void;
  rideType: 'ONEWAY' | 'ROUNDTRIP';
  setRideType: (type: 'ONEWAY' | 'ROUNDTRIP') => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  flowMode?: 'CITY' | 'OUTSTATION';
}

export default function PickupDestinationFlow({
  pickup,
  dropoff,
  onSelectPickup,
  onSelectDropoff,
  onConfirmLocations,
  onClose,
  rideType,
  setRideType,
  flowMode = 'CITY',
}: PickupDestinationFlowProps) {
  const [activeTab, setActiveTab] = useState<'CITY' | 'INTERCITY'>('CITY');
  const [outstationTab, setOutstationTab] = useState<'ONEWAY' | 'ROUNDTRIP'>('ROUNDTRIP');
  const [returnDate, setReturnDate] = useState('15-10-2026');
  const [returnTime, setReturnTime] = useState('12:00');
  const [isEditingReturnDate, setIsEditingReturnDate] = useState(false);
  const [isEditingReturnTime, setIsEditingReturnTime] = useState(false);

  const [pickupText, setPickupText] = useState(pickup ? pickup.name : 'Saharsa, Bihar');
  const [dropoffText, setDropoffText] = useState(dropoff ? dropoff.name : '');
  const [selectedHubId, setSelectedHubId] = useState<string>(() => {
    if (flowMode === 'OUTSTATION') {
      return dropoff?.name ? (POPULAR_HUBS.find((h) => h.name === dropoff.name)?.id || '') : '';
    }
    if (dropoff?.name) {
      const match = POPULAR_HUBS.find((h) => h.name === dropoff.name);
      if (match) return match.id;
    }
    return 'hub_2';
  });
  const [pitstopText, setPitstopText] = useState('');
  const [showPitstopInput, setShowPitstopInput] = useState(false);

  useEffect(() => {
    if (!pickup) {
      onSelectPickup({
        id: 'loc_saharsa',
        name: 'Saharsa, Bihar',
        address: 'Saharsa, Bihar 852201',
        lat: 25.8824,
        lng: 86.5986,
      });
    }
  }, [pickup, onSelectPickup]);

  const handleSelectHub = (hub: Location) => {
    setSelectedHubId(hub.id);
    setDropoffText(hub.name);
    onSelectDropoff(hub);
  };

  const handleClearPickup = () => {
    setPickupText('');
  };

  const handleClearDropoff = () => {
    setDropoffText('');
    setSelectedHubId('');
  };

  const handleDone = () => {
    if (!dropoff && selectedHubId) {
      const hub = POPULAR_HUBS.find((h) => h.id === selectedHubId);
      if (hub) onSelectDropoff(hub);
    }
    onConfirmLocations();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {flowMode === 'OUTSTATION' ? 'OUTSTATION RIDE' : 'CITY & INTERCITY'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {flowMode === 'OUTSTATION' ? (
          /* Outstation Toggle Bar: [ ONE-WAY ] | [ ⇄ ROUND TRIP ] */
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.togglePill,
                outstationTab === 'ONEWAY' && styles.activeTogglePill,
              ]}
              onPress={() => {
                setOutstationTab('ONEWAY');
                setRideType('ONEWAY');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  outstationTab === 'ONEWAY' && styles.activeToggleText,
                ]}
              >
                ONE-WAY
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.togglePill,
                outstationTab === 'ROUNDTRIP' && styles.activeTogglePill,
              ]}
              onPress={() => {
                setOutstationTab('ROUNDTRIP');
                setRideType('ROUNDTRIP');
              }}
              activeOpacity={0.8}
            >
              <ArrowLeftRight
                size={14}
                color={outstationTab === 'ROUNDTRIP' ? '#F97316' : '#64748B'}
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.toggleText,
                  outstationTab === 'ROUNDTRIP' && styles.activeToggleText,
                ]}
              >
                ROUND TRIP
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* City Toggle Bar: [ 🏢 CITY ] | [ INTERCITY ] */
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.togglePill, activeTab === 'CITY' && styles.activeTogglePill]}
              onPress={() => {
                setActiveTab('CITY');
                setRideType('ONEWAY');
              }}
              activeOpacity={0.8}
            >
              <Building
                size={14}
                color={activeTab === 'CITY' ? '#0F172A' : '#64748B'}
                strokeWidth={2.2}
              />
              <Text style={[styles.toggleText, activeTab === 'CITY' && styles.activeToggleText]}>
                CITY
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.togglePill, activeTab === 'INTERCITY' && styles.activeTogglePill]}
              onPress={() => {
                setActiveTab('INTERCITY');
                setRideType('ROUNDTRIP');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, activeTab === 'INTERCITY' && styles.activeToggleText]}>
                INTERCITY
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pickup & Drop Destination Card */}
        <View style={styles.locationCard}>
          {/* Pickup Point Row */}
          <View style={styles.locationRow}>
            <View style={styles.pickupRingOuter}>
              <View style={styles.pickupRingInner} />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.pickupTag}>PICKUP POINT</Text>
              <TextInput
                style={styles.locationInput}
                value={pickupText}
                onChangeText={setPickupText}
                placeholder="Enter pickup location"
                placeholderTextColor="#94A3B8"
              />
            </View>
            {pickupText.length > 0 && (
              <TouchableOpacity onPress={handleClearPickup} style={styles.clearBtn} activeOpacity={0.7}>
                <X size={15} color="#94A3B8" strokeWidth={2.4} />
              </TouchableOpacity>
            )}
          </View>

          {/* Dotted Vertical Connector Line */}
          <View style={styles.connectorRow}>
            <View style={styles.dottedConnector} />
          </View>

          {/* Drop Destination Row */}
          <View style={styles.locationRow}>
            <View style={styles.dropRingOuter}>
              <View style={styles.dropRingInner} />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.dropTag}>DROP DESTINATION</Text>
              <TextInput
                style={styles.locationInput}
                value={dropoffText}
                onChangeText={(text) => {
                  setDropoffText(text);
                  setSelectedHubId('');
                }}
                placeholder="Search your drop location..."
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={styles.dropRightControls}>
              <TouchableOpacity
                style={styles.addStopBtn}
                onPress={() => setShowPitstopInput(!showPitstopInput)}
                activeOpacity={0.8}
              >
                <Plus size={11} color="#64748B" strokeWidth={2.6} />
                <Text style={styles.addStopText}>STOP</Text>
              </TouchableOpacity>
              {dropoffText.length > 0 && (
                <TouchableOpacity onPress={handleClearDropoff} style={styles.clearBtn} activeOpacity={0.7}>
                  <X size={15} color="#94A3B8" strokeWidth={2.4} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Optional Pitstop Input */}
          {showPitstopInput && (
            <View style={styles.pitstopRow}>
              <View style={styles.pitstopDot} />
              <TextInput
                style={styles.pitstopInput}
                value={pitstopText}
                onChangeText={setPitstopText}
                placeholder="Add intermediate stop..."
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPitstopInput(false)} style={styles.clearBtn}>
                <X size={14} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          )}

          {/* Outstation Return Journey Schedule matching screenshot */}
          {flowMode === 'OUTSTATION' && outstationTab === 'ROUNDTRIP' && (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.scheduleHeaderRow}>
                <View style={styles.scheduleHeaderLeft}>
                  <ArrowLeftRight size={15} color="#EA580C" strokeWidth={2.4} />
                  <Text style={styles.scheduleHeaderTitle}>RETURN JOURNEY SCHEDULE</Text>
                </View>
                <View style={styles.roundTripBadge}>
                  <Text style={styles.roundTripBadgeText}>Round Trip</Text>
                </View>
              </View>

              <View style={styles.scheduleInputsRow}>
                {/* Return Date */}
                <View style={styles.scheduleInputCol}>
                  <Text style={styles.scheduleInputLabel}>RETURN DATE</Text>
                  <TouchableOpacity
                    style={styles.schedulePill}
                    onPress={() => setIsEditingReturnDate(!isEditingReturnDate)}
                    activeOpacity={0.85}
                  >
                    <Calendar size={16} color="#EA580C" strokeWidth={2.2} />
                    {isEditingReturnDate ? (
                      <TextInput
                        style={styles.scheduleTextInput}
                        value={returnDate}
                        onChangeText={setReturnDate}
                        autoFocus
                        onBlur={() => setIsEditingReturnDate(false)}
                      />
                    ) : (
                      <Text style={styles.scheduleText}>{returnDate}</Text>
                    )}
                    <Calendar size={15} color="#94A3B8" strokeWidth={1.8} />
                  </TouchableOpacity>
                </View>

                {/* Return Time */}
                <View style={styles.scheduleInputCol}>
                  <Text style={styles.scheduleInputLabel}>RETURN TIME</Text>
                  <TouchableOpacity
                    style={styles.schedulePill}
                    onPress={() => setIsEditingReturnTime(!isEditingReturnTime)}
                    activeOpacity={0.85}
                  >
                    <Clock size={16} color="#EA580C" strokeWidth={2.2} />
                    {isEditingReturnTime ? (
                      <TextInput
                        style={styles.scheduleTextInput}
                        value={returnTime}
                        onChangeText={setReturnTime}
                        autoFocus
                        onBlur={() => setIsEditingReturnTime(false)}
                      />
                    ) : (
                      <Text style={styles.scheduleText}>{returnTime}</Text>
                    )}
                    <Clock size={15} color="#94A3B8" strokeWidth={1.8} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Popular Hubs & Stations Section Header */}
        <Text style={styles.sectionHeader}>POPULAR HUBS & STATIONS</Text>

        {/* Hubs List */}
        <View style={styles.hubsListContainer}>
          {POPULAR_HUBS.map((hub) => {
            const isSelected = selectedHubId === hub.id;
            return (
              <TouchableOpacity
                key={hub.id}
                style={[styles.hubCard, isSelected && styles.hubCardSelected]}
                onPress={() => handleSelectHub(hub)}
                activeOpacity={0.85}
              >
                <View style={styles.hubIconBox}>
                  <MapPin size={18} color="#84CC16" strokeWidth={2.2} />
                </View>
                <View style={styles.hubTextCol}>
                  <Text style={styles.hubTitle}>{hub.name}</Text>
                  <Text style={styles.hubSubtitle} numberOfLines={1}>
                    {hub.address}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Warning / Informational Alert Banner matching screenshot */}
        {flowMode === 'OUTSTATION' ? (
          <View style={styles.guidanceBanner}>
            <View style={styles.guidanceDot} />
            <Text style={styles.guidanceText}>
              PLEASE CHOOSE A DROP DESTINATION TO UNLOCK ROUTE MAP
            </Text>
          </View>
        ) : (
          <View style={styles.warningBanner}>
            <Ban size={18} color="#DC2626" strokeWidth={2.4} style={styles.warningIcon} />
            <Text style={styles.warningText}>
              CITY RIDE IS AVAILABLE ONLY WITHIN THE SAME CITY. PLEASE CHOOSE INTERCITY RIDE FOR TRAVEL BETWEEN DIFFERENT CITIES.
            </Text>
          </View>
        )}

        {/* DONE Action Button */}
        <TouchableOpacity
          style={[
            styles.doneBtn,
            (dropoffText.length > 0 || selectedHubId !== '') && styles.doneBtnActive,
          ]}
          onPress={handleDone}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.doneBtnText,
              (dropoffText.length > 0 || selectedHubId !== '') && styles.doneBtnTextActive,
            ]}
          >
            DONE
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 90,
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
    paddingVertical: 9,
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
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupRingOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#84CC16',
    backgroundColor: '#F4FBE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupRingInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#84CC16',
  },
  dropRingOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#F43F5E',
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropRingInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F43F5E',
  },
  connectorRow: {
    paddingLeft: 10,
    height: 18,
    justifyContent: 'center',
  },
  dottedConnector: {
    width: 2,
    height: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  inputCol: {
    flex: 1,
    marginLeft: 12,
  },
  pickupTag: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#84CC16',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dropTag: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#F43F5E',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationInput: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    padding: 0,
    margin: 0,
    height: 22,
  },
  dropRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    gap: 3,
  },
  addStopText: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  clearBtn: {
    padding: 4,
  },
  pitstopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  pitstopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  pitstopInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  sectionHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  hubsListContainer: {
    marginBottom: 14,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  hubCardSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  hubIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F4FBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hubTextCol: {
    flex: 1,
  },
  hubTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  hubSubtitle: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#DC2626',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 14,
    marginBottom: 12,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  scheduleHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  roundTripBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 2.5,
  },
  roundTripBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#EA580C',
  },
  scheduleInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleInputCol: {
    flex: 1,
  },
  scheduleInputLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 10,
  },
  scheduleText: {
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  scheduleTextInput: {
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    padding: 0,
    margin: 0,
    minWidth: 60,
    textAlign: 'center',
  },
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  guidanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#84CC16',
  },
  guidanceText: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#A16207',
    letterSpacing: 0.3,
    lineHeight: 15,
  },
  doneBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  doneBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  doneBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  doneBtnTextActive: {
    color: '#FFFFFF',
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
