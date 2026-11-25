# Technical Architecture & System Design Document: AOLO Cabs Mobile Application

**Document Version:** 1.0.0  
**Target Platform:** React Native (iOS & Android)  
**Status:** Approved Technical Architecture  
**Reference Codebase:** `aolo-passenger.apk/react-native-app` & `AOLOCabs New UI - Fixed.pdf`  

---

## 1. High-Level System Architecture

The AOLO Cabs platform utilizes a event-driven cloud architecture. The React Native passenger mobile app communicates with Firebase core services for real-time state synchronization and authentication, alongside a dedicated Node.js microservice backend for computationally intensive driver dispatch, fare calculation, and payment webhook reconciliation.

```
+-----------------------------------------------------------------------------------+
|                            REACT NATIVE MOBILE APP                                |
|                        (iOS / Android Native Client)                              |
|  +-------------------+  +------------------+  +--------------------------------+  |
|  | React Navigation  |  | Zustand Store    |  | react-native-maps              |  |
|  | (Stack & Tabs)    |  | (Client State)   |  | (Google Maps SDK for iOS/Android) |
|  +-------------------+  +------------------+  +--------------------------------+  |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    | HTTPS / WSS       | Firestore SDK     | FCM Push
                    v                   v                   v
+-------------------+-------------------+-------------------+-----------------------+
|                             FIREBASE INFRASTRUCTURE                               |
|                                                                                   |
|  +-------------------+  +-------------------+  +-------------------------------+  |
|  | Firebase Auth     |  | Cloud Firestore   |  | Cloud Messaging (FCM)         |  |
|  | (SMS, SSO, Email) |  | (Realtime DB)     |  | (Push Notifications)          |  |
|  +-------------------+  +-------------------+  +-------------------------------+  |
|                                       ^                                           |
|                                       | Admin SDK                                 |
+---------------------------------------+-------------------------------------------+
                                        |
                                        v
+---------------------------------------+-------------------------------------------+
|                          NODE.JS / EXPRESS BACKEND SERVICE                        |
|                        (Google Cloud Run / AWS ECS Cluster)                       |
|                                                                                   |
|  +-------------------+  +-------------------+  +-------------------------------+  |
|  | Dispatch Engine   |  | Fare Computation  |  | Split Payment Webhooks        |  |
|  | (H3 / S2 Index)   |  | (Matrix API)      |  | (Razorpay / Cashfree)         |  |
|  +-------------------+  +-------------------+  +-------------------------------+  |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+-------------------+-------------------+-----------------------+
|                               THIRD-PARTY SERVICES                                |
|                                                                                   |
|  +-------------------+  +-------------------+  +-------------------------------+  |
|  | Payment Gateway   |  | Google Maps APIs  |  | Twilio / SMS Gateways         |  |
|  | (Razorpay/Cashfree|  | (Places/Directions|  | (OTP Delivery)                |  |
|  +-------------------+  +-------------------+  +-------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Server Architecture Decision: Firebase Cloud Functions vs. Standalone Node.js/Express

### 2.1 Technical Evaluation & Comparison

| Architectural Dimension | Firebase Cloud Functions (Serverless FaaS) | Standalone Node.js/Express (Cloud Run / Container) |
| :--- | :--- | :--- |
| **Cold Start Latency** | High risk ($1.5\text{s} - 4.0\text{s}$ cold starts during sporadic dispatch calls). | Zero cold starts with min-instances set to 1 ($< 50\text{ms}$ response time). |
| **Statefulness & In-Memory Indexing** | Strictly stateless. Cannot maintain spatial indexing (e.g., H3 / S2 geospatial memory index for nearby drivers). | Stateful / Persistent memory support; handles active driver spatial indexes and WebSockets. |
| **Real-time Dispatch Loops** | Impractical for continuous 5-second polling loops or active driver proximity updates. | Ideal for persistent event-driven dispatch queues and WebSocket connections. |
| **Payment Webhook Processing** | Excellent for asynchronous event handling (e.g., handling Razorpay payment success webhooks). | Excellent, but requires manual SSL certificate & API route scaling config. |
| **Cost Profile** | Pay-per-invocation (cost-effective at low volume, expensive at high execution frequency). | Predictable vCPU/RAM billing; cost-efficient for continuous traffic. |

### 2.2 Architectural Decision: Hybrid Architecture (Recommended)

**Decision:** We adopt a **Hybrid Backend Model**:
1. **Primary Node.js/Express Service (Deployed on Google Cloud Run):** Handles real-time driver dispatch matching, geospatial H3 spatial queries, complex fare calculations factoring highway pitstops, and split payout webhooks. Cloud Run provides containerized autoscaling with zero cold-start overhead using 1 minimum warm instance.
2. **Firebase Cloud Functions (Secondary Asynchronous Triggers):** Handles background event triggers, such as broadcasting FCM push notifications upon ride acceptance, automated PDF invoice generation, and scheduled database cleanup.

---

## 3. Comprehensive Data Model (Cloud Firestore Schema)

Expanding on the web prototype's `src/types.ts` and blueprint schemas, the production Firestore schema is structured as follows:

```
cloud-firestore/
├── users/ (Collection)
│   └── {userId}/ (Document)
│       ├── uid: string
│       ├── name: string
│       ├── email: string
│       ├── phone: string
│       ├── role: 'PASSENGER' | 'CORPORATE_EMPLOYEE' | 'CORPORATE_ADMIN'
│       ├── walletBalance: number
│       ├── fcmToken: string
│       ├── homeLocation: Map { name, address, lat, lng }
│       ├── workLocation: Map { name, address, lat, lng }
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── drivers/ (Collection)
│   └── {driverId}/ (Document)
│       ├── uid: string
│       ├── name: string
│       ├── phone: string
│       ├── avatar: string
│       ├── rating: number
│       ├── totalTrips: number
│       ├── vehicleDetails: Map { classId, model, color, plateNumber }
│       ├── isOnline: boolean
│       ├── isBusy: boolean
│       ├── currentGeoHash: string
│       ├── currentLocation: GeoPoint (lat, lng)
│       ├── bearing: number (heading angle 0-360)
│       └── lastLocationUpdate: timestamp
│
├── vehicleClasses/ (Collection)
│   └── {classId}/ (Document)
│       ├── name: string ('AOLO Compact' | 'AOLO Comfort' | 'AOLO Sedan' | 'AOLO SUV')
│       ├── baseFare: number
│       ├── perKmRate: number
│       ├── perMinuteRate: number
│       ├── capacity: number
│       ├── luggageCapacity: number
│       └── iconUrl: string
│
├── rides/ (Collection)
│   └── {rideId}/ (Document)
│       ├── rideId: string
│       ├── userId: string
│       ├── driverId: string | null
│       ├── rideType: 'ONEWAY' | 'ROUNDTRIP' | 'RENTAL' | 'AIRPORT'
│       ├── status: 'SEARCHING' | 'ACCEPTED' | 'ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
│       ├── pickup: Map { name, address, lat, lng }
│       ├── dropoff: Map { name, address, lat, lng }
│       ├── pitstops: Array<Map { name, address, lat, lng, stopDurationMin }>
│       ├── vehicleClassId: string
│       ├── passengerDetails: Map { adults: number, children: number, bigBags: number, smallBags: number }
│       ├── fareBreakup: Map { baseFare, taxes, driverAllowance, totalFare, advanceTokenPaid, finalDriverPayout }
│       ├── paymentStatus: 'PENDING' | 'TOKEN_PAID' | 'FULLY_PAID'
│       ├── paymentMethod: 'AOLO_WALLET' | 'UPI' | 'CASH'
│       ├── otp: string (4-digit verification PIN)
│       ├── scheduledTime: timestamp | null
│       ├── flightDetails: Map { flightNumber, terminal } | null
│       ├── rentalPackage: Map { packageId, hours, km } | null
│       ├── createdAt: timestamp
│       └── completedAt: timestamp | null
│
├── chatMessages/ (Collection)
│   └── {messageId}/ (Document)
│       ├── messageId: string
│       ├── rideId: string
│       ├── senderId: string
│       ├── senderRole: 'passenger' | 'driver'
│       ├── text: string
│       └── timestamp: timestamp
│
├── walletTransactions/ (Collection)
│   └── {transactionId}/ (Document)
│       ├── transactionId: string
│       ├── userId: string
│       ├── amount: number
│       ├── type: 'CREDIT' | 'DEBIT'
│       ├── category: 'TOPUP' | 'RIDE_ADVANCE' | 'REFUND' | 'REFERRAL_BONUS'
│       ├── gatewayPaymentId: string
│       ├── status: 'SUCCESS' | 'FAILED' | 'PENDING'
│       └── timestamp: timestamp
│
├── corporateAccounts/ (Collection)
│   └── {companyId}/ (Document)
│       ├── companyId: string
│       ├── companyName: string
│       ├── gstNumber: string
│       ├── corporateWalletBalance: number
│       ├── monthlyBudgetLimit: number
│       ├── adminUserIds: Array<string>
│       └── createdAt: timestamp
│
└── referrals/ (Collection)
    └── {referralId}/ (Document)
        ├── referrerUserId: string
        ├── refereeUserId: string
        ├── referralCode: string
        ├── rewardAmount: number (100)
        ├── isRewarded: boolean
        └── timestamp: timestamp
```

---

## 4. Real-Time Ride Tracking Architecture

### 4.1 Migration from Canvas MapSimulator to Native Google Maps
The prototype's `MapSimulator.tsx` uses HTML5 Canvas with hardcoded 0-100 coordinate scaling. The production app replaces this with `react-native-maps` backed by Google Maps SDK for iOS and Android.

```
+-------------------------------------------------------------------------------+
|                       REAL-TIME TRACKING PIPELINE                             |
|                                                                               |
| [Driver Mobile App] ---> Updates GeoPoint & Bearing in Firestore (/drivers)  |
|                                      |                                        |
|                                      v                                        |
|                     Firestore onSnapshot Realtime Stream                      |
|                                      |                                        |
|                                      v                                        |
| [Passenger App: MapScreen]                                                    |
|   ├── 1. Decode Google Directions API Polyline (@mapbox/polyline)             |
|   ├── 2. Render <Polyline strokeColor="#3B82F6" strokeWidth={4} />            |
|   ├── 3. Render <Marker.Animated /> with interpolated lat/lng smoothing       |
|   └── 4. Rotate Marker icon using Animated bearing value (0-360 deg)          |
+-------------------------------------------------------------------------------+
```

### 4.2 Smooth Marker Movement & Polyline Decoding
- **Polyline Decoding:** The pickup-to-drop route polyline is fetched via Google Directions API, decoded using `@mapbox/polyline`, and rendered on `<MapView>`.
- **Marker Animation:** Driver coordinate updates from Firestore are passed to `Marker.Animated` with a 1-second `Timing` interpolation to ensure fluid car movement across road segments.

---

## 5. Authentication Architecture & Production Safeguards

### 5.1 Auth Provider Integration
1. **Phone Number SMS OTP:** Primary auth method via `firebase.auth().signInWithPhoneNumber(phoneNumber)`.
2. **Google Single Sign-On (SSO):** Implemented via `@react-native-google-signin/google-signin` producing OAuth credentials passed to `firebase.auth.GoogleAuthProvider.credential()`.
3. **Email / Password:** Fallback registration option via `firebase.auth().createUserWithEmailAndPassword()`.

### 5.2 Stripping "Demo Access" in Production
In `AuthScreen.tsx`, the prototype contains a 1-tap "Instant Demo Access" button bypassing authentication.

**Production Removal Strategy:**
- Wrap Demo Login handlers in conditional `__DEV__` checks or environment feature flags (`process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN === 'true'`).
- Ensure demo authentication endpoints are completely stripped out of production release builds using standard Metro bundler tree-shaking.

```typescript
// Production-safe Auth handler pattern
const handleDemoLogin = () => {
  if (__DEV__ && process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN === 'true') {
    // Perform simulated login in development mode only
    setUserProfile(MOCK_DEMO_USER);
  } else {
    console.warn('Demo access is disabled in production builds.');
  }
};
```

---

## 6. State Management Strategy: Zustand Selection & Justification

### 6.1 Evaluation Framework

| Criteria | Context API | Redux Toolkit (RTK) | Zustand (Chosen Solution) |
| :--- | :--- | :--- | :--- |
| **Bundle Size** | 0 KB (Built-in) | ~12 KB | **< 1.5 KB** |
| **Boilerplate Code** | Low | High (Slices, Reducers, Selectors) | **Minimal (Simple Store hooks)** |
| **Re-render Performance** | Poor (Triggers full tree re-renders without complex memoization) | Excellent (Selector-based) | **Exceptional (Granular atomic selector subscriptions)** |
| **Realtime Map Updates** | Triggers frame drops during rapid driver lat/lng updates | Overkill complexity for rapid state mutations | **Smooth 60 FPS state updates without rendering overhead** |

### 6.2 Zustand Architecture Implementation Plan
State is partitioned into lightweight stores:
- `useAuthStore`: Manages user credentials, profile, and session state.
- `useRideStore`: Manages active ride lifecycle (`IDLE` -> `SEARCHING` -> `ACCEPTED` -> `IN_PROGRESS`), pickup/drop coordinates, and driver telemetry.
- `useWalletStore`: Manages balance state, payment methods, and transactions.
- `useUIStore`: Manages sheet drawer visibilities (`PICKUP`, `BOOKING`, `CHAT`, `SIDEBAR`).

---

## 7. Navigation Structure (React Navigation v6)

```
RootNavigator (Native Stack)
├── AuthStack (Stack Navigator)
│   ├── OnboardingScreen
│   ├── LoginScreen
│   └── OTPScreen
│
└── MainAppStack (Stack Navigator - Protected)
    ├── MainTabNavigator (Bottom Tabs)
    │   ├── HomeTab (MapView + Search Overlay + WeatherWidget)
    │   ├── TravelModeTab (TravelModeView)
    │   └── CorporateTab (CorporateSheet)
    │
    ├── Modals & Full-Screen Sheet Stack
    │   ├── PickupDestinationModal (PickupDestinationFlow)
    │   ├── BookingModal (BookingSheet)
    │   ├── RideProgressModal (RideProgressSheet)
    │   ├── ChatDrawerModal (ChatDrawer)
    │   ├── WalletModal (WalletSheet)
    │   ├── HistoryModal (RideHistory)
    │   ├── ProfileModal (ProfileSheet)
    │   ├── RentalModal (RentalBookingFlow)
    │   ├── AirportModal (AirportBookingFlow)
    │   └── SidebarModal (SidebarDrawer)
```

---

## 8. Directory & Folder Structure

```
react-native-app/
├── assets/                  # App icons, splash images, local fonts, sound files
├── src/
│   ├── api/                 # Axios clients & backend REST services
│   │   ├── dispatchApi.ts
│   │   ├── fareApi.ts
│   │   └── paymentApi.ts
│   │
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Buttons, Cards, Inputs, Modals
│   │   ├── map/             # MapView, DriverMarker, RoutePolyline
│   │   ├── booking/         # VehicleCard, FareBreakup, LuggageStepper
│   │   └── chat/            # ChatBubble, ChatInput
│   │
│   ├── config/              # App config, environment variables, Firebase init
│   │   ├── firebase.ts
│   │   └── constants.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocation.ts
│   │   ├── useDriverTracking.ts
│   │   └── usePayment.ts
│   │
│   ├── navigation/          # React Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   │
│   ├── screens/             # Full screen views
│   │   ├── auth/            # Onboarding, Login, OTP
│   │   ├── main/            # HomeScreen, TravelScreen, CorporateScreen
│   │   └── sheets/          # BookingSheets, WalletSheet, HistorySheet
│   │
│   ├── services/            # Native services & SDK wrappers
│   │   ├── locationService.ts
│   │   ├── notificationService.ts (FCM)
│   │   └── razorpayService.ts
│   │
│   ├── store/               # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useRideStore.ts
│   │   └── useWalletStore.ts
│   │
│   ├── theme/               # Colors, typography, spacing (slate dark system)
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript interfaces & types
│   │   └── index.ts
│   │
│   └── utils/               # Helper functions, formatters, date parsing
│       ├── dateUtils.ts
│       ├── distanceUtils.ts
│       └── formatters.ts
│
├── App.tsx                  # Application entry point
├── app.json                 # Expo / React Native manifest
└── tsconfig.json            # TypeScript configuration
```

---

## 9. Third-Party Integrations Matrix

| Integration | Library / Provider | Purpose |
| :--- | :--- | :--- |
| **Maps & Maps Rendering** | `react-native-maps` | Native Google Maps rendering for iOS and Android. |
| **Geocoding & Places** | `@googlemaps/google-maps-services-js` | Address autocomplete search & reverse geocoding pin resolution. |
| **Routing & Polyline** | Google Directions API + `@mapbox/polyline` | Calculating trip distance/duration and decoding route geometry. |
| **Payment Gateway** | `react-native-razorpay` / Cashfree SDK | Processing UPI deep links, Credit/Debit cards, and Wallet top-ups. |
| **Push Notifications** | `@react-native-firebase/messaging` (FCM) | Real-time push notifications for ride updates, driver arrival, and chat. |
| **Device Geolocation** | `react-native-geolocation-service` | High-accuracy device GPS tracking for pickup positioning. |
| **Secure Credentials** | `react-native-encrypted-storage` | Secure offline token and session persistence. |

---

## 10. Security & Compliance Architecture

1. **Firestore Security Rules:**
   - Enforce document-level ownership validation (passengers can only read/write their own user profile and ride documents).
   - Drivers can only update their specific location record in `/drivers/{driverId}`.
2. **API Key Protection:**
   - Restrict Google Maps API keys by HTTP Referrer / Android Package Name & SHA-1 fingerprint / iOS Bundle ID in Google Cloud Console.
   - Store API keys in `.env` files using `react-native-config` or Expo Secrets; never commit plain API keys to source control.
3. **Data Encryption:**
   - All network transit encrypted via TLS 1.3.
   - Sensitive session tokens stored using iOS Keychain and Android Keystore via Encrypted Storage.

---

## 11. Mocked vs. Real Component Transformation Audit

This table explicitly lists every mocked component in the current React web prototype (`aolo-passenger.apk/react-native-app`) and defines its replacement in the production React Native mobile app:

| Component File in Prototype | Mocked Logic in Prototype | Production React Native Replacement |
| :--- | :--- | :--- |
| `src/components/MapSimulator.tsx` | Canvas 2D grid rendering fake car movement (`SIMULATED_DRIVERS`). | Replace with `react-native-maps` `<MapView>` with native Google Maps tiles, live driver markers, and polyline route decoding. |
| `src/data/mockData.ts` | Hardcoded arrays for `POPULAR_LOCATIONS`, `SIMULATED_DRIVERS`, `VEHICLE_CLASSES`. | Replace with dynamic API calls to Google Places API, Firestore `/drivers` collection, and Firestore `/vehicleClasses` collection. |
| `src/components/AuthScreen.tsx` | Local state toggle and hardcoded "Demo Access" button. | Replace with Firebase Auth (SMS OTP & Google SSO) with environment-gated demo login stripping. |
| `src/components/WalletSheet.tsx` | Local state addition (`walletBalance + amt`). | Replace with Razorpay SDK checkout flow triggering backend webhook verification before updating Firestore wallet document. |
| `src/components/RideProgressSheet.tsx` | Timed `setTimeout` triggers for driver arrival and ride status transitions. | Replace with real-time Firestore `onSnapshot` subscription listening to live ride updates updated by driver app. |
| `src/components/ChatDrawer.tsx` | `SIMULATED_REPLIES.general` randomized string generator. | Replace with real-time Firestore `/chatMessages` subscription allowing two-way messaging between passenger and driver. |
| `src/components/CorporateSheet.tsx` | Hardcoded corporate wallet balances and department cards. | Replace with Corporate Inquiry waitlist sheet in v1; full corporate backend integration deferred to Phase 2. |
| `src/components/TravelModeView.tsx` | Static promo cards for flights, hotels, and train bookings. | Replace with affiliate offer cards linking to external partner webviews or lead capture forms in v1. |
| `src/components/AirportBookingFlow.tsx` | Flight number text input stored in local state. | Store flight number in Firestore ride metadata; live FlightAware delay tracking API deferred to Phase 2. |

---

**[END OF ARCHITECTURE SPECIFICATION - AOLO CABS 2.0]**
