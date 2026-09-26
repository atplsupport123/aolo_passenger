# Project Implementation Checklist: AOLO Cabs React Native

**Document Version:** 1.0.0  
**Target:** React Native Mobile Application (iOS & Android)  
**Reference Architecture:** [`architecture.md`](file:///c:/Users/bk200/Desktop/ola/architecture.md) & [`design.md`](file:///c:/Users/bk200/Desktop/ola/design.md)  

---

## Task Execution Legend
- `[ ]` **Not Started**
- `[IN_PROGRESS]` **In Progress**
- `[DONE]` **Completed & Verified**

---

## Phase 0: Project Setup & Core Infrastructure

- [ ] **Task 0.1: React Native Project Initialization & TypeScript Config**
  - **Status:** Not Started
  - **Prototype Base:** `package.json`, `tsconfig.json`
  - **Details:** Initialize Expo / Bare React Native CLI project, configure TypeScript strict mode (`"strict": true`), configure Metro bundler, setup path aliases (`@components`, `@screens`, `@store`).

- [ ] **Task 0.2: Design Tokens & Theme Engine Setup**
  - **Status:** Not Started
  - **Prototype Base:** `src/theme.ts`, `src/lucide-react-native.d.ts`
  - **Details:** Implement exact Slate Dark theme and AOLO Lime Green brand colors (`brandColors.aoloGreen = #A8E63C`), typography scale (`Outfit`, `Inter`, `JetBrains Mono`), spacing system (4px grid), and Lucide Icon mapping from `design.md`.

- [ ] **Task 0.3: Firebase SDK & Native Config Integration**
  - **Status:** Not Started
  - **Prototype Base:** `src/types.ts`
  - **Details:** Configure `@react-native-firebase/app`, `auth`, `firestore`, `storage`, and `messaging`. Setup `google-services.json` (Android) and `GoogleService-Info.plist` (iOS).

- [ ] **Task 0.4: Navigation Architecture Setup (React Navigation v6)**
  - **Status:** Not Started
  - **Prototype Base:** `App.tsx` (Current sheet modal navigation)
  - **Details:** Setup `RootNavigator`, `AuthNavigator` (Stack), `MainTabNavigator` (Bottom Tabs), and sheet modal navigators.

- [ ] **Task 0.5: Global State Management Setup (Zustand)**
  - **Status:** Not Started
  - **Prototype Base:** `App.tsx` (Root React state variables)
  - **Details:** Create Zustand stores (`useAuthStore`, `useRideStore`, `useWalletStore`, `useUIStore`) to replace root `useState` calls in `App.tsx`.

---

## Phase 1: Authentication & Onboarding Sequence

- [ ] **Task 1.1: Animated 5-Step Onboarding Sequence**
  - **Status:** Not Started
  - **Prototype Base:** `AOLOCabs New UI - Fixed.pdf` Pages 2–4 (Onboarding Spec)
  - **Details:** Implement 5-step onboarding slider with Bihar district localization ("Saharsa, Bihar"), feature cards, step progress indicators, and "Skip" / "Get Started" transitions.

- [ ] **Task 1.2: Customer Login & Password Authentication**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/AuthScreen.tsx`
  - **Details:** Build Mobile/Email & Password login view with password visibility toggle, input validation, and Firebase Auth integration (`signInWithEmailAndPassword`).

- [ ] **Task 1.3: Google Single Sign-On (SSO) Integration**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/AuthScreen.tsx` ("Continue with Google" button)
  - **Details:** Integrate `@react-native-google-signin/google-signin` producing OAuth credentials passed to `firebase.auth().signInWithCredential()`.

- [ ] **Task 1.4: Phone Number SMS OTP Verification Flow**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/AuthScreen.tsx`
  - **Details:** Build +91 Phone input, SMS OTP trigger (`signInWithPhoneNumber`), 6-digit PIN input with resend timer, and session retention.

- [ ] **Task 1.5: Production Safe-Guard: Environment-Gated Demo Login**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/AuthScreen.tsx` ("Instant Demo Access" button)
  - **Details:** Gate demo login handlers under `__DEV__` and `process.env.EXPO_PUBLIC_ENABLE_DEMO_LOGIN === 'true'` to ensure complete stripping from production release builds.

---

## Phase 2: Core Booking Engine & Dispatch

- [ ] **Task 2.1: Dynamic Home Screen & Native Map Viewport**
  - **Status:** Not Started
  - **Prototype Base:** `App.tsx`, `src/components/Header.tsx`, `src/components/WeatherWidget.tsx`
  - **Details:** Integrate `react-native-maps` `<MapView>` with user location pinning, top `Header` (Hamburger menu, location title, avatar), and `WeatherWidget` (`32°C`, Sun/Cloud icon).

- [ ] **Task 2.2: Mode Switcher & Quick Service Chips**
  - **Status:** Not Started
  - **Prototype Base:** `App.tsx` (`quickServicesRow`)
  - **Details:** Implement floating search card overlay ("Where to?" green dot) and quick chips ("City Ride", "Hourly Rental", "Airport Express", "Outstation").

- [ ] **Task 2.3: Location Selector & Google Places Auto-Suggest**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/PickupDestinationFlow.tsx`
  - **Details:** Build pickup/drop search flow with Google Places Autocomplete API integration, swap locations action, dual tabs ("ONE WAY" vs "ROUND TRIP"), and advance schedule calendar picker.

- [ ] **Task 2.4: Multi-Stop Highway Pitstop Route Builder**
  - **Status:** Not Started
  - **Prototype Base:** `AOLOCabs New UI - Fixed.pdf` Page 23 (Multi-Stop Routing)
  - **Details:** Implement intermediate destination pitstop builder for intercity routes ("+ Add intercity pitstop...") with highway stopover duration inputs.

- [ ] **Task 2.5: Vehicle Class Selection & Fare Breakup Accordion**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/BookingSheet.tsx`, `src/data/mockData.ts` (`VEHICLE_CLASSES`)
  - **Details:** Build vehicle comparison cards (AOLO Compact vs AOLO Sedan with seat/luggage limits), expandable fare breakup (Base + Taxes + Driver Allowance), payment method selector, and +₹15 ride insurance toggle.

- [ ] **Task 2.6: Live Driver Matching & Scanning Radar**
  - **Status:** Not Started
  - **Prototype Base:** `App.tsx` (`handleConfirmBooking`), `AOLOCabs New UI - Fixed.pdf` Page 30 (Dispatch Radar)
  - **Details:** Implement pulsing radar scanning animation, create `/rides` document in Firestore with `status: 'SEARCHING'`, broadcast request to Node.js backend dispatch engine, and enable 1-tap request cancellation.

---

## Phase 3: Real-Time Ride Management & Tracking

- [ ] **Task 3.1: Live GPS Driver Tracking on Native Map**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/MapSimulator.tsx`
  - **Details:** Replace 2D Canvas grid simulator with real Firestore `/drivers/{driverId}` `onSnapshot` listener. Render Google Directions polyline (`@mapbox/polyline`) and smooth `Marker.Animated` with Haversine bearing car icon rotation.

- [ ] **Task 3.2: Ride Progress Sheet & PIN Security Disclosure**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/RideProgressSheet.tsx`
  - **Details:** Build active ride sheet displaying assigned driver details (photo, name, rating, vehicle plate), 4-digit security OTP (`JetBrains Mono`), ride status pill (`ACCEPTED` ➔ `ARRIVING` ➔ `IN_PROGRESS` ➔ `COMPLETED`), and Call Captain trigger.

- [ ] **Task 3.3: Two-Way Real-Time Driver Chat Drawer**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/ChatDrawer.tsx`
  - **Details:** Replace simulated replies with Firestore `/chatMessages` collection subscription enabling real-time passenger-driver text messaging with push notification triggers.

- [ ] **Task 3.4: Tri-Tab My Rides Dashboard & Electronic Invoices**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/RideHistory.tsx`
  - **Details:** Build tri-tab view ("UPCOMING", "CURRENT", "HISTORY"), fetch rides from Firestore `/rides`, render booking cards (#AOLO111192), enable 1-tap rebooking, and generate PDF e-invoices.

---

## Phase 4: Digital Wallet & Payment Gateway Integration

- [ ] **Task 4.1: Closed-Loop Digital Wallet UI & Balance Card**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/WalletSheet.tsx`
  - **Details:** Build wallet modal with balance display (`₹250` in `JetBrains Mono`), auto-replenish toggle, quick top-up preset chips (`+₹100`, `+₹500`, `+₹1,000`), and transaction statement ledger.

- [ ] **Task 4.2: Payment Gateway Integration (Razorpay / Cashfree India)**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/WalletSheet.tsx` (`onAddMoney`)
  - **Details:** Integrate native `react-native-razorpay` / Cashfree SDK to support real UPI (GPay/PhonePe/Paytm deep links), Credit/Debit cards, and Netbanking top-ups.

- [ ] **Task 4.3: Split Payout & Advance Token Engine**
  - **Status:** Not Started
  - **Prototype Base:** `AOLOCabs New UI - Fixed.pdf` Page 28 (Financial Payout Breakdown)
  - **Details:** Implement automated split payment logic in Node.js backend: charge advance online token (e.g., ₹3,040) at booking time and record remaining balance payout (e.g., ₹9,120) to driver upon trip completion.

- [ ] **Task 4.4: Wallet Transaction Ledger Sync**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/WalletSheet.tsx`
  - **Details:** Sync all top-ups, ride advance debits, refunds, and referral credits to Firestore `/walletTransactions` with real-time balance updates.

---

## Phase 5: Extended Features & Profile Hotspots

- [ ] **Task 5.1: Hourly & Multi-Day Rental Booking Flow**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/RentalBookingFlow.tsx`
  - **Details:** Build hourly package selection (4h/40km, 8h/80km, 12h, 15h) and multi-day rental counter with drop date calendar picker.

- [ ] **Task 5.2: Dedicated Airport Transfer Flow**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/AirportBookingFlow.tsx`
  - **Details:** Build airport transfer flow with "Ride to Airport" vs "Ride from Airport" switcher, terminal selection (T1/T2), flight number input, and 1-hour free buffer notice.

- [ ] **Task 5.3: Saved Hotspots & Address Book (Home & Work)**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/ProfileSheet.tsx`, `AOLOCabs New UI - Fixed.pdf` Page 22
  - **Details:** Build 1-tap location resolution for "Home Address", "Work Address", and custom places ("FitPro Gym"). Store coordinates in Firestore `/users/{userId}`.

- [ ] **Task 5.4: User Profile & Sidebar Navigation Drawer**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/ProfileSheet.tsx`, `src/components/SidebarDrawer.tsx`
  - **Details:** Build profile editor (Name, Phone +91 badge, Email) and navigation drawer with avatar header, wallet balance pill, feature directory, and secure sign-out.

- [ ] **Task 5.5: Curated Road Trips & Discount Coupon Engine**
  - **Status:** Not Started
  - **Prototype Base:** `AOLOCabs New UI - Fixed.pdf` Pages 18–19
  - **Details:** Implement popular intercity fixed-fare cards (Saharsa-Patna ₹2,499, Patna-Darbhanga ₹1,499) and promo coupon redemption engine (`AOLONEW`, `RENTAL50`).

- [ ] **Task 5.6: Viral Referral Program & Social Deep-Linking**
  - **Status:** Not Started
  - **Prototype Base:** `AOLOCabs New UI - Fixed.pdf` Page 20 (Refer & Earn)
  - **Details:** Build unique referral code generator, social share links, and automated ₹100 wallet credit trigger upon friend's first completed ride.

---

## Phase 6: AOLO Corporate Portal (Role-Based Access)

- [ ] **Task 6.1: Corporate Registration & Inquiry Sheet (v1 Scope)**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/CorporateSheet.tsx`
  - **Details:** Build v1 corporate inquiry modal allowing enterprise admins to register interest and request custom GST billing packages.

- [ ] **Task 6.2: 3-Tier Enterprise Role Access (Phase 2 Backend Scope)**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/CorporateSheet.tsx`, `AOLOCabs New UI - Fixed.pdf` Page 21
  - **Details:** Implement Level 1 Corporate Admin (company wallet, GST invoicing), Level 2 Team Manager (trip approvals, budget caps), and Level 3 Employee Traveler (policy-bound booking) database schemas in Firestore.

---

## Phase 7: Travel Mode Ecosystem & Ancillary Services

- [ ] **Task 7.1: Travel Mode Ecosystem UI Portal**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/TravelModeView.tsx`, `AOLOCabs New UI - Fixed.pdf` Page 8
  - **Details:** Build Travel Mode tab displaying category cards for Flights, IRCTC Trains, Sleeper Buses, 5-Star Hotels, Travel Insurance, and Visa Processing.

- [ ] **Task 7.2: Affiliate Partner Integration & Lead Capture (v1 Scope)**
  - **Status:** Not Started
  - **Prototype Base:** `src/components/TravelModeView.tsx`
  - **Details:** Connect travel category cards to external partner webviews or lead capture modals for v1 release. Deep GDS flight/IRCTC API integration deferred to Phase 2.

---

## Phase 8: Testing, Optimization & Release Preparation

- [ ] **Task 8.1: Dual-Platform Verification (iOS & Android)**
  - **Status:** Not Started
  - **Prototype Base:** Whole App
  - **Details:** Verify layout, safe area insets, keyboard handling, and shadow/elevation rendering across iOS Simulator and Android Emulator.

- [ ] **Task 8.2: Security & Production Hardening**
  - **Status:** Not Started
  - **Prototype Base:** Whole App
  - **Details:** Enforce Firestore security rules, restrict Google Maps API keys (SHA-1 fingerprint / Bundle ID), verify zero unhandled exceptions, and confirm complete stripping of demo credentials.

---

**[END OF IMPLEMENTATION CHECKLIST - AOLO CABS REACT NATIVE]**
