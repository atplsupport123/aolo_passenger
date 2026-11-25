import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Compass,
  MapPin,
  TicketCheck,
  Users,
  X,
} from 'lucide-react-native';

interface RoadTripsModalProps {
  onClose: () => void;
}

interface RoadTripRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  vehicleType: string;
  price: string;
  tag: string;
  slots: { id: string; time: string }[];
}

interface SlotStatus {
  vehiclesRemaining: number;
  fullAt: number | null;
  bookedByUser: boolean;
}

const SLOT_CAPACITY = 1;
const SLOT_FULL_RETENTION_MS = 30 * 60 * 1000;
const SLOT_STORAGE_KEY = '@aolo/road-trip-slots-v1';

const ROAD_TRIP_ROUTES: RoadTripRoute[] = [
  {
    id: 'saharsa-patna',
    from: 'Saharsa',
    to: 'Patna',
    duration: '5.5 hrs',
    vehicleType: 'One-Way Sedan',
    price: '₹2,499',
    tag: 'MOST POPULAR',
    slots: [
      { id: 'saharsa-patna-0630', time: '6:30 AM' },
      { id: 'saharsa-patna-1000', time: '10:00 AM' },
      { id: 'saharsa-patna-1500', time: '3:00 PM' },
    ],
  },
  {
    id: 'patna-darbhanga',
    from: 'Patna',
    to: 'Darbhanga',
    duration: '3 hrs',
    vehicleType: 'One-Way Sedan',
    price: '₹1,499',
    tag: 'SUPER VALUE',
    slots: [
      { id: 'patna-darbhanga-0700', time: '7:00 AM' },
      { id: 'patna-darbhanga-1200', time: '12:00 PM' },
      { id: 'patna-darbhanga-1700', time: '5:00 PM' },
    ],
  },
  {
    id: 'saharsa-purnia',
    from: 'Saharsa',
    to: 'Purnia',
    duration: '2.5 hrs',
    vehicleType: 'One-Way Sedan',
    price: '₹1,199',
    tag: 'EXPRESS ROUTE',
    slots: [
      { id: 'saharsa-purnia-0800', time: '8:00 AM' },
      { id: 'saharsa-purnia-1300', time: '1:00 PM' },
      { id: 'saharsa-purnia-1800', time: '6:00 PM' },
    ],
  },
];

export default function RoadTripsModal({ onClose }: RoadTripsModalProps) {
  const insets = useSafeAreaInsets();
  const [slotStatuses, setSlotStatuses] = useState<Record<string, SlotStatus>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [bookingNotice, setBookingNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(SLOT_STORAGE_KEY)
      .then((stored) => {
        if (stored && isMounted) {
          const parsed = JSON.parse(stored) as Record<string, SlotStatus>;
          setSlotStatuses(parsed);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(slotStatuses)).catch(() => {});
  }, [isHydrated, slotStatuses]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!bookingNotice) return;
    const timer = setTimeout(() => setBookingNotice(''), 3200);
    return () => clearTimeout(timer);
  }, [bookingNotice]);

  const handleBookSlot = (route: RoadTripRoute, slot: RoadTripRoute['slots'][number]) => {
    const current = slotStatuses[slot.id] ?? {
      vehiclesRemaining: SLOT_CAPACITY,
      fullAt: null,
      bookedByUser: false,
    };

    if (current.bookedByUser || current.vehiclesRemaining <= 0) return;

    const vehiclesRemaining = current.vehiclesRemaining - 1;
    setSlotStatuses((previous) => ({
      ...previous,
      [slot.id]: {
        vehiclesRemaining,
        fullAt: vehiclesRemaining === 0 ? Date.now() : null,
        bookedByUser: true,
      },
    }));
    setBookingNotice(`Your ${slot.time} slot for ${route.from} to ${route.to} is reserved.`);
  };

  const getSlotStatus = (slotId: string): SlotStatus =>
    slotStatuses[slotId] ?? {
      vehiclesRemaining: SLOT_CAPACITY,
      fullAt: null,
      bookedByUser: false,
    };

  const getTimeUntilRemoval = (fullAt: number) => {
    const secondsLeft = Math.max(
      0,
      Math.ceil((fullAt + SLOT_FULL_RETENTION_MS - now) / 1000),
    );
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.page, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.backButton}
          activeOpacity={0.75}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={21} color="#0F172A" strokeWidth={2.4} />
        </TouchableOpacity>
        <View style={styles.topBarTitleWrap}>
          <Text style={styles.topBarEyebrow}>AOLO EXPERIENCES</Text>
          <Text style={styles.topBarTitle}>Road Trips</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          activeOpacity={0.75}
          accessibilityLabel="Close road trips"
        >
          <X size={18} color="#64748B" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <View style={styles.heroEyebrowPill}>
              <Compass size={13} color="#A3E635" strokeWidth={2.5} />
              <Text style={styles.heroEyebrow}>GO BEYOND THE CITY</Text>
            </View>
            <Text style={styles.heroTitle}>The road is{ '\n' }calling.</Text>
            <Text style={styles.heroSubtitle}>
              Pick a route, choose your time, and let’s get you moving.
            </Text>
          </View>
          <View style={styles.heroCompass}>
            <Compass size={44} color="#A3E635" strokeWidth={1.7} />
          </View>
          <View style={styles.heroBottomRow}>
            <View style={styles.heroMetaItem}>
              <Check size={13} color="#A3E635" strokeWidth={3} />
              <Text style={styles.heroMetaText}>Easy slot booking</Text>
            </View>
            <View style={styles.heroMetaDivider} />
            <View style={styles.heroMetaItem}>
              <Check size={13} color="#A3E635" strokeWidth={3} />
              <Text style={styles.heroMetaText}>Intercity rides</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionEyebrow}>CURATED FOR YOU</Text>
            <Text style={styles.sectionTitle}>Choose your road trip</Text>
          </View>
          <View style={styles.routeCountPill}>
            <Text style={styles.routeCountText}>{ROAD_TRIP_ROUTES.length} ROUTES</Text>
          </View>
        </View>

        <View style={styles.slotInfoBanner}>
          <View style={styles.slotInfoIcon}>
            <TicketCheck size={18} color="#4D7C0F" strokeWidth={2.2} />
          </View>
          <Text style={styles.slotInfoText}>
            Book a departure slot below. When a slot fills, it stays marked full for 30 minutes,
            then disappears automatically.
          </Text>
        </View>

        {!isHydrated ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#65A30D" />
            <Text style={styles.loadingText}>Loading available slots…</Text>
          </View>
        ) : (
          ROAD_TRIP_ROUTES.map((route, index) => {
            const visibleSlots = route.slots.filter((slot) => {
              const status = getSlotStatus(slot.id);
              return !(
                status.fullAt && now - status.fullAt >= SLOT_FULL_RETENTION_MS
              );
            });

            return (
              <View key={route.id} style={styles.routeCard}>
                <View style={styles.routeCardTop}>
                  <View style={styles.routeTitleWrap}>
                    <View style={styles.routeIndexPill}>
                      <Text style={styles.routeIndexText}>{`0${index + 1}`}</Text>
                    </View>
                    <View style={styles.routeNameWrap}>
                      <Text style={styles.routeName}>
                        {route.from} <Text style={styles.routeArrow}>→</Text> {route.to}
                      </Text>
                      <View style={styles.routeMetaRow}>
                        <Clock3 size={13} color="#8A9184" strokeWidth={2.1} />
                        <Text style={styles.routeMetaText}>{route.duration}</Text>
                        <View style={styles.routeMetaDot} />
                        <Text style={styles.routeMetaText}>{route.vehicleType}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.priceWrap}>
                    <Text style={styles.priceCaption}>FROM</Text>
                    <Text style={styles.priceText}>{route.price}</Text>
                  </View>
                </View>

                <View style={styles.routeTag}>
                  <Text style={styles.routeTagText}>{route.tag}</Text>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.departureHeading}>
                  <View>
                    <Text style={styles.departureTitle}>Book a departure slot</Text>
                    <Text style={styles.departureSubtitle}>Choose the time that works for you</Text>
                  </View>
                  <MapPin size={17} color="#84CC16" strokeWidth={2.2} />
                </View>

                {visibleSlots.length > 0 ? (
                  <View style={styles.slotsList}>
                    {visibleSlots.map((slot) => {
                      const status = getSlotStatus(slot.id);
                      const isFull = status.vehiclesRemaining <= 0;
                      const isBooked = status.bookedByUser;
                      return (
                        <View
                          key={slot.id}
                          style={[styles.slotRow, isFull && styles.slotRowFull]}
                        >
                          <View style={styles.slotTimeWrap}>
                            <Text style={styles.slotTime}>{slot.time}</Text>
                            {isFull ? (
                              <Text style={styles.slotFullText}>
                                FULL · HIDES IN {getTimeUntilRemoval(status.fullAt || now)}
                              </Text>
                            ) : (
                              <View style={styles.seatsRemainingRow}>
                                <Users size={12} color="#8A9184" strokeWidth={2} />
                                <Text style={styles.seatsRemainingText}>
                                  {status.vehiclesRemaining} cab slot available
                                </Text>
                              </View>
                            )}
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.bookButton,
                              isBooked && styles.bookedButton,
                              isFull && !isBooked && styles.fullButton,
                            ]}
                            onPress={() => handleBookSlot(route, slot)}
                            activeOpacity={0.8}
                            disabled={isFull || isBooked}
                          >
                            {isBooked ? (
                              <Check size={13} color="#4D7C0F" strokeWidth={3} />
                            ) : isFull ? null : (
                              <Text style={styles.bookButtonText}>BOOK SLOT</Text>
                            )}
                            {isBooked ? (
                              <Text style={styles.bookedButtonText}>BOOKED</Text>
                            ) : isFull ? (
                              <Text style={styles.fullButtonText}>FULL</Text>
                            ) : (
                              <ArrowRight size={14} color="#0F172A" strokeWidth={2.4} />
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.noSlotsMessage}>
                    <Text style={styles.noSlotsText}>All departure slots have closed for now.</Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Slot availability updates as seats are booked. Plan your next escape with AOLO.
          </Text>
        </View>
      </ScrollView>

      {bookingNotice ? (
        <View style={[styles.bookingToast, { bottom: Math.max(insets.bottom, 14) + 10 }]}>
          <Check size={17} color="#FFFFFF" strokeWidth={3} />
          <Text style={styles.bookingToastText}>{bookingNotice}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    minHeight: 64,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  topBarEyebrow: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#84CC16',
    letterSpacing: 1.2,
  },
  topBarTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroCard: {
    minHeight: 205,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroCopy: {
    maxWidth: '78%',
    zIndex: 2,
  },
  heroEyebrowPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  heroEyebrow: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#E2E8F0',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    marginTop: 13,
  },
  heroSubtitle: {
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#CBD5E1',
    marginTop: 6,
  },
  heroCompass: {
    position: 'absolute',
    top: 35,
    right: 20,
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(132,204,22,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottomRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroMetaText: {
    fontSize: 9.5,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#E2E8F0',
  },
  heroMetaDivider: {
    width: 1,
    height: 13,
    backgroundColor: '#475569',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 1,
    color: '#84CC16',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  routeCountPill: {
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: '#ECFCCB',
  },
  routeCountText: {
    fontSize: 8.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#4D7C0F',
    letterSpacing: 0.5,
  },
  slotInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 14,
  },
  slotInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
  },
  slotInfoText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    marginBottom: 13,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.035,
    shadowRadius: 8,
    elevation: 2,
  },
  routeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeIndexPill: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4FBE8',
  },
  routeIndexText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#65A30D',
  },
  routeNameWrap: {
    flex: 1,
  },
  routeName: {
    fontSize: 14.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  routeArrow: {
    color: '#84CC16',
  },
  routeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  routeMetaText: {
    fontSize: 9.5,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#8A9184',
  },
  routeMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#A8B0A1',
    marginHorizontal: 1,
  },
  priceWrap: {
    alignItems: 'flex-end',
    marginLeft: 6,
  },
  priceCaption: {
    fontSize: 7.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.7,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 1,
  },
  routeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4FBE8',
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginTop: 11,
  },
  routeTagText: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#65A30D',
    letterSpacing: 0.55,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 13,
  },
  departureHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  departureTitle: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  departureSubtitle: {
    fontSize: 9.5,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    marginTop: 2,
  },
  slotsList: {
    gap: 7,
  },
  slotRow: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EDF2E8',
    borderRadius: 13,
    backgroundColor: '#FBFDF8',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  slotRowFull: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  slotTimeWrap: {
    flex: 1,
  },
  slotTime: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  seatsRemainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  seatsRemainingText: {
    fontSize: 9,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#8A9184',
  },
  slotFullText: {
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.15,
    marginTop: 3,
  },
  bookButton: {
    minWidth: 98,
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 10,
    backgroundColor: '#A3E635',
    paddingHorizontal: 9,
  },
  bookButtonText: {
    fontSize: 8.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  bookedButton: {
    backgroundColor: '#ECFCCB',
    borderWidth: 1,
    borderColor: '#A3E635',
  },
  bookedButtonText: {
    fontSize: 8.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#4D7C0F',
  },
  fullButton: {
    minWidth: 72,
    backgroundColor: '#E2E8F0',
  },
  fullButtonText: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  noSlotsMessage: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  noSlotsText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  loadingState: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  footerNote: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  footerNoteText: {
    fontSize: 9.5,
    fontWeight: '500',
    fontFamily: 'Roboto',
    lineHeight: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  bookingToast: {
    position: 'absolute',
    left: 18,
    right: 18,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: 15,
    backgroundColor: '#0F172A',
    paddingHorizontal: 15,
    paddingVertical: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
  },
  bookingToastText: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '600',
    fontFamily: 'Roboto',
    lineHeight: 15,
    color: '#FFFFFF',
  },
});
