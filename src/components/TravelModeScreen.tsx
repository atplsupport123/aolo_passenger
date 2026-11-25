import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Menu,
  Sun,
  Plane,
  Train,
  Bus,
  Building,
  Globe,
  Shield,
  Ticket,
  Copy,
  Check,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search,
  FileText,
} from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';
import WeatherModal from './WeatherModal';
import BottomNavBar from './BottomNavBar';

interface TravelModeScreenProps {
  onClose: () => void;
}

interface InFrameModalProps {
  visible?: boolean;
  children: React.ReactNode;
}

function InFrameModal({ visible, children }: InFrameModalProps) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {children}
    </View>
  );
}

type PortalType = 'DASHBOARD' | 'FLIGHTS' | 'TRAINS' | 'BUSES' | 'HOTELS' | 'HOLIDAYS' | 'VISA';

interface BookingSuccessData {
  title: string;
  category: string;
  pnr: string;
  route: string;
  price: string;
}

const QUICK_DATES = [
  { label: 'Today', date: '28-09-2026' },
  { label: 'Tomorrow', date: '29-09-2026' },
  { label: 'Weekend', date: '03-10-2026' },
  { label: 'Next Week', date: '05-10-2026' },
  { label: '18 Jul 2026', date: '18-07-2026' },
  { label: '25 Jul 2026', date: '25-07-2026' },
];

const FLIGHT_CLASSES = [
  { name: 'Economy', desc: 'Standard seating, cabin bag included' },
  { name: 'Premium Economy', desc: 'Extra legroom, priority check-in' },
  { name: 'Business Class', desc: 'Lie-flat seats, gourmet dining, lounge access' },
  { name: 'First Class', desc: 'Ultimate VIP luxury & personalized suite' },
];

const BUS_TYPES = [
  { name: 'AC Sleeper (2+1)', desc: 'Personal berths with charging & blanket' },
  { name: 'AC Seater (2+2)', desc: 'Pushback reclining seats with AC' },
  { name: 'Volvo Multi-Axle Luxury', desc: 'Ultra-smooth air suspension & washroom' },
  { name: 'Non-AC Sleeper', desc: 'Economical overnight berths' },
];

const HOTEL_ROOM_CONFIGS = [
  { name: '1 Room, 1 Adult', desc: 'Solo traveler stay' },
  { name: '1 Room, 2 Adults', desc: 'Ideal for couples or partners' },
  { name: '2 Rooms, 4 Adults', desc: 'Family or group vacation' },
  { name: 'Suite Room (VIP)', desc: 'Luxury living room & king bedroom' },
];

interface FlightItem {
  id: string;
  airline: string;
  code: string;
  price: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  flightType: string;
  pnr: string;
  seat: string;
  gate: string;
}

const AVAILABLE_FLIGHTS: FlightItem[] = [
  {
    id: '1',
    airline: 'INDIGO',
    code: '6E-2415',
    price: '₹4,250',
    departTime: '08:30',
    arriveTime: '10:15',
    duration: '1H 45M',
    flightType: 'NON-STOP',
    pnr: '6E9XF28',
    seat: '12A (Window)',
    gate: 'Gate 04B',
  },
  {
    id: '2',
    airline: 'AIR INDIA',
    code: 'AI-412',
    price: '₹5,120',
    departTime: '11:45',
    arriveTime: '13:40',
    duration: '1H 55M',
    flightType: 'NON-STOP',
    pnr: 'AI7K92P',
    seat: '14F (Aisle)',
    gate: 'Gate 02A',
  },
  {
    id: '3',
    airline: 'SPICEJET',
    code: 'SG-127',
    price: '₹3,900',
    departTime: '15:10',
    arriveTime: '17:00',
    duration: '1H 50M',
    flightType: 'NON-STOP',
    pnr: 'SG4M819',
    seat: '08C (Aisle)',
    gate: 'Gate 01C',
  },
];

interface TrainClassOption {
  code: string;
  status: string;
}

interface TrainItem {
  id: string;
  trainName: string;
  trainNo: string;
  price: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  trainType: string;
  pnr: string;
  coachBerth: string;
  station: string;
  classes: TrainClassOption[];
}

const AVAILABLE_TRAINS: TrainItem[] = [
  {
    id: '1',
    trainName: 'VAISHALI EXPRESS',
    trainNo: '12553',
    price: '₹740',
    departTime: '06:45',
    arriveTime: '12:15',
    duration: '5h 30m',
    trainType: 'SUPERFAST',
    pnr: '4235891275',
    coachBerth: 'S3 / 48 (SL)',
    station: 'Saharsa Jn (SHC) ➔ Patna Jn (PNBE)',
    classes: [
      { code: '2A', status: 'Available-0042' },
      { code: '3A', status: 'Available-0042' },
      { code: 'SL', status: 'Available-0042' },
    ],
  },
  {
    id: '2',
    trainName: 'GARIB RATH EXP',
    trainNo: '12203',
    price: '₹490',
    departTime: '14:30',
    arriveTime: '20:00',
    duration: '5h 30m',
    trainType: 'GARIB RATH',
    pnr: '2849102847',
    coachBerth: 'G5 / 24 (3A)',
    station: 'Saharsa Jn (SHC) ➔ Patna Jn (PNBE)',
    classes: [
      { code: '3A', status: 'Available-0112' },
    ],
  },
  {
    id: '3',
    trainName: 'RAJYA RANI EXP',
    trainNo: '12567',
    price: '₹350',
    departTime: '22:15',
    arriveTime: '03:45',
    duration: '5h 30m',
    trainType: 'EXPRESS',
    pnr: '7829104432',
    coachBerth: 'D2 / 38 (2S)',
    station: 'Saharsa Jn (SHC) ➔ Patna Jn (PNBE)',
    classes: [
      { code: 'CC', status: 'Available-0205' },
      { code: '2S', status: 'Available-0205' },
    ],
  },
];

interface BusItem {
  id: string;
  operatorName: string;
  busNo: string;
  price: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  busType: string;
  ticketNo: string;
  seatNo: string;
  boardingPoint: string;
}

const AVAILABLE_BUSES: BusItem[] = [
  {
    id: '1',
    operatorName: 'ROYAL AC VOLVO',
    busNo: 'DL-01-5521',
    price: '₹650',
    departTime: '22:00',
    arriveTime: '05:15',
    duration: '7H 15M',
    busType: 'Multi-Axle Semi-Sleeper',
    ticketNo: 'ROYAL-77391',
    seatNo: 'R2',
    boardingPoint: 'Aolo Transit Terminal (Saharsa)',
  },
  {
    id: '2',
    operatorName: 'AOLO ELECTRIC LUXURY',
    busNo: 'EV-8820',
    price: '₹580',
    departTime: '21:30',
    arriveTime: '04:30',
    duration: '7H 00M',
    busType: 'AC Sleeper (2+1)',
    ticketNo: 'AOLOBUS-84920',
    seatNo: 'L2',
    boardingPoint: 'Saharsa Main Bus Stand - Bay 03',
  },
  {
    id: '3',
    operatorName: 'BSRTC RAJDHANI EXP',
    busNo: 'BR-01-9482',
    price: '₹480',
    departTime: '07:00',
    arriveTime: '13:30',
    duration: '6H 30M',
    busType: 'AC Seater (2+2)',
    ticketNo: 'BSRTC-49102',
    seatNo: 'L4',
    boardingPoint: 'Saharsa Junction Counter #02',
  },
];

const BUS_BERTHS = [
  { leftCode: 'L1', leftType: 'Lower', rightCode: 'R1', rightType: 'Upper' },
  { leftCode: 'L2', leftType: 'Lower', rightCode: 'R2', rightType: 'Upper' },
  { leftCode: 'L3', leftType: 'Lower', rightCode: 'R3', rightType: 'Upper' },
  { leftCode: 'L4', leftType: 'Lower', rightCode: 'R4', rightType: 'Upper' },
  { leftCode: 'L5', leftType: 'Lower', rightCode: 'R5', rightType: 'Upper' },
];

interface HotelItem {
  id: string;
  hotelName: string;
  locationTag: string;
  price: string;
  numericPrice: string;
  amenities: string[];
  roomType: string;
  roomNumber: string;
  nights: string;
  locationDesc: string;
}

const AVAILABLE_HOTELS: HotelItem[] = [
  {
    id: '1',
    hotelName: 'THE MAURYA LUXURY HOTEL',
    locationTag: 'PATNA CENTER',
    price: '₹5500/night',
    numericPrice: '₹5,500',
    amenities: ['POOL', 'SPA', 'WIFI', 'BAR'],
    roomType: 'Premium Deluxe',
    roomNumber: 'Rm 304',
    nights: '1',
    locationDesc: 'Patna Center',
  },
  {
    id: '2',
    hotelName: 'BODHGAYA REGENCY TEMPLE RESORT',
    locationTag: 'MAHABODHI ROAD',
    price: '₹3800/night',
    numericPrice: '₹3,800',
    amenities: ['GARDEN', 'RESTAURANT', 'WIFI'],
    roomType: 'Deluxe Temple View',
    roomNumber: 'Rm 208',
    nights: '1',
    locationDesc: 'Mahabodhi Road',
  },
  {
    id: '3',
    hotelName: 'RAJGIR HERITAGE WELLNESS SPA',
    locationTag: 'NEAR ROPEWAY LIFT',
    price: '₹4200/night',
    numericPrice: '₹4,200',
    amenities: ['HOT SPRINGS', 'SPA', 'WIFI'],
    roomType: 'Heritage Suite',
    roomNumber: 'Rm 102',
    nights: '1',
    locationDesc: 'Near Ropeway Lift',
  },
];

interface TourTimelineDay {
  dayTitle: string;
  description?: string;
}

interface HolidayItem {
  id: string;
  categoryTag: string;
  packageName: string;
  durationText: string;
  price: string;
  highlights: string[];
  assignedGuide: string;
  contactPhone: string;
  timeline: TourTimelineDay[];
}

const AVAILABLE_HOLIDAYS: HolidayItem[] = [
  {
    id: '1',
    categoryTag: 'SPIRITUAL',
    packageName: 'SACRED BIHAR CIRCUIT TOUR',
    durationText: '4 Days / 3 Nights',
    price: '₹12,499',
    highlights: [
      'Bodh Gaya Temple visit',
      'Rajgir Ropeway & Springs',
      'Nalanda Ruins Guide',
      'Luxury AC Cab transfers',
    ],
    assignedGuide: 'Rajesh Kumar',
    contactPhone: '+91 94712 04825',
    timeline: [
      {
        dayTitle: 'DAY 1 - ARRIVAL & BODH GAYA',
        description: 'Pick up from Patna Airport. Transfer to Bodh Gaya, evening Mahabodhi Temple spiritual Aarti.',
      },
      { dayTitle: 'DAY 2 - TEMPLES & RAJGIR' },
      { dayTitle: 'DAY 3 - PEACE STUPA & NALANDA' },
      { dayTitle: 'DAY 4 - PATNA SAHIB & DEPARTURE' },
    ],
  },
  {
    id: '2',
    categoryTag: 'NATURE',
    packageName: 'MONSOON RETREAT HILL PACKAGE',
    durationText: '3 Days / 2 Nights',
    price: '₹8,999',
    highlights: [
      'Kaimur Hills trekking',
      'Telhar Kund waterfall view',
      'Eco park nature resort',
      'Local organic food trail',
    ],
    assignedGuide: 'Amitabh Verma',
    contactPhone: '+91 98350 44102',
    timeline: [
      {
        dayTitle: 'DAY 1 - KAIMUR RETREAT & VALLEY',
        description: 'Check-in at Eco Nature Resort. Evening guided sunset trek at Kaimur hills.',
      },
      { dayTitle: 'DAY 2 - TELHAR KUND WATERFALL' },
      { dayTitle: 'DAY 3 - ORGANIC TRAIL & RETURN' },
    ],
  },
  {
    id: '3',
    categoryTag: 'ADVENTURE',
    packageName: 'VALMIKI TIGER RESERVE SAFARI',
    durationText: '3 Days / 2 Nights',
    price: '₹14,200',
    highlights: [
      'Open Gypsy Tiger Safari',
      'Jungle wood log stay',
      'Gandak river boating',
      'Birdwatching trail guide',
    ],
    assignedGuide: 'Sanjay Thapa',
    contactPhone: '+91 91220 88319',
    timeline: [
      {
        dayTitle: 'DAY 1 - JUNGLE LODGE & SAFARI BRIEFING',
        description: 'Arrival at Valmiki Tiger Reserve. Check-in to forest wooden log huts with evening campfire.',
      },
      { dayTitle: 'DAY 2 - DEEP CORE SAFARI & BOAT' },
      { dayTitle: 'DAY 3 - BIRDWATCHING & DEPARTURE' },
    ],
  },
];

interface VisaItem {
  id: string;
  countryName: string;
  validity: string;
  price: string;
  processingTime: string;
  features: string;
  applicationId: string;
  category: string;
  approvalWindow: string;
}

const AVAILABLE_VISAS: VisaItem[] = [
  {
    id: '1',
    countryName: 'DUBAI (UAE) TOURIST VISA',
    validity: '30 DAYS SINGLE ENTRY',
    price: '₹6,499',
    processingTime: '24-48 HR APPROVAL',
    features: 'Only Passport Copy & Photo Required • 99.8% Approval Rate',
    applicationId: 'VISA-UAE-66109',
    category: '30-Day Express Tourist Visa',
    approvalWindow: 'Within 24-48 Hours (WhatsApp / Email)',
  },
  {
    id: '2',
    countryName: 'THAILAND EXPRESS E-VISA',
    validity: '60 DAYS TOURIST ENTRY',
    price: '₹3,200',
    processingTime: '3-4 DAYS APPROVAL',
    features: 'Skip Airport Queues with Pre-approved Entry',
    applicationId: 'VISA-THAI-88219',
    category: '60-Day Tourist Entry Visa',
    approvalWindow: 'Within 3-4 Working Days',
  },
  {
    id: '3',
    countryName: 'VIETNAM TOURIST E-VISA',
    validity: '30 DAYS MULTI ENTRY',
    price: '₹2,800',
    processingTime: '48 HR APPROVAL',
    features: 'Instant Digital Entry Pass for Hanoi, Da Nang & HCMC',
    applicationId: 'VISA-VN-33918',
    category: '30-Day Multi-Entry eVisa',
    approvalWindow: 'Within 48 Hours',
  },
];

export default function TravelModeScreen({ onClose }: TravelModeScreenProps) {
  const { userProfile } = useAuthStore();
  const [activePortal, setActivePortal] = useState<PortalType>('DASHBOARD');
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isInsuranceAdded, setIsInsuranceAdded] = useState(false);
  const [successData, setSuccessData] = useState<BookingSuccessData | null>(null);

  // Field focus states to highlight outer container without inner black box
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Active inline dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // 1. Flight search & booking state (SEARCH -> RESULTS -> CONFIRMED)
  const [flightStep, setFlightStep] = useState<'SEARCH' | 'RESULTS' | 'CONFIRMED'>('SEARCH');
  const [selectedFlight, setSelectedFlight] = useState<FlightItem | null>(null);
  const [flightOrigin, setFlightOrigin] = useState('Saharsa (SBY)');
  const [flightDest, setFlightDest] = useState('New Delhi (DEL)');
  const [flightDate, setFlightDate] = useState('18-07-2026');
  const [flightClass, setFlightClass] = useState('Economy');

  // 2. Train search & booking state (SEARCH -> RESULTS -> CHECKOUT -> CONFIRMED)
  const [trainStep, setTrainStep] = useState<'SEARCH' | 'RESULTS' | 'CHECKOUT' | 'CONFIRMED'>('SEARCH');
  const [selectedTrain, setSelectedTrain] = useState<TrainItem | null>(null);
  const [selectedTrainClass, setSelectedTrainClass] = useState('3A');
  const [trainSubTab, setTrainSubTab] = useState<'SEARCH' | 'PNR'>('SEARCH');
  const [pnrInput, setPnrInput] = useState('2849102847');
  const [pnrResult, setPnrResult] = useState<{
    pnr: string;
    train: string;
    route: string;
    date: string;
    status: string;
    coach: string;
    berth: string;
    classType: string;
    charting: string;
  } | null>(null);
  const [trainOrigin, setTrainOrigin] = useState('Saharsa Jn (SHC)');
  const [trainDest, setTrainDest] = useState('Patna Jn (PNBE)');
  const [trainDate, setTrainDate] = useState('19-07-2026');

  // 3. Bus search & booking state (SEARCH -> RESULTS -> SEAT_SELECTION -> CONFIRMED)
  const [busStep, setBusStep] = useState<'SEARCH' | 'RESULTS' | 'SEAT_SELECTION' | 'CONFIRMED'>('SEARCH');
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [selectedBusSeat, setSelectedBusSeat] = useState('R2');
  const [busOrigin, setBusOrigin] = useState('Saharsa Bus Stand');
  const [busDest, setBusDest] = useState('Patna Meethapur');
  const [busDate, setBusDate] = useState('18-07-2026');
  const [busType, setBusType] = useState('AC Sleeper (2+1)');

  // 4. Hotel search & booking state (SEARCH -> RESULTS -> RESERVATION -> CONFIRMED)
  const [hotelStep, setHotelStep] = useState<'SEARCH' | 'RESULTS' | 'RESERVATION' | 'CONFIRMED'>('SEARCH');
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState('Premium Deluxe');
  const [reservationNights, setReservationNights] = useState('1');
  const [hotelLocation, setHotelLocation] = useState('Patna');
  const [hotelDate, setHotelDate] = useState('20-07-2026');
  const [hotelGuests, setHotelGuests] = useState('1 Room, 2 Adults');

  // 5. Holiday tour booking state (PACKAGES -> ITINERARY -> CONFIRMED)
  const [holidayStep, setHolidayStep] = useState<'PACKAGES' | 'ITINERARY' | 'CONFIRMED'>('PACKAGES');
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayItem | null>(null);

  // 6. Visa express service state (SERVICES -> CONFIRMED)
  const [visaStep, setVisaStep] = useState<'SERVICES' | 'CONFIRMED'>('SERVICES');
  const [selectedVisa, setSelectedVisa] = useState<VisaItem | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSwapAirports = () => {
    const temp = flightOrigin;
    setFlightOrigin(flightDest);
    setFlightDest(temp);
  };

  const handleSwapBusStops = () => {
    const temp = busOrigin;
    setBusOrigin(busDest);
    setBusDest(temp);
  };

  const handleToggleInsurance = () => {
    setIsInsuranceAdded((prev) => !prev);
    if (!isInsuranceAdded) {
      if (Platform.OS === 'web') {
        window.alert('Travel Insurance Added! Coverage of up to ₹10 Lakhs active for your upcoming travel.');
      } else {
        Alert.alert('Insurance Active', 'Travel Insurance coverage of ₹10 Lakhs added for ₹49.');
      }
    }
  };

  const handleConfirmBooking = (title: string, category: string, route: string, price: string) => {
    const randomPNR = 'AOLO' + Math.floor(100000 + Math.random() * 900000);
    setSuccessData({
      title,
      category,
      pnr: randomPNR,
      route,
      price,
    });
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Mobile-Constrained Viewport (Phone layout, prevents wide stretching) */}
      <View style={styles.mobileViewport}>
        {/* Top Floating Header (Menu left, Weather right) */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.menuSquareBtn} activeOpacity={0.8} onPress={onClose}>
            <Menu size={22} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.weatherPill}
            activeOpacity={0.8}
            onPress={() => setShowWeatherModal(true)}
          >
            <Sun size={20} color="#84CC16" />
            <View style={styles.weatherTextCol}>
              <Text style={styles.weatherTemp}>27°</Text>
              <Text style={styles.weatherFeels}>FEELS 32°</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Subheader: Back Button & Portal Badge */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.backPillBtn}
            onPress={() => {
              if (activePortal === 'DASHBOARD') {
                onClose();
              } else if (activePortal === 'FLIGHTS') {
                if (flightStep === 'CONFIRMED') setFlightStep('RESULTS');
                else if (flightStep === 'RESULTS') setFlightStep('SEARCH');
                else setActivePortal('DASHBOARD');
              } else if (activePortal === 'TRAINS') {
                if (trainStep === 'CONFIRMED') setTrainStep('CHECKOUT');
                else if (trainStep === 'CHECKOUT') setTrainStep('RESULTS');
                else if (trainStep === 'RESULTS') setTrainStep('SEARCH');
                else setActivePortal('DASHBOARD');
              } else if (activePortal === 'BUSES') {
                if (busStep === 'CONFIRMED') setBusStep('SEAT_SELECTION');
                else if (busStep === 'SEAT_SELECTION') setBusStep('RESULTS');
                else if (busStep === 'RESULTS') setBusStep('SEARCH');
                else setActivePortal('DASHBOARD');
              } else if (activePortal === 'HOTELS') {
                if (hotelStep === 'CONFIRMED') setHotelStep('RESERVATION');
                else if (hotelStep === 'RESERVATION') setHotelStep('RESULTS');
                else if (hotelStep === 'RESULTS') setHotelStep('SEARCH');
                else setActivePortal('DASHBOARD');
              } else if (activePortal === 'HOLIDAYS') {
                if (holidayStep === 'CONFIRMED') setHolidayStep('ITINERARY');
                else if (holidayStep === 'ITINERARY') setHolidayStep('PACKAGES');
                else setActivePortal('DASHBOARD');
              } else if (activePortal === 'VISA') {
                if (visaStep === 'CONFIRMED') setVisaStep('SERVICES');
                else setActivePortal('DASHBOARD');
              } else {
                setActivePortal('DASHBOARD');
              }
            }}
            activeOpacity={0.8}
          >
            <ArrowLeft size={15} color="#0F172A" />
            <Text style={styles.backPillText}>
              {activePortal === 'DASHBOARD' ? 'BACK TO LOCAL CABS' : 'BACK TO DASHBOARD'}
            </Text>
          </TouchableOpacity>

          <View style={[styles.portalBadge, activePortal === 'FLIGHTS' && styles.portalBadgeBlue]}>
            <Text style={[styles.portalBadgeText, activePortal === 'FLIGHTS' && styles.portalBadgeTextBlue]}>
              {activePortal === 'DASHBOARD' && 'TRAVEL MODE'}
              {activePortal === 'FLIGHTS' && 'FLIGHTS PORTAL'}
              {activePortal === 'TRAINS' && 'TRAINS PORTAL'}
              {activePortal === 'BUSES' && 'BUSES PORTAL'}
              {activePortal === 'HOTELS' && 'HOTELS PORTAL'}
              {activePortal === 'HOLIDAYS' && 'PACKAGES PORTAL'}
              {activePortal === 'VISA' && 'VISA PORTAL'}
            </Text>
          </View>
        </View>

        {/* Main Scroll Content */}
        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===================== VIEW 1: DASHBOARD ===================== */}
          {activePortal === 'DASHBOARD' && (
            <>
              {/* Welcome Headline */}
              <View style={styles.welcomeBox}>
                <Text style={styles.welcomeSubtitle}>EXPLORE & BOOK</Text>
                <Text style={styles.welcomeTitle}>
                  Where would you like to escape next, {userProfile?.name?.split(' ')[0] || 'Yuvraj'}?
                </Text>
              </View>

              {/* 5 Main Grid Cards */}
              <View style={styles.gridContainer}>
                {/* Flights */}
                <TouchableOpacity
                  style={styles.gridCard}
                  activeOpacity={0.85}
                  onPress={() => setActivePortal('FLIGHTS')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                    <Plane size={24} color="#0284C7" />
                  </View>
                  <Text style={styles.gridCardTitle}>Flights</Text>
                  <Text style={styles.gridCardSub}>Domestic & International</Text>
                </TouchableOpacity>

                {/* Trains */}
                <TouchableOpacity
                  style={styles.gridCard}
                  activeOpacity={0.85}
                  onPress={() => setActivePortal('TRAINS')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                    <Train size={24} color="#D97706" />
                  </View>
                  <Text style={styles.gridCardTitle}>Trains</Text>
                  <Text style={styles.gridCardSub}>Vande Bharat & Express</Text>
                </TouchableOpacity>

                {/* Sleeper Buses */}
                <TouchableOpacity
                  style={styles.gridCard}
                  activeOpacity={0.85}
                  onPress={() => setActivePortal('BUSES')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Bus size={24} color="#16A34A" />
                  </View>
                  <Text style={styles.gridCardTitle}>Sleeper Buses</Text>
                  <Text style={styles.gridCardSub}>AC Seater & Sleeper</Text>
                </TouchableOpacity>

                {/* Hotels & Stays */}
                <TouchableOpacity
                  style={styles.gridCard}
                  activeOpacity={0.85}
                  onPress={() => setActivePortal('HOTELS')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#ffe8e8ff' }]}>
                    <Building size={24} color="#f31d1d" />
                  </View>
                  <Text style={styles.gridCardTitle}>Hotels & Stays</Text>
                  <Text style={styles.gridCardSub}>Resorts & Luxury</Text>
                </TouchableOpacity>

                {/* Holidays & Tour Packages */}
                <TouchableOpacity
                  style={[styles.gridCard, { width: '100%' }]}
                  activeOpacity={0.85}
                  onPress={() => setActivePortal('HOLIDAYS')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#FFE4E6' }]}>
                    <Globe size={24} color="#E11D48" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gridCardTitle}>Holidays & Tour Packages</Text>
                    <Text style={styles.gridCardSub}>Darjeeling, Nepal, Bodh Gaya & Custom Itineraries</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Travel Services Section */}
              <Text style={styles.sectionHeaderTitle}>TRAVEL SERVICES & INSURANCE</Text>

              {/* Insurance Row */}
              <View style={styles.serviceRowCard}>
                <View style={[styles.serviceIconBox, { backgroundColor: '#FEF9C3' }]}>
                  <Shield size={20} color="#CA8A04" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>Travel Insurance</Text>
                  <Text style={styles.serviceSub}>Coverage up to ₹10 Lakhs for flight/train delays & baggage loss</Text>
                </View>
                <TouchableOpacity
                  style={[styles.addServiceBtn, isInsuranceAdded && styles.addedServiceBtn]}
                  onPress={handleToggleInsurance}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.addServiceText, isInsuranceAdded && styles.addedServiceText]}>
                    {isInsuranceAdded ? 'ADDED ✓' : 'ADD ₹49'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Visa Services Row */}
              <View style={styles.serviceRowCard}>
                <View style={[styles.serviceIconBox, { backgroundColor: '#E0E7FF' }]}>
                  <Ticket size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>Visa Services</Text>
                  <Text style={styles.serviceSub}>Express e-Visa assistance for Dubai, Thailand & Vietnam</Text>
                </View>
                <TouchableOpacity
                  style={styles.addServiceBtn}
                  onPress={() => setActivePortal('VISA')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addServiceText}>APPLY</Text>
                </TouchableOpacity>
              </View>

              {/* Promo Codes */}
              <Text style={styles.sectionHeaderTitle}>TRAVEL PROMO CODES</Text>

              <View style={styles.promoCard}>
                <View style={{ flex: 1 }}>
                  <View style={styles.promoHeaderRow}>
                    <Text style={styles.promoCodeBadge}>TRAVELAOLO</Text>
                    <Text style={styles.promoDiscount}>Flat 15% Off</Text>
                  </View>
                  <Text style={styles.promoDesc}>Save up to ₹800 on Flight + Intercity Cab combo bookings.</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy('TRAVELAOLO')}
                  activeOpacity={0.8}
                >
                  {copiedCode === 'TRAVELAOLO' ? (
                    <Check size={16} color="#0A0A0A" />
                  ) : (
                    <Copy size={16} color="#0A0A0A" />
                  )}
                  <Text style={styles.copyBtnText}>
                    {copiedCode === 'TRAVELAOLO' ? 'COPIED' : 'TAP TO COPY'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.promoCard}>
                <View style={{ flex: 1 }}>
                  <View style={styles.promoHeaderRow}>
                    <Text style={styles.promoCodeBadge}>FLIGHT200</Text>
                    <Text style={styles.promoDiscount}>Flat ₹200 Off</Text>
                  </View>
                  <Text style={styles.promoDesc}>Instant discount on all domestic flight ticket bookings.</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy('FLIGHT200')}
                  activeOpacity={0.8}
                >
                  {copiedCode === 'FLIGHT200' ? (
                    <Check size={16} color="#0A0A0A" />
                  ) : (
                    <Copy size={16} color="#0A0A0A" />
                  )}
                  <Text style={styles.copyBtnText}>
                    {copiedCode === 'FLIGHT200' ? 'COPIED' : 'TAP TO COPY'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}


          {/* ===================== VIEW 2: FLIGHTS PORTAL ===================== */}
          {activePortal === 'FLIGHTS' && (
            <>
              {/* STEP 1: SEARCH FORM */}
              {flightStep === 'SEARCH' && (
                <View style={styles.portalCard}>
                  <View style={styles.portalTitleRow}>
                    <Plane size={22} color="#0066FF" />
                    <Text style={styles.portalTitleText}>BOOK SKY ROUTES</Text>
                  </View>

                  {/* Departure Airport Field */}
                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>DEPARTURE AIRPORT</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'flightOrigin' && styles.inputContainerFocused,
                      ]}
                    >
                      <MapPin size={18} color="#8EA2B8" />
                      <TextInput
                        style={styles.cleanTextInput}
                        value={flightOrigin}
                        onChangeText={setFlightOrigin}
                        onFocus={() => setFocusedField('flightOrigin')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter departure airport"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  {/* Swap Button */}
                  <TouchableOpacity
                    style={styles.swapRoundBtn}
                    onPress={handleSwapAirports}
                    activeOpacity={0.8}
                  >
                    <ArrowUpDown size={16} color="#64748B" />
                  </TouchableOpacity>

                  {/* Destination Airport Field */}
                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>DESTINATION AIRPORT</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'flightDest' && styles.inputContainerFocused,
                      ]}
                    >
                      <MapPin size={18} color="#8EA2B8" />
                      <TextInput
                        style={styles.cleanTextInput}
                        value={flightDest}
                        onChangeText={setFlightDest}
                        onFocus={() => setFocusedField('flightDest')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter destination airport"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  {/* Two Column Row (Date & Cabin Class) */}
                  <View style={[styles.rowFields, { zIndex: activeDropdown?.startsWith('flight') ? 100 : 20 }]}>
                    {/* Journey Date */}
                    <View style={[styles.formGroup, { flex: 1, position: 'relative', zIndex: activeDropdown === 'flight_date' ? 110 : 1 }]}>
                      <Text style={styles.fieldLabel}>JOURNEY DATE</Text>
                      <TouchableOpacity
                        style={[
                          styles.inputContainerSmall,
                          activeDropdown === 'flight_date' && styles.inputContainerSmallActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setActiveDropdown(activeDropdown === 'flight_date' ? null : 'flight_date')
                        }
                      >
                        <Calendar size={16} color={activeDropdown === 'flight_date' ? '#0066FF' : '#8EA2B8'} />
                        <Text style={styles.fieldSmallText}>{flightDate}</Text>
                        <Calendar size={13} color="#CBD5E1" />
                      </TouchableOpacity>

                      {activeDropdown === 'flight_date' && (
                        <View style={styles.inlineDropdownMenu}>
                          {QUICK_DATES.map((item) => {
                            const isSelected = flightDate === item.date;
                            return (
                              <TouchableOpacity
                                key={item.date}
                                style={[
                                  styles.inlineDropdownItem,
                                  isSelected && styles.inlineDropdownItemSelected,
                                ]}
                                onPress={() => {
                                  setFlightDate(item.date);
                                  setActiveDropdown(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.inlineDropdownItemText,
                                    isSelected && styles.inlineDropdownItemTextSelected,
                                  ]}
                                >
                                  {item.date}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>

                    {/* Cabin Class */}
                    <View style={[styles.formGroup, { flex: 1, position: 'relative', zIndex: activeDropdown === 'flight_class' ? 110 : 1 }]}>
                      <Text style={styles.fieldLabel}>CABIN CLASS</Text>
                      <TouchableOpacity
                        style={[
                          styles.inputContainerSmall,
                          activeDropdown === 'flight_class' && styles.inputContainerSmallActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setActiveDropdown(activeDropdown === 'flight_class' ? null : 'flight_class')
                        }
                      >
                        <Text style={styles.fieldSmallText} numberOfLines={1}>
                          {flightClass}
                        </Text>
                        <ChevronDown
                          size={16}
                          color={activeDropdown === 'flight_class' ? '#0066FF' : '#0F172A'}
                        />
                      </TouchableOpacity>

                      {activeDropdown === 'flight_class' && (
                        <View style={styles.inlineDropdownMenu}>
                          {FLIGHT_CLASSES.map((item) => {
                            const isSelected = flightClass === item.name;
                            return (
                              <TouchableOpacity
                                key={item.name}
                                style={[
                                  styles.inlineDropdownItem,
                                  isSelected && styles.inlineDropdownItemSelected,
                                ]}
                                onPress={() => {
                                  setFlightClass(item.name);
                                  setActiveDropdown(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.inlineDropdownItemText,
                                    isSelected && styles.inlineDropdownItemTextSelected,
                                  ]}
                                >
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Primary Blue CTA Button */}
                  <TouchableOpacity
                    style={styles.primaryBlueBtn}
                    onPress={() => {
                      setActiveDropdown(null);
                      setFlightStep('RESULTS');
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBlueBtnText}>SEARCH AIRLINES ➔</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: FLIGHT SEARCH RESULTS (2nd Image) */}
              {flightStep === 'RESULTS' && (
                <View style={styles.flightResultsWrapper}>
                  {/* Top Result Count & Edit Search Bar */}
                  <View style={styles.flightResultsTopBar}>
                    <Text style={styles.flightResultsCountText}>
                      3 FLIGHTS FOUND (SAHARSA ➔ NEW)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setFlightStep('SEARCH')}
                      activeOpacity={0.7}
                      style={styles.editSearchTouchable}
                    >
                      <Text style={styles.editSearchBtnText}>EDIT SEARCH</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 3 Flight Cards */}
                  {AVAILABLE_FLIGHTS.map((flight) => (
                    <View key={flight.id} style={styles.flightCard}>
                      {/* Top row: Flight code & Airline Name (left), Price Badge (right) */}
                      <View style={styles.flightCardHeader}>
                        <View>
                          <Text style={styles.flightCodeText}>{flight.code}</Text>
                          <Text style={styles.flightAirlineText}>{flight.airline}</Text>
                        </View>
                        <View style={styles.flightPriceBadge}>
                          <Text style={styles.flightPriceText}>{flight.price}</Text>
                        </View>
                      </View>

                      {/* Subtle Dotted Separator */}
                      <View style={styles.flightDottedDivider} />

                      {/* Flight Timing & Non-Stop Indicator */}
                      <View style={styles.flightTimingRow}>
                        <View style={styles.flightTimeColLeft}>
                          <Text style={styles.flightTimeText}>{flight.departTime}</Text>
                          <Text style={styles.flightTimeSub}>Depart</Text>
                        </View>

                        <View style={styles.flightPathMiddle}>
                          <Text style={styles.flightDurationText}>{flight.duration}</Text>
                          <View style={styles.flightLineTrack}>
                            <View style={styles.flightLineDot} />
                          </View>
                          <Text style={styles.flightTypeText}>{flight.flightType}</Text>
                        </View>

                        <View style={styles.flightTimeColRight}>
                          <Text style={styles.flightTimeText}>{flight.arriveTime}</Text>
                          <Text style={styles.flightTimeSub}>Arrive</Text>
                        </View>
                      </View>

                      {/* Select Cabin Seat Button */}
                      <TouchableOpacity
                        style={styles.selectSeatBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedFlight(flight);
                          setFlightStep('CONFIRMED');
                        }}
                      >
                        <Text style={styles.selectSeatBtnText}>SELECT CABIN SEAT</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* STEP 3: E-TICKET CONFIRMED SCREEN (3rd Image) */}
              {flightStep === 'CONFIRMED' && (
                <View style={styles.confirmedTicketCard}>
                  {/* Green Checkmark Circle Icon */}
                  <View style={styles.confirmedCheckBadge}>
                    <Check size={28} color="#059669" strokeWidth={3} />
                  </View>

                  <Text style={styles.confirmedTitle}>E-TICKET CONFIRMED!</Text>
                  <Text style={styles.confirmedSubtitle}>
                    {selectedFlight?.airline === 'INDIGO'
                      ? 'IndiGo'
                      : selectedFlight?.airline === 'AIR INDIA'
                        ? 'Air India'
                        : selectedFlight?.airline === 'SPICEJET'
                          ? 'SpiceJet'
                          : 'IndiGo'}{' '}
                    E-Ticket successfully generated and synched with your profile.
                  </Text>

                  {/* Mint-Green Ticket Details Box */}
                  <View style={styles.confirmedDetailsBox}>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>PNR Code:</Text>
                      <Text style={styles.confirmedDetailValMono}>
                        {selectedFlight?.pnr || '6E9XF28'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Seat:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedFlight?.seat || '12A (Window)'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Boarding Gate:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedFlight?.gate || 'Gate 04B'}
                      </Text>
                    </View>
                  </View>

                  {/* Finish and Return Action Button */}
                  <TouchableOpacity
                    style={styles.finishReturnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setFlightStep('SEARCH');
                      setActivePortal('DASHBOARD');
                    }}
                  >
                    <Text style={styles.finishReturnBtnText}>FINISH AND RETURN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ===================== VIEW 3: TRAINS PORTAL ===================== */}
          {activePortal === 'TRAINS' && (
            <>
              {/* STEP 1: SEARCH RAILWAYS & LIVE PNR CHECK */}
              {trainStep === 'SEARCH' && (
                <View>
                  {/* Trains Portal Switcher: Search vs Live PNR Check */}
                  <View style={styles.trainTabSwitcher}>
                    <TouchableOpacity
                      style={[styles.trainTabPill, trainSubTab === 'SEARCH' && styles.trainTabPillActive]}
                      onPress={() => {
                        setTrainSubTab('SEARCH');
                        setActiveDropdown(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Search size={14} color={trainSubTab === 'SEARCH' ? '#FFFFFF' : '#64748B'} />
                      <Text
                        style={[
                          styles.trainTabPillText,
                          trainSubTab === 'SEARCH' && styles.trainTabPillTextActive,
                        ]}
                      >
                        SEARCH RAILWAYS
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.trainTabPill, trainSubTab === 'PNR' && styles.trainTabPillActive]}
                      onPress={() => {
                        setTrainSubTab('PNR');
                        setActiveDropdown(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <FileText size={14} color={trainSubTab === 'PNR' ? '#FFFFFF' : '#64748B'} />
                      <Text
                        style={[
                          styles.trainTabPillText,
                          trainSubTab === 'PNR' && styles.trainTabPillTextActive,
                        ]}
                      >
                        LIVE PNR CHECK
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* TAB 1: SEARCH RAILWAYS */}
                  {trainSubTab === 'SEARCH' && (
                    <View style={styles.portalCard}>
                      <View style={styles.portalTitleRow}>
                        <Train size={22} color="#D97706" />
                        <Text style={styles.portalTitleText}>INDIAN RAILWAYS SYNC</Text>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.fieldLabel}>FROM STATION</Text>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedField === 'trainOrigin' && styles.inputContainerFocused,
                          ]}
                        >
                          <MapPin size={18} color="#8EA2B8" />
                          <TextInput
                            style={styles.cleanTextInput}
                            value={trainOrigin}
                            onChangeText={setTrainOrigin}
                            onFocus={() => setFocusedField('trainOrigin')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter from station"
                            placeholderTextColor="#94A3B8"
                          />
                        </View>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.fieldLabel}>TO STATION</Text>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedField === 'trainDest' && styles.inputContainerFocused,
                          ]}
                        >
                          <MapPin size={18} color="#8EA2B8" />
                          <TextInput
                            style={styles.cleanTextInput}
                            value={trainDest}
                            onChangeText={setTrainDest}
                            onFocus={() => setFocusedField('trainDest')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter to station"
                            placeholderTextColor="#94A3B8"
                          />
                        </View>
                      </View>

                      {/* Full-width Date of Journey */}
                      <View style={[styles.formGroup, { position: 'relative', zIndex: activeDropdown === 'train_date' ? 110 : 1 }]}>
                        <Text style={styles.fieldLabel}>DATE OF JOURNEY</Text>
                        <TouchableOpacity
                          style={[
                            styles.inputContainerSmall,
                            { width: '100%' },
                            activeDropdown === 'train_date' && styles.inputContainerSmallActive,
                          ]}
                          activeOpacity={0.8}
                          onPress={() =>
                            setActiveDropdown(activeDropdown === 'train_date' ? null : 'train_date')
                          }
                        >
                          <Calendar size={16} color={activeDropdown === 'train_date' ? '#D97706' : '#8EA2B8'} />
                          <Text style={styles.fieldSmallText}>{trainDate}</Text>
                          <Calendar size={13} color="#CBD5E1" />
                        </TouchableOpacity>

                        {activeDropdown === 'train_date' && (
                          <View style={styles.inlineDropdownMenu}>
                            {QUICK_DATES.map((item) => {
                              const isSelected = trainDate === item.date;
                              return (
                                <TouchableOpacity
                                  key={item.date}
                                  style={[
                                    styles.inlineDropdownItem,
                                    isSelected && styles.inlineDropdownItemSelected,
                                  ]}
                                  onPress={() => {
                                    setTrainDate(item.date);
                                    setActiveDropdown(null);
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <Text
                                    style={[
                                      styles.inlineDropdownItemText,
                                      isSelected && styles.inlineDropdownItemTextSelected,
                                    ]}
                                  >
                                    {item.date} ({item.label})
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[styles.primaryBlueBtn, { backgroundColor: '#D97706' }]}
                        onPress={() => {
                          setActiveDropdown(null);
                          setTrainStep('RESULTS');
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.primaryBlueBtnText}>SEARCH IRCTC TRAINS ➔</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* TAB 2: LIVE PNR CHECK */}
                  {trainSubTab === 'PNR' && (
                    <View style={styles.portalCard}>
                      <View style={styles.portalTitleRow}>
                        <Ticket size={22} color="#D97706" />
                        <Text style={styles.portalTitleText}>LIVE PNR STATUS CHECK</Text>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.fieldLabel}>ENTER 10-DIGIT PNR NUMBER</Text>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedField === 'pnrNumber' && styles.inputContainerFocused,
                          ]}
                        >
                          <Ticket size={18} color="#8EA2B8" />
                          <TextInput
                            style={styles.cleanTextInput}
                            value={pnrInput}
                            onChangeText={setPnrInput}
                            onFocus={() => setFocusedField('pnrNumber')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter 10-digit PNR"
                            placeholderTextColor="#94A3B8"
                            keyboardType="numeric"
                            maxLength={10}
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[styles.primaryBlueBtn, { backgroundColor: '#D97706' }]}
                        onPress={() => {
                          if (!pnrInput || pnrInput.length < 5) {
                            if (Platform.OS === 'web') {
                              window.alert('Please enter a valid 10-digit PNR number');
                            } else {
                              Alert.alert('Invalid PNR', 'Please enter a valid 10-digit PNR number');
                            }
                            return;
                          }
                          setPnrResult({
                            pnr: pnrInput,
                            train: '12309 Rajdhani Express',
                            route: `${trainOrigin} → ${trainDest}`,
                            date: trainDate,
                            status: 'CNF (Confirmed)',
                            coach: 'B3',
                            berth: '42 (Side Lower)',
                            classType: 'AC 3 Tier (3A)',
                            charting: 'Chart Prepared',
                          });
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.primaryBlueBtnText}>CHECK LIVE STATUS ➔</Text>
                      </TouchableOpacity>

                      {pnrResult && (
                        <View style={styles.pnrStatusResultCard}>
                          <View style={styles.pnrStatusHeader}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.pnrNumberText}>PNR: {pnrResult.pnr}</Text>
                              <Text style={styles.pnrTrainName}>{pnrResult.train}</Text>
                              <Text style={styles.pnrRouteText}>{pnrResult.route}</Text>
                            </View>
                            <View style={styles.pnrConfirmedBadge}>
                              <Check size={14} color="#0F172A" />
                              <Text style={styles.pnrConfirmedText}>CNF</Text>
                            </View>
                          </View>

                          <View style={styles.pnrDivider} />

                          <View style={styles.pnrDetailsGrid}>
                            <View style={styles.pnrDetailCol}>
                              <Text style={styles.pnrDetailLabel}>COACH</Text>
                              <Text style={styles.pnrDetailValue}>{pnrResult.coach}</Text>
                            </View>
                            <View style={styles.pnrDetailCol}>
                              <Text style={styles.pnrDetailLabel}>BERTH</Text>
                              <Text style={styles.pnrDetailValue}>{pnrResult.berth}</Text>
                            </View>
                            <View style={styles.pnrDetailCol}>
                              <Text style={styles.pnrDetailLabel}>CLASS</Text>
                              <Text style={styles.pnrDetailValue}>{pnrResult.classType}</Text>
                            </View>
                            <View style={styles.pnrDetailCol}>
                              <Text style={styles.pnrDetailLabel}>CHARTING</Text>
                              <Text style={[styles.pnrDetailValue, { color: '#16A34A' }]}>{pnrResult.charting}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* STEP 2: AVAILABLE TRAINS RESULTS (Matching Screenshot 1) */}
              {trainStep === 'RESULTS' && (
                <View style={styles.flightResultsWrapper}>
                  <View style={styles.flightResultsTopBar}>
                    <Text style={styles.flightResultsCountText}>
                      3 TRAINS FOUND ({trainOrigin.split(' ')[0].toUpperCase()} ➔ {trainDest.split(' ')[0].toUpperCase()})
                    </Text>
                    <TouchableOpacity
                      onPress={() => setTrainStep('SEARCH')}
                      activeOpacity={0.7}
                      style={styles.editSearchTouchable}
                    >
                      <Text style={[styles.editSearchBtnText, { color: '#D97706' }]}>EDIT SEARCH</Text>
                    </TouchableOpacity>
                  </View>

                  {AVAILABLE_TRAINS.map((train) => (
                    <View key={train.id} style={styles.trainCard}>
                      <View style={styles.trainCardTopRow}>
                        <View style={styles.trainNumberBadge}>
                          <Text style={styles.trainNumberBadgeText}>{train.trainNo}</Text>
                        </View>
                        <Text style={styles.trainPriceText}>{train.price}</Text>
                      </View>

                      <Text style={styles.trainNameHeading}>{train.trainName}</Text>

                      <View style={styles.trainTimingsDottedDivider} />

                      <View style={styles.trainTimingRow}>
                        <Text style={styles.trainTimeText}>Dep:  {train.departTime}</Text>
                        <Text style={styles.trainDurationGray}>{train.duration}</Text>
                        <Text style={styles.trainTimeText}>Arr:  {train.arriveTime}</Text>
                      </View>

                      <View style={styles.trainClassesRow}>
                        {train.classes.map((cls) => (
                          <TouchableOpacity
                            key={cls.code}
                            style={styles.trainClassBox}
                            activeOpacity={0.75}
                            onPress={() => {
                              setSelectedTrain(train);
                              setSelectedTrainClass(cls.code);
                              setTrainStep('CHECKOUT');
                            }}
                          >
                            <Text style={styles.trainClassCode}>{cls.code}</Text>
                            <Text style={styles.trainClassStatus}>{cls.status}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* STEP 3: CONFIRM RAIL TICKET / CHECKOUT (Matching Screenshot 2) */}
              {trainStep === 'CHECKOUT' && (
                <View style={styles.trainCheckoutCard}>
                  <Text style={styles.trainCheckoutTitle}>CONFIRM RAIL TICKET</Text>

                  <View style={styles.trainCheckoutSummaryBox}>
                    <Text style={styles.trainCheckoutTrainName}>
                      {selectedTrain?.trainName || 'VAISHALI EXPRESS'}
                    </Text>
                    <Text style={styles.trainCheckoutSubLine}>
                      Class: {selectedTrainClass || '3A'}   |   Date: {trainDate || '2026-07-19'}
                    </Text>
                    <Text style={styles.trainCheckoutRoute}>
                      {trainOrigin} ➔ {trainDest}
                    </Text>
                  </View>

                  <View style={styles.trainTimingsDottedDivider} />

                  <View style={styles.trainCheckoutPriceRow}>
                    <Text style={styles.trainCheckoutPriceLabel}>Base IRCTC Fare</Text>
                    <Text style={styles.trainCheckoutPriceVal}>{selectedTrain?.price || '₹740'}</Text>
                  </View>

                  <View style={styles.trainCheckoutPriceRow}>
                    <Text style={styles.trainCheckoutTotalLabel}>Total Amount</Text>
                    <Text style={styles.trainCheckoutTotalVal}>{selectedTrain?.price || '₹740'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.trainCheckoutBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setTrainStep('CONFIRMED');
                    }}
                  >
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    <Text style={styles.trainCheckoutBtnText}>COMPLETE IRCTC CHECKOUT</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 4: TRAIN CONFIRMED E-TICKET SCREEN (Matching Screenshot 3) */}
              {trainStep === 'CONFIRMED' && (
                <View style={styles.confirmedTicketCard}>
                  <View style={styles.confirmedCheckBadge}>
                    <Check size={28} color="#059669" strokeWidth={3} />
                  </View>

                  <Text style={styles.confirmedTitle}>RAIL TICKET ISSUED</Text>
                  <Text style={styles.confirmedSubtitle}>
                    IRCTC Confirmed ticket successfully added to your profile.
                  </Text>

                  <View style={styles.confirmedDetailsBox}>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Train:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedTrain?.trainName || 'Vaishali Express'} ({selectedTrain?.trainNo || '12553'})
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>PNR:</Text>
                      <Text style={styles.confirmedDetailValMono}>
                        {selectedTrain?.pnr || '4235891275'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Coach/Berth:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedTrain?.coachBerth || 'S3 / 48 (SL)'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.finishReturnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setTrainStep('SEARCH');
                      setActivePortal('DASHBOARD');
                    }}
                  >
                    <Text style={styles.finishReturnBtnText}>FINISH AND RETURN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ===================== VIEW 4: BUSES PORTAL ===================== */}
          {activePortal === 'BUSES' && (
            <>
              {/* STEP 1: SEARCH BUSES FORM */}
              {busStep === 'SEARCH' && (
                <View style={styles.portalCard}>
                  <View style={styles.portalTitleRow}>
                    <Bus size={22} color="#16A34A" />
                    <Text style={styles.portalTitleText}>BOOK BUS ROUTES</Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>PICKUP POINT</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'busOrigin' && styles.inputContainerFocused,
                      ]}
                    >
                      <MapPin size={18} color="#8EA2B8" />
                      <TextInput
                        style={styles.cleanTextInput}
                        value={busOrigin}
                        onChangeText={setBusOrigin}
                        onFocus={() => setFocusedField('busOrigin')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter pickup stand"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.swapRoundBtn}
                    onPress={handleSwapBusStops}
                    activeOpacity={0.8}
                  >
                    <ArrowUpDown size={16} color="#64748B" />
                  </TouchableOpacity>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>DROPOFF POINT</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'busDest' && styles.inputContainerFocused,
                      ]}
                    >
                      <MapPin size={18} color="#8EA2B8" />
                      <TextInput
                        style={styles.cleanTextInput}
                        value={busDest}
                        onChangeText={setBusDest}
                        onFocus={() => setFocusedField('busDest')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter dropoff stand"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  <View style={[styles.rowFields, { zIndex: activeDropdown?.startsWith('bus') ? 100 : 20 }]}>
                    {/* Bus Journey Date */}
                    <View style={[styles.formGroup, { flex: 1, position: 'relative', zIndex: activeDropdown === 'bus_date' ? 110 : 1 }]}>
                      <Text style={styles.fieldLabel}>JOURNEY DATE</Text>
                      <TouchableOpacity
                        style={[
                          styles.inputContainerSmall,
                          activeDropdown === 'bus_date' && styles.inputContainerSmallActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setActiveDropdown(activeDropdown === 'bus_date' ? null : 'bus_date')
                        }
                      >
                        <Calendar size={16} color={activeDropdown === 'bus_date' ? '#16A34A' : '#8EA2B8'} />
                        <Text style={styles.fieldSmallText}>{busDate}</Text>
                        <Calendar size={13} color="#CBD5E1" />
                      </TouchableOpacity>

                      {activeDropdown === 'bus_date' && (
                        <View style={styles.inlineDropdownMenu}>
                          {QUICK_DATES.map((item) => {
                            const isSelected = busDate === item.date;
                            return (
                              <TouchableOpacity
                                key={item.date}
                                style={[
                                  styles.inlineDropdownItem,
                                  isSelected && styles.inlineDropdownItemSelected,
                                ]}
                                onPress={() => {
                                  setBusDate(item.date);
                                  setActiveDropdown(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.inlineDropdownItemText,
                                    isSelected && styles.inlineDropdownItemTextSelected,
                                  ]}
                                >
                                  {item.date}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>

                    {/* Bus Type */}
                    <View style={[styles.formGroup, { flex: 1, position: 'relative', zIndex: activeDropdown === 'bus_type' ? 110 : 1 }]}>
                      <Text style={styles.fieldLabel}>BUS TYPE</Text>
                      <TouchableOpacity
                        style={[
                          styles.inputContainerSmall,
                          activeDropdown === 'bus_type' && styles.inputContainerSmallActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setActiveDropdown(activeDropdown === 'bus_type' ? null : 'bus_type')
                        }
                      >
                        <Text style={styles.fieldSmallText} numberOfLines={1}>
                          {busType}
                        </Text>
                        <ChevronDown
                          size={16}
                          color={activeDropdown === 'bus_type' ? '#16A34A' : '#0F172A'}
                        />
                      </TouchableOpacity>

                      {activeDropdown === 'bus_type' && (
                        <View style={styles.inlineDropdownMenu}>
                          {BUS_TYPES.map((item) => {
                            const isSelected = busType === item.name;
                            return (
                              <TouchableOpacity
                                key={item.name}
                                style={[
                                  styles.inlineDropdownItem,
                                  isSelected && styles.inlineDropdownItemSelected,
                                ]}
                                onPress={() => {
                                  setBusType(item.name);
                                  setActiveDropdown(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.inlineDropdownItemText,
                                    isSelected && styles.inlineDropdownItemTextSelected,
                                  ]}
                                >
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBlueBtn, { backgroundColor: '#16A34A' }]}
                    onPress={() => {
                      setActiveDropdown(null);
                      setBusStep('RESULTS');
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBlueBtnText}>SEARCH BUSES ➔</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: AVAILABLE BUSES LIST */}
              {busStep === 'RESULTS' && (
                <View style={styles.flightResultsWrapper}>
                  <View style={styles.flightResultsTopBar}>
                    <Text style={styles.flightResultsCountText}>
                      3 BUSES FOUND ({busOrigin.split(' ')[0].toUpperCase()} ➔ {busDest.split(' ')[0].toUpperCase()})
                    </Text>
                    <TouchableOpacity
                      onPress={() => setBusStep('SEARCH')}
                      activeOpacity={0.7}
                      style={styles.editSearchTouchable}
                    >
                      <Text style={[styles.editSearchBtnText, { color: '#16A34A' }]}>EDIT SEARCH</Text>
                    </TouchableOpacity>
                  </View>

                  {AVAILABLE_BUSES.map((bus) => (
                    <View key={bus.id} style={styles.flightCard}>
                      <View style={styles.flightCardHeader}>
                        <View>
                          <Text style={styles.flightCodeText}>{bus.busNo}</Text>
                          <Text style={styles.flightAirlineText}>{bus.operatorName}</Text>
                        </View>
                        <View style={[styles.flightPriceBadge, { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' }]}>
                          <Text style={[styles.flightPriceText, { color: '#16A34A' }]}>{bus.price}</Text>
                        </View>
                      </View>

                      <View style={styles.flightDottedDivider} />

                      <View style={styles.flightTimingRow}>
                        <View style={styles.flightTimeColLeft}>
                          <Text style={styles.flightTimeText}>{bus.departTime}</Text>
                          <Text style={styles.flightTimeSub}>Depart</Text>
                        </View>

                        <View style={styles.flightPathMiddle}>
                          <Text style={styles.flightDurationText}>{bus.duration}</Text>
                          <View style={styles.flightLineTrack}>
                            <View style={[styles.flightLineDot, { backgroundColor: '#16A34A' }]} />
                          </View>
                          <Text style={styles.flightTypeText}>{bus.busType}</Text>
                        </View>

                        <View style={styles.flightTimeColRight}>
                          <Text style={styles.flightTimeText}>{bus.arriveTime}</Text>
                          <Text style={styles.flightTimeSub}>Arrive</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.selectSeatBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedBus(bus);
                          setBusStep('SEAT_SELECTION');
                        }}
                      >
                        <Text style={styles.selectSeatBtnText}>SELECT BUS SEAT</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* STEP 3: SELECT SLEEPER BERTH (Matching Image 2) */}
              {busStep === 'SEAT_SELECTION' && (
                <View style={styles.busBerthCard}>
                  <Text style={styles.busBerthHeaderTitle}>SELECT YOUR SLEEPER BERTH</Text>

                  <View style={styles.busOperatorInfoBox}>
                    <Text style={styles.busOperatorNameText}>
                      {selectedBus?.operatorName || 'ROYAL AC VOLVO'}
                    </Text>
                    <Text style={styles.busOperatorSubText}>
                      {selectedBus?.busType || 'Multi-Axle Semi-Sleeper'}
                    </Text>
                  </View>

                  <View style={styles.busLayoutBox}>
                    <Text style={styles.busCabinLabel}>FRONT OF BUS / DRIVER CABIN</Text>

                    {BUS_BERTHS.map((berthRow, idx) => {
                      const isLeftSelected = selectedBusSeat === berthRow.leftCode;
                      const isRightSelected = selectedBusSeat === berthRow.rightCode;

                      return (
                        <View key={idx} style={styles.busSeatsRow}>
                          <TouchableOpacity
                            style={[
                              styles.busSeatItem,
                              isLeftSelected && styles.busSeatItemSelected,
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setSelectedBusSeat(berthRow.leftCode)}
                          >
                            <Text
                              style={[
                                styles.busSeatCodeText,
                                isLeftSelected && styles.busSeatCodeTextSelected,
                              ]}
                            >
                              {berthRow.leftCode}
                            </Text>
                            <Text
                              style={[
                                styles.busSeatTypeText,
                                isLeftSelected && styles.busSeatTypeTextSelected,
                              ]}
                            >
                              {berthRow.leftType}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.busSeatItem,
                              isRightSelected && styles.busSeatItemSelected,
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setSelectedBusSeat(berthRow.rightCode)}
                          >
                            <Text
                              style={[
                                styles.busSeatCodeText,
                                isRightSelected && styles.busSeatCodeTextSelected,
                              ]}
                            >
                              {berthRow.rightCode}
                            </Text>
                            <Text
                              style={[
                                styles.busSeatTypeText,
                                isRightSelected && styles.busSeatTypeTextSelected,
                              ]}
                            >
                              {berthRow.rightType}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                    <View style={styles.busLegendRow}>
                      <View style={styles.busLegendItem}>
                        <View style={styles.busLegendDotAvailable} />
                        <Text style={styles.busLegendText}>AVAILABLE</Text>
                      </View>
                      <View style={styles.busLegendItem}>
                        <View style={styles.busLegendDotSelected} />
                        <Text style={styles.busLegendText}>SELECTED</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.trainTimingsDottedDivider} />

                  <View style={styles.busFareSection}>
                    <View style={styles.busFareRow}>
                      <Text style={styles.busFareLabel}>Selected Seats (1):</Text>
                      <Text style={styles.busFareVal}>{selectedBus?.price || '₹650'}</Text>
                    </View>
                    <Text style={styles.busSeatSubLabel}>{selectedBusSeat}</Text>

                    <View style={styles.busFareRow}>
                      <Text style={styles.trainCheckoutTotalLabel}>Total Amount</Text>
                      <Text style={styles.trainCheckoutTotalVal}>{selectedBus?.price || '₹650'}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.busActionGreenBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setBusStep('CONFIRMED');
                    }}
                  >
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    <Text style={styles.busActionGreenBtnText}>COMPLETE TICKET ISSUANCE</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 4: BUS CONFIRMED E-TICKET SCREEN (Matching Image 1) */}
              {busStep === 'CONFIRMED' && (
                <View style={styles.confirmedTicketCard}>
                  <View style={styles.confirmedCheckBadge}>
                    <Check size={28} color="#059669" strokeWidth={3} />
                  </View>

                  <Text style={styles.confirmedTitle}>BUS TICKET CONFIRMED</Text>
                  <Text style={styles.confirmedSubtitle}>
                    Sleeper coach boarding ticket successfully generated.
                  </Text>

                  <View style={styles.confirmedDetailsBox}>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Coach Operator:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedBus?.operatorName || 'Royal AC Volvo'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Seats Selected:</Text>
                      <Text style={styles.confirmedDetailValMono}>
                        {selectedBusSeat || 'R2'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Boarding:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedBus?.boardingPoint || 'Aolo Transit Terminal (Saharsa)'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.finishReturnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setBusStep('SEARCH');
                      setActivePortal('DASHBOARD');
                    }}
                  >
                    <Text style={styles.finishReturnBtnText}>FINISH AND RETURN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ===================== VIEW 5: HOTELS PORTAL ===================== */}
          {activePortal === 'HOTELS' && (
            <>
              {/* STEP 1: SEARCH HOTELS FORM */}
              {hotelStep === 'SEARCH' && (
                <View style={styles.hotelSearchCard}>
                  <View style={styles.hotelTitleRow}>
                    <Building size={20} color="#E11D48" />
                    <Text style={styles.hotelTitleText}>LUXURY & HOURLY HOTELS</Text>
                  </View>

                  <View style={styles.hotelFormGroup}>
                    <Text style={styles.hotelFormLabel}>DESTINATION CITY</Text>
                    <View
                      style={[
                        styles.hotelSearchInputBox,
                        focusedField === 'hotelLocation' && styles.hotelSearchInputBoxFocused,
                      ]}
                    >
                      <TextInput
                        style={styles.hotelCleanTextInput}
                        value={hotelLocation}
                        onChangeText={setHotelLocation}
                        onFocus={() => setFocusedField('hotelLocation')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Patna"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  <View style={[styles.rowFields, { zIndex: activeDropdown?.startsWith('hotel') ? 100 : 20, marginTop: 14 }]}>
                    {/* Hotel Check-in Date */}
                    <View style={[styles.formGroup, { flex: 1.15, position: 'relative', zIndex: activeDropdown === 'hotel_date' ? 110 : 1, marginBottom: 0 }]}>
                      <Text style={styles.hotelFormLabel}>CHECK IN DATE</Text>
                      <TouchableOpacity
                        style={[
                          styles.hotelInputContainerSmall,
                          activeDropdown === 'hotel_date' && styles.hotelInputContainerSmallActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setActiveDropdown(activeDropdown === 'hotel_date' ? null : 'hotel_date')
                        }
                      >
                        <Text style={styles.hotelFieldValText}>{hotelDate}</Text>
                        <Calendar size={15} color="#64748B" />
                      </TouchableOpacity>

                      {activeDropdown === 'hotel_date' && (
                        <View style={styles.inlineDropdownMenu}>
                          {QUICK_DATES.map((item) => {
                            const isSelected = hotelDate === item.date;
                            return (
                              <TouchableOpacity
                                key={item.date}
                                style={[
                                  styles.inlineDropdownItem,
                                  isSelected && styles.inlineDropdownItemSelected,
                                ]}
                                onPress={() => {
                                  setHotelDate(item.date);
                                  setActiveDropdown(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.inlineDropdownItemText,
                                    isSelected && styles.inlineDropdownItemTextSelected,
                                  ]}
                                >
                                  {item.date}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>

                    {/* Hotel Nights Count with Increment / Decrement Stepper */}
                    <View style={[styles.formGroup, { flex: 0.85, marginBottom: 0 }]}>
                      <Text style={styles.hotelFormLabel}>NIGHTS COUNT</Text>
                      <View style={styles.hotelInputContainerSmall}>
                        <Text style={styles.hotelFieldValText}>{reservationNights}</Text>
                        <View style={styles.hotelStepperCol}>
                          <TouchableOpacity
                            style={styles.hotelStepperBtn}
                            activeOpacity={0.5}
                            onPress={() => {
                              const current = parseInt(reservationNights, 10) || 1;
                              setReservationNights(String(Math.min(30, current + 1)));
                            }}
                          >
                            <ChevronUp size={11} color="#64748B" strokeWidth={3} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.hotelStepperBtn}
                            activeOpacity={0.5}
                            onPress={() => {
                              const current = parseInt(reservationNights, 10) || 1;
                              setReservationNights(String(Math.max(1, current - 1)));
                            }}
                          >
                            <ChevronDown size={11} color="#64748B" strokeWidth={3} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.hotelSearchStaysBtn}
                    onPress={() => {
                      setActiveDropdown(null);
                      setHotelStep('RESULTS');
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.hotelSearchStaysBtnText}>SEARCH STAYS ➔</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: AVAILABLE HOTELS LIST (Matching Image 1) */}
              {hotelStep === 'RESULTS' && (
                <View style={styles.flightResultsWrapper}>
                  <View style={styles.flightResultsTopBar}>
                    <Text style={styles.flightResultsCountText}>
                      3 HOTELS FOUND ({hotelLocation.toUpperCase()})
                    </Text>
                    <TouchableOpacity
                      onPress={() => setHotelStep('SEARCH')}
                      activeOpacity={0.7}
                      style={styles.editSearchTouchable}
                    >
                      <Text style={[styles.editSearchBtnText, { color: '#E11D48' }]}>EDIT SEARCH</Text>
                    </TouchableOpacity>
                  </View>

                  {AVAILABLE_HOTELS.map((hotel) => (
                    <View key={hotel.id} style={styles.hotelCard}>
                      <View style={styles.trainCardTopRow}>
                        <View style={styles.hotelLocationBadge}>
                          <Text style={styles.hotelLocationBadgeText}>{hotel.locationTag}</Text>
                        </View>
                        <Text style={styles.trainPriceText}>{hotel.price}</Text>
                      </View>

                      <Text style={styles.trainNameHeading}>{hotel.hotelName}</Text>

                      <View style={styles.hotelAmenitiesRow}>
                        {hotel.amenities.map((item, idx) => (
                          <View key={idx} style={styles.hotelAmenityPill}>
                            <Text style={styles.hotelAmenityText}>{item}</Text>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={styles.hotelViewRoomBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedHotel(hotel);
                          setHotelStep('RESERVATION');
                        }}
                      >
                        <Text style={styles.hotelViewRoomBtnText}>VIEW HOTEL ROOM</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* STEP 3: CONFIRM ROOM RESERVATION (Matching Image 2) */}
              {hotelStep === 'RESERVATION' && (
                <View style={styles.trainCheckoutCard}>
                  <Text style={styles.trainCheckoutTitle}>CONFIRM ROOM RESERVATION</Text>

                  <View style={styles.trainCheckoutSummaryBox}>
                    <Text style={styles.trainCheckoutTrainName}>
                      {selectedHotel?.hotelName || 'THE MAURYA LUXURY HOTEL'}
                    </Text>
                    <Text style={styles.trainCheckoutSubLine}>
                      Location: {selectedHotel?.locationDesc || 'Patna Center'}
                    </Text>

                    <View style={styles.trainTimingsDottedDivider} />

                    <View style={[styles.rowFields, { marginTop: 4, zIndex: activeDropdown === 'hotel_room_type' ? 100 : 1 }]}>
                      {/* Room Type Selector */}
                      <View style={[styles.formGroup, { flex: 1.3, position: 'relative' }]}>
                        <Text style={styles.fieldLabel}>SELECT ROOM TYPE</Text>
                        <TouchableOpacity
                          style={styles.hotelInputContainer}
                          activeOpacity={0.8}
                          onPress={() =>
                            setActiveDropdown(activeDropdown === 'hotel_room_type' ? null : 'hotel_room_type')
                          }
                        >
                          <Text style={styles.fieldSmallText} numberOfLines={1}>
                            {selectedRoomType}
                          </Text>
                          <ChevronDown size={14} color="#0F172A" />
                        </TouchableOpacity>

                        {activeDropdown === 'hotel_room_type' && (
                          <View style={styles.inlineDropdownMenu}>
                            {['Premium Deluxe', 'Executive Suite', 'Presidential Suite', 'Standard King'].map((room) => (
                              <TouchableOpacity
                                key={room}
                                style={[
                                  styles.inlineDropdownItem,
                                  selectedRoomType === room && styles.inlineDropdownItemSelected,
                                ]}
                                onPress={() => {
                                  setSelectedRoomType(room);
                                  setActiveDropdown(null);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.inlineDropdownItemText,
                                    selectedRoomType === room && styles.inlineDropdownItemTextSelected,
                                  ]}
                                >
                                  {room}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* Nights Input */}
                      <View style={[styles.formGroup, { flex: 0.7 }]}>
                        <Text style={styles.fieldLabel}>RESERVATION NIGHTS</Text>
                        <View style={styles.hotelInputContainer}>
                          <TextInput
                            style={[styles.cleanTextInput, { textAlign: 'center', fontWeight: '800' }]}
                            value={reservationNights}
                            onChangeText={setReservationNights}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.trainTimingsDottedDivider} />

                  <View style={styles.trainCheckoutPriceRow}>
                    <Text style={styles.trainCheckoutPriceLabel}>Base Stay Tariff (1 Night)</Text>
                    <Text style={styles.trainCheckoutPriceVal}>{selectedHotel?.numericPrice || '₹5,500'}</Text>
                  </View>

                  <View style={styles.trainCheckoutPriceRow}>
                    <Text style={styles.trainCheckoutTotalLabel}>Total Amount</Text>
                    <Text style={styles.trainCheckoutTotalVal}>{selectedHotel?.numericPrice || '₹5,500'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.hotelReservationBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setHotelStep('CONFIRMED');
                    }}
                  >
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    <Text style={styles.hotelReservationBtnText}>COMPLETE RESERVATION CHECK</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 4: HOTEL STAY CONFIRMED (Matching Image 3) */}
              {hotelStep === 'CONFIRMED' && (
                <View style={styles.confirmedTicketCard}>
                  <View style={styles.confirmedCheckBadge}>
                    <Check size={28} color="#059669" strokeWidth={3} />
                  </View>

                  <Text style={styles.confirmedTitle}>STAY CONFIRMED</Text>
                  <Text style={styles.confirmedSubtitle}>
                    Digital room key generated and synced with smart locks.
                  </Text>

                  <View style={styles.confirmedDetailsBox}>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Hotel:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedHotel?.hotelName || 'The Maurya Luxury Hotel'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Room:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedRoomType || 'Premium Deluxe'} - Rm 304
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Nights:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {reservationNights || '1'} Night(s)
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.finishReturnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setHotelStep('SEARCH');
                      setActivePortal('DASHBOARD');
                    }}
                  >
                    <Text style={styles.finishReturnBtnText}>FINISH AND RETURN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ===================== VIEW 6: HOLIDAYS PORTAL ===================== */}
          {activePortal === 'HOLIDAYS' && (
            <>
              {/* STEP 1: PACKAGES LIST (Matching Images 1 & 2) */}
              {holidayStep === 'PACKAGES' && (
                <View style={styles.flightResultsWrapper}>
                  <View style={{ marginBottom: 14 }}>
                    <Text style={styles.tourMainHeading}>CURATED GUIDE TOUR PACKAGES</Text>
                    <Text style={styles.tourSubHeading}>
                      All-inclusive VIP holidays with certified local guide transits.
                    </Text>
                  </View>

                  {AVAILABLE_HOLIDAYS.map((holiday) => (
                    <View key={holiday.id} style={styles.tourPackageCard}>
                      <View style={styles.trainCardTopRow}>
                        <View style={styles.tourCategoryBadge}>
                          <Text style={styles.tourCategoryBadgeText}>{holiday.categoryTag}</Text>
                        </View>
                        <Text style={styles.trainPriceText}>{holiday.price}</Text>
                      </View>

                      <Text style={styles.trainNameHeading}>{holiday.packageName}</Text>
                      <Text style={styles.tourDurationText}>{holiday.durationText}</Text>

                      <View style={styles.tourHighlightsBox}>
                        <Text style={styles.tourHighlightsLabel}>PACKAGE HIGHLIGHTS</Text>
                        <View style={styles.tourHighlightsGrid}>
                          {holiday.highlights.map((item, idx) => (
                            <View key={idx} style={styles.tourHighlightTag}>
                              <Text style={styles.tourHighlightTagText}>✓  {item}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.tourViewItineraryBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedHoliday(holiday);
                          setHolidayStep('ITINERARY');
                        }}
                      >
                        <Text style={styles.tourViewItineraryBtnText}>VIEW FULL ITINERARY ➔</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* STEP 2: FULL ITINERARY DETAILS (Matching Image 3) */}
              {holidayStep === 'ITINERARY' && (
                <View style={styles.trainCheckoutCard}>
                  <View style={styles.trainCardTopRow}>
                    <View style={styles.tourCategoryBadge}>
                      <Text style={styles.tourCategoryBadgeText}>
                        {selectedHoliday?.categoryTag || 'SPIRITUAL'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setHolidayStep('PACKAGES')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.tourCloseText}>CLOSE</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.trainNameHeading, { marginTop: 6, marginBottom: 2 }]}>
                    {selectedHoliday?.packageName || 'SACRED BIHAR CIRCUIT TOUR'}
                  </Text>
                  <Text style={styles.tourDurationText}>
                    {selectedHoliday?.durationText || '4 Days / 3 Nights'}
                  </Text>

                  <View style={styles.trainTimingsDottedDivider} />

                  <View style={styles.tourTimelineBox}>
                    <Text style={styles.tourTimelineLabel}>DAY-BY-DAY TIMELINE</Text>

                    {(selectedHoliday?.timeline || []).map((step, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === (selectedHoliday?.timeline.length || 1) - 1;

                      return (
                        <View key={idx} style={styles.tourTimelineItem}>
                          <View style={styles.tourTimelineLeftCol}>
                            <View
                              style={
                                isFirst
                                  ? styles.tourTimelineDotActive
                                  : styles.tourTimelineDotInactive
                              }
                            />
                            {!isLast && <View style={styles.tourTimelineLine} />}
                          </View>

                          <View style={{ flex: 1, paddingBottom: isLast ? 0 : 14 }}>
                            <Text
                              style={[
                                styles.tourTimelineDayTitle,
                                isFirst && { color: '#9333EA' },
                              ]}
                            >
                              {step.dayTitle}
                            </Text>
                            {step.description && (
                              <Text style={styles.tourTimelineDayDesc}>
                                {step.description}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.trainTimingsDottedDivider} />

                  <View style={styles.trainCheckoutPriceRow}>
                    <Text style={styles.trainCheckoutPriceLabel}>All-Inclusive Price</Text>
                    <Text style={styles.trainCheckoutTotalVal}>{selectedHoliday?.price || '₹12,499'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.tourActionPurpleBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setHolidayStep('CONFIRMED');
                    }}
                  >
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    <Text style={styles.tourActionPurpleBtnText}>CONFIRM ALL-INCLUSIVE PACKAGE</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 3: VIP TOUR BOOKED CONFIRMATION (Matching Image 4) */}
              {holidayStep === 'CONFIRMED' && (
                <View style={styles.confirmedTicketCard}>
                  <View style={styles.confirmedCheckBadge}>
                    <Check size={28} color="#059669" strokeWidth={3} />
                  </View>

                  <Text style={styles.confirmedTitle}>VIP TOUR BOOKED!</Text>
                  <Text style={styles.confirmedSubtitle}>
                    A certified AOLO Holiday manager has been assigned to coordinate your itinerary.
                  </Text>

                  <View style={styles.confirmedDetailsBox}>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Assigned Guide:</Text>
                      <Text style={styles.confirmedDetailValBold}>
                        {selectedHoliday?.assignedGuide || 'Rajesh Kumar'}
                      </Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Contact Phone:</Text>
                      <Text style={styles.confirmedDetailValMono}>
                        {selectedHoliday?.contactPhone || '+91 94712 04825'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.finishReturnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setHolidayStep('PACKAGES');
                      setActivePortal('DASHBOARD');
                    }}
                  >
                    <Text style={styles.finishReturnBtnText}>RETURN TO TRAVEL DASHBOARD</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ===================== VIEW 7: VISA PORTAL ===================== */}
          {activePortal === 'VISA' && (
            <>
              {/* STEP 1: VISA SERVICES LIST */}
              {visaStep === 'SERVICES' && (
                <View style={styles.flightResultsWrapper}>
                  <View style={styles.flightResultsTopBar}>
                    <Text style={styles.flightResultsCountText}>3 EXPRESS E-VISA DESTINATIONS</Text>
                  </View>

                  {AVAILABLE_VISAS.map((visa) => (
                    <View key={visa.id} style={styles.flightCard}>
                      <View style={styles.flightCardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.flightCodeText}>{visa.validity}</Text>
                          <Text style={styles.flightAirlineText}>{visa.countryName}</Text>
                        </View>
                        <View style={[styles.flightPriceBadge, { backgroundColor: '#E0E7FF', borderColor: '#C7D2FE' }]}>
                          <Text style={[styles.flightPriceText, { color: '#4F46E5' }]}>{visa.price}</Text>
                        </View>
                      </View>

                      <View style={styles.flightDottedDivider} />

                      <Text style={[styles.flightTimeSub, { color: '#64748B', marginBottom: 14 }]}>
                        {visa.features} • {visa.processingTime}
                      </Text>

                      <TouchableOpacity
                        style={styles.selectSeatBtn}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedVisa(visa);
                          setVisaStep('CONFIRMED');
                        }}
                      >
                        <Text style={styles.selectSeatBtnText}>APPLY FOR E-VISA</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* STEP 2: VISA CONFIRMED SCREEN */}
              {visaStep === 'CONFIRMED' && (
                <View style={styles.confirmedTicketCard}>
                  <View style={styles.confirmedCheckBadge}>
                    <Check size={28} color="#059669" strokeWidth={3} />
                  </View>

                  <Text style={styles.confirmedTitle}>E-VISA APPLICATION SUBMITTED!</Text>
                  <Text style={styles.confirmedSubtitle}>
                    {selectedVisa?.countryName || 'Dubai (UAE) Tourist Visa'} application submitted for express clearance.
                  </Text>

                  <View style={styles.confirmedDetailsBox}>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Application ID:</Text>
                      <Text style={styles.confirmedDetailValMono}>{selectedVisa?.applicationId || 'VISA-UAE-66109'}</Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Visa Category:</Text>
                      <Text style={styles.confirmedDetailValBold}>{selectedVisa?.category || '30-Day Express Tourist Visa'}</Text>
                    </View>
                    <View style={styles.confirmedDetailRow}>
                      <Text style={styles.confirmedDetailLabel}>Est. Approval:</Text>
                      <Text style={styles.confirmedDetailValBold}>{selectedVisa?.approvalWindow || 'Within 24-48 Hours'}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.finishReturnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setVisaStep('SERVICES');
                      setActivePortal('DASHBOARD');
                    }}
                  >
                    <Text style={styles.finishReturnBtnText}>FINISH AND RETURN</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

        </ScrollView>

        {/* Backdrop for closing inline dropdowns when tapping outside */}
        {activeDropdown && (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 30 }]}
            activeOpacity={1}
            onPress={() => setActiveDropdown(null)}
          />
        )}

        {/* ===================== IN-FRAME MODAL 3: BOOKING CONFIRMATION ===================== */}
        <InFrameModal visible={Boolean(successData)}>
          <View style={styles.pickerBackdrop}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setSuccessData(null)}
            />
            {successData && (
              <View style={styles.successModalCard}>
                <View style={styles.successIconBadge}>
                  <Check size={28} color="#0F172A" />
                </View>

                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successSubtitle}>
                  Your {successData.category} booking has been confirmed successfully.
                </Text>

                <View style={styles.pnrContainer}>
                  <Text style={styles.pnrLabel}>BOOKING REFERENCE / PNR</Text>
                  <Text style={styles.pnrCode}>{successData.pnr}</Text>
                </View>

                <View style={styles.receiptBox}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptItemLabel}>Service</Text>
                    <Text style={styles.receiptItemVal}>{successData.title}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptItemLabel}>Route</Text>
                    <Text style={styles.receiptItemVal}>{successData.route}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptItemLabel}>Total Fare</Text>
                    <Text style={[styles.receiptItemVal, { color: '#0066FF', fontWeight: '800' }]}>
                      {successData.price}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setSuccessData(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.doneBtnText}>DONE</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </InFrameModal>

        {/* Weather Modal in Travel Mode */}
        <InFrameModal visible={showWeatherModal}>
          <WeatherModal onClose={() => setShowWeatherModal(false)} />
        </InFrameModal>
      </View>

      <BottomNavBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center', // Centers phone frame on web/tablet!
  },
  mobileViewport: {
    width: '100%',
    maxWidth: 480, // STRICTLY MOBILE-FIRST (stops wide tablet stretch)
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
    overflow: 'hidden',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 10,
  },
  menuSquareBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  weatherPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  backPillText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  portalBadge: {
    backgroundColor: '#EBF4FC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0E4F7',
  },
  portalBadgeBlue: {
    backgroundColor: '#EBF4FC',
    borderColor: '#BAE6FD',
  },
  portalBadgeText: {
    color: '#0066CC',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  portalBadgeTextBlue: {
    color: '#0066CC',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },

  /* Dashboard Styles */
  welcomeBox: {
    marginVertical: 12,
  },
  welcomeSubtitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 1,
    marginBottom: 2,
  },
  welcomeTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Roboto',
    lineHeight: 28,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 6,
    flexDirection: 'column',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  gridCardSub: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  sectionHeaderTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
    marginVertical: 10,
  },
  serviceRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 12,
  },
  serviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  serviceSub: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  addServiceBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addedServiceBtn: {
    backgroundColor: '#A8E63C',
    borderColor: '#84CC16',
  },
  addServiceText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  addedServiceText: {
    color: '#0F172A',
    fontWeight: '900',
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 12,
  },
  promoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  promoCodeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promoDiscount: {
    color: '#84CC16',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  promoDesc: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8E63C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },

  /* Specific Portal Form (Client Image 2 exact match) */
  portalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 6,
  },
  portalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  portalTitleText: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  /* Clean Input Container without inner black border */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  inputContainerFocused: {
    borderColor: '#0066FF',
    backgroundColor: '#FFFFFF',
  },
  cleanTextInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 4,
    // Eliminates default browser black outline on web/Chrome
    ...(Platform.OS === 'web'
      ? ({
        outlineStyle: 'none',
        outlineWidth: 0,
      } as any)
      : {}),
  },

  swapRoundBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'center',
    marginVertical: -8,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  inputContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerSmallActive: {
    borderColor: '#0066FF',
    backgroundColor: '#FFFFFF',
  },
  inlineDropdownMenu: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 9999,
    overflow: 'hidden',
  },
  inlineDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  inlineDropdownItemSelected: {
    backgroundColor: '#52525B',
  },
  inlineDropdownItemText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  inlineDropdownItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fieldSmallText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  primaryBlueBtn: {
    backgroundColor: '#0066FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  /* Results Section */
  resultsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 16,
  },
  resultsHeader: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  resultItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  resultItemName: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  resultItemTime: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  resultItemMeta: {
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#94A3B8',
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#94A3B8',
    marginTop: 2,
  },
  resultItemPrice: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  resultBookBtn: {
    backgroundColor: '#0066FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  resultBookBtnText: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },

  /* Success Confirmation Sheet */
  successSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  successIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#A8E63C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  successSubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  pnrContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  pnrLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  pnrCode: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginTop: 2,
    letterSpacing: 1.5,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptItemLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  receiptItemVal: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },

  /* Interactive Pickers Modal Sheet */
  pickerBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 9999,
  },
  pickerSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 10000,
  },
  sheetDragHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successModalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 10000,
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  pickerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  dateChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dateChip: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dateChipSelected: {
    backgroundColor: '#EBF4FC',
    borderColor: '#0066FF',
  },
  dateChipLabel: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  dateChipLabelSelected: {
    color: '#0066FF',
  },
  dateChipDate: {
    fontSize: 11,
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 4,
  },
  dateChipDateSelected: {
    color: '#0066FF',
    fontWeight: '700',
  },
  classOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 10,
  },
  classOptionCardSelected: {
    backgroundColor: '#EBF4FC',
    borderColor: '#0066FF',
  },
  classOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  classOptionTitleSelected: {
    color: '#0066FF',
  },
  classOptionDesc: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  classCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Trains Portal Switcher & Live PNR Styles */
  trainTabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  trainTabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  trainTabPillActive: {
    backgroundColor: '#0F172A',
  },
  trainTabPillText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  trainTabPillTextActive: {
    color: '#FFFFFF',
  },
  pnrStatusResultCard: {
    marginTop: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pnrStatusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  pnrNumberText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#D97706',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  pnrTrainName: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  pnrRouteText: {
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: 2,
  },
  pnrConfirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8E63C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  pnrConfirmedText: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  pnrDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  pnrDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pnrDetailCol: {
    alignItems: 'center',
  },
  pnrDetailLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  pnrDetailValue: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },

  /* Flight Results Screen Styles (Image 2) */
  flightResultsWrapper: {
    marginTop: 4,
  },
  flightResultsTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  flightResultsCountText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  editSearchTouchable: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  editSearchBtnText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0066FF',
    letterSpacing: 0.5,
  },
  flightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  flightCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flightCodeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    letterSpacing: 0.5,
  },
  flightAirlineText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  flightPriceBadge: {
    backgroundColor: '#EBF4FC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E4F7',
  },
  flightPriceText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0066FF',
  },
  flightDottedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  flightTimingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flightTimeColLeft: {
    alignItems: 'flex-start',
  },
  flightTimeColRight: {
    alignItems: 'flex-end',
  },
  flightTimeText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  flightTimeSub: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    marginTop: 2,
  },
  flightPathMiddle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  flightDurationText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  flightLineTrack: {
    width: '100%',
    height: 2,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    justifyContent: 'center',
  },
  flightLineDot: {
    position: 'absolute',
    right: 8,
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0066FF',
  },
  flightTypeText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  selectSeatBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectSeatBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  /* E-Ticket Confirmation Styles (Image 3) */
  confirmedTicketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 22,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  confirmedCheckBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmedTitle: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  confirmedSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  confirmedDetailsBox: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
    marginTop: 18,
    marginBottom: 20,
    gap: 12,
  },
  confirmedDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmedDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  confirmedDetailValMono: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  confirmedDetailValBold: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  finishReturnBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  finishReturnBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  /* Train Specific Cards (Matching Screenshot 1) */
  trainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  trainCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trainNumberBadge: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FEF08A',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trainNumberBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#CA8A04',
  },
  trainPriceText: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  trainNameHeading: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 10,
  },
  trainTimingsDottedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  trainTimingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainTimeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  trainDurationGray: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#94A3B8',
  },
  trainClassesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  trainClassBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainClassCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  trainClassStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'Roboto',
  },

  /* Train Checkout Card (Matching Screenshot 2) */
  trainCheckoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  trainCheckoutTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  trainCheckoutSummaryBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  trainCheckoutTrainName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  trainCheckoutSubLine: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  trainCheckoutRoute: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  trainCheckoutPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  trainCheckoutPriceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  trainCheckoutPriceVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  trainCheckoutTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  trainCheckoutTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  trainCheckoutBtn: {
    backgroundColor: '#EA580C',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  trainCheckoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  /* Bus Sleeper Berth Card (Matching Image 2) */
  busBerthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  busBerthHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  busOperatorInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  busOperatorNameText: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 2,
  },
  busOperatorSubText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  busLayoutBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  busCabinLabel: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  busSeatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    marginBottom: 12,
    width: '100%',
  },
  busSeatItem: {
    width: 76,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  busSeatItemSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  busSeatCodeText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  busSeatCodeTextSelected: {
    color: '#FFFFFF',
  },
  busSeatTypeText: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  busSeatTypeTextSelected: {
    color: '#D1FAE5',
  },
  busLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  busLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  busLegendDotAvailable: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#94A3B8',
  },
  busLegendDotSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#059669',
  },
  busLegendText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  busFareSection: {
    width: '100%',
  },
  busFareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  busFareLabel: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  busFareVal: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  busSeatSubLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 6,
  },
  busActionGreenBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  busActionGreenBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  /* Hotel Specific Styles (Matching Images 1, 2, 3) */
  hotelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  hotelLocationBadge: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hotelLocationBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  hotelAmenitiesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  hotelAmenityPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hotelAmenityText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  hotelViewRoomBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelViewRoomBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  hotelReservationBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelReservationBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  hotelInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },

  /* Tour Package Specific Styles (Matching Images 1, 2, 3, 4) */
  tourMainHeading: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  tourSubHeading: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    lineHeight: 18,
  },
  tourPackageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tourCategoryBadge: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tourCategoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#9333EA',
    letterSpacing: 0.5,
  },
  tourDurationText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#64748B',
    marginTop: -6,
    marginBottom: 10,
  },
  tourHighlightsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  tourHighlightsLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tourHighlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tourHighlightTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tourHighlightTagText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  tourViewItineraryBtn: {
    backgroundColor: '#9333EA',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourViewItineraryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  tourCloseText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tourTimelineBox: {
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  tourTimelineLabel: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 14,
  },
  tourTimelineItem: {
    flexDirection: 'row',
  },
  tourTimelineLeftCol: {
    alignItems: 'center',
    width: 20,
    marginRight: 10,
  },
  tourTimelineDotActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9333EA',
    borderWidth: 3,
    borderColor: '#E9D5FF',
  },
  tourTimelineDotInactive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  tourTimelineLine: {
    width: 1,
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  tourTimelineDayTitle: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 2,
  },
  tourTimelineDayDesc: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  tourActionPurpleBtn: {
    backgroundColor: '#9333EA',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  tourActionPurpleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  hotelSearchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 8,
  },
  hotelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  hotelTitleText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  hotelFormGroup: {
    marginBottom: 0,
  },
  hotelFormLabel: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#8EA2B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  hotelSearchInputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  hotelSearchInputBoxFocused: {
    borderColor: '#E11D48',
  },
  hotelCleanTextInput: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
    padding: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as any) : {}),
  },
  hotelInputContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
    paddingHorizontal: 14,
  },
  hotelInputContainerSmallActive: {
    borderColor: '#E11D48',
  },
  hotelFieldValText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  hotelStepperCol: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingLeft: 4,
  },
  hotelStepperBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelSearchStaysBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelSearchStaysBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
});
