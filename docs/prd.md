# Product Requirement Document (PRD): AOLO Cabs Mobile Application (iOS & Android)

**Document Version:** 2.0.0  
**Target Platform:** React Native (iOS & Android)  
**Status:** Approved Technical & Functional Specification  
**Reference Assets:** `AOLOCabs New UI - Fixed.pdf` (31-Page Design Spec) & `aolo-passenger_apk` (React Prototype)  

---

## 1. Product Overview

**AOLO Cabs** is a next-generation multi-modal mobility and intercity ride-hailing platform specifically engineered for tier-2/tier-3 regional corridors in India (with initial focus on Bihar: Saharsa, Patna, Darbhanga, Purnia, Bhagalpur) alongside city cab operations. 

Unlike traditional cab-hailing apps tailored solely for metro point-to-point transit, AOLO Cabs delivers a comprehensive regional mobility ecosystem. It seamlessly integrates local city rides, transparent one-way and round-trip intercity corridors (eliminating illegal return-fare charges), multi-stop highway pitstop routing, hourly/daily vehicle rentals, and dedicated airport transfers with flight tracking. Furthermore, it introduces a closed-loop digital wallet, role-based corporate mobility management, and an integrated travel ecosystem (flights, trains, hotels, and visas).

### Core Value Proposition
- **Transparent Fixed Pricing:** No unexpected surge multipliers; clear fare split between advance online token deposits and driver payouts.
- **Intercity & Highway Optimization:** Dedicated pitstop routing and round-trip highway management tailored for regional Indian routes.
- **Multi-Modal Mobility:** Single app handling City Cabs, Intercity Express, Hourly Rentals, Airport Transfers, and Corporate Business Travel.

---

## 2. Target Users

| User Persona | Key Characteristics | Primary Goals & Needs |
| :--- | :--- | :--- |
| **Retail Commuter (City)** | Daily commuters, students, shoppers in Patna, Saharsa, Darbhanga. | Quick pickup, low wait time, accurate live tracking, transparent fares, closed-loop wallet payments. |
| **Intercity Traveler** | Families, business travelers moving between districts (e.g., Saharsa ↔ Patna). | Guaranteed transparent one-way pricing without return-fare penalties, multi-stop pitstops, advance scheduling, bag/passenger verification. |
| **Business / Hourly Rentee** | Executives, wedding guests, tourists needing cabs for multiple meetings/stops. | Flexible package selections (4h/40km, 8h/80km, daily), dedicated captain, predictable pricing. |
| **Airport Passenger** | Air travelers flying out of Patna / Bagdogra airports. | Timely airport pickup/drop, terminal selection (T1/T2), flight delay buffer support, luggage capacity verification. |
| **Corporate Admin (Level 1)** | HR / Operations Lead managing company travel policies. | Provisioning employee accounts, centralized company wallet management, consolidated GST billing, department budget caps. |
| **Team Manager (Level 2)** | Department leads approving business travel. | Trip request approvals, auditing team travel expenditure, enforcing per-trip policy spend limits. |
| **Employee Traveler (Level 3)** | Corporate staff traveling on business. | Frictionless business booking under pre-approved company budget limits without manual expense claims. |

---

## 3. Core Problem Statement

Mobility in tier-2 and tier-3 Indian regions suffers from chronic inefficiencies:
1. **Unorganized Outstation Cab Market:** Drivers frequently charge passengers double-sided return fares for one-way intercity trips (e.g., Saharsa to Patna).
2. **Opaque Pricing & Hidden Tolls:** Passengers face unannounced toll charges, driver allowance markups, and unexpected surge multipliers during peak hours.
3. **Lack of Highway Routing Support:** Standard rideshare apps fail to support multi-stop intercity pitstops (highway dhabas, family breaks, multi-city drops) gracefully.
4. **Fragile Dispatch in Regional Hubs:** Poor driver availability and high cancellation rates due to lack of upfront destination and transparent split-payment clarity for captains.
5. **Inefficient Corporate Expense Claims:** Small-to-medium businesses in regional hubs manually reimburse receipts instead of using automated corporate wallets and GST invoices.

**AOLO Cabs fills this gap** by providing a localized, transparent, fixed-fare multi-modal platform backed by driver-friendly split payouts (advance digital token + driver cash/wallet payout) and multi-stop intercity routing.

---

## 4. Feature List Breakdown

### 4.1 MVP (Must-Have for v1)

| Module | Features & Capabilities | Reference Spec Pages |
| :--- | :--- | :--- |
| **Onboarding & Auth** | 5-step animated splash sequence, Bihar district localization, Mobile + OTP auth, Password login, Google OAuth 2.0 SSO, session retention. | Pages 1-5 |
| **Home Screen & Navigation** | Interactive Google Maps viewport with GPS pinning, Weather widget, Dual mode toggle ("Ride Mode" vs "Travel Mode"), Quick booking cards. | Pages 6-7 |
| **Location & Hotspots** | Pickup/Drop pin selection, Google Places auto-suggest, Saved Hotspots (Home & Work shortcuts, Custom Places like Gym). | Pages 7, 16, 22 |
| **City & Intercity Booking** | One-Way & Round-Trip routing, multi-stop pitstop route builder, route geometry preview (12 km, 16 min card), departure scheduling toggle ("Now" vs Advance Date/Time). | Pages 9, 23-27 |
| **Fleet Selection & Pricing** | Tiered vehicle selection (Compact AC e.g. WagonR vs Sedan AC e.g. Dzire), bag/passenger counters, expandable fare breakup, passenger pet policy badge. | Pages 9, 24, 26, 28 |
| **Rental Services** | Hourly package selection (4h/40km, 8h/80km, 12h, 15h), Daily multi-day rentals with drop date and duration counter. | Page 12 |
| **Airport Transfers** | Bi-directional mode switch ("Ride to Airport" vs "Ride from Airport"), Terminal selection (T1/T2), flight number input, 1-hr free buffer badge. | Page 13 |
| **Live Dispatch & Radar** | Pulsing radar animation broadcasting booking to nearby drivers, active vehicle matching, driver arrival card, 4-digit PIN verification. | Pages 10, 30 |
| **Active Ride & Chat** | Real-time driver location bar, driver details, direct call trigger, in-app real-time chat with driver, instant cancellation option. | Pages 3, 10, active app |
| **Digital Wallet** | Closed-loop AOLO Wallet, live balance display, quick top-up presets (+₹100, +₹500, +₹1,000), auto-replenish toggle, transaction statement. | Pages 15, 28 |
| **Split Payout Engine** | Fare breakdown showing Base + Taxes + Driver Allowance + Advance Token Paid online + Remaining Payout to Driver upon drop. | Pages 28, 31 |
| **My Rides Dashboard** | Tri-tab history (Upcoming, Current, History), trip cards with status badges (#AOLO111192), e-invoice download, instant re-booking. | Page 14 |
| **Offers & Corridors** | Curated road trip corridors (Saharsa-Patna ₹2,499, Patna-Darbhanga ₹1,499, Saharsa-Purnia ₹1,199), coupon engine (AOLONEW, RENTAL50). | Pages 18-19 |
| **Account & Profile** | Profile management (Name, Phone, Email), Slide-out navigation drawer with avatar, balance pill, and feature directory. | Pages 16-17 |

### 4.2 Phase 2 (Nice-to-Have / Post-v1)

| Module | Features & Capabilities | Reference Spec Pages |
| :--- | :--- | :--- |
| **Corporate Portal** | 3-tier role-based access: Level 1 Admin (company wallet, GST invoices), Level 2 Manager (trip approval workflow, budget caps), Level 3 Employee (frictionless business ride booking). | Pages 21, 31 |
| **Travel Mode Ecosystem** | Integrated booking modules for Flights, IRCTC Trains, Sleeper Buses, 5-Star Hotels, Travel Insurance, Visa Processing, and Holiday Tour packages. | Pages 8, 31 |
| **Viral Referral Program** | Unique referral code generator, social sharing deep links, automated dual ₹100 wallet credit triggers upon friend's first completed trip. | Pages 20, 31 |
| **Flight Radar Integration** | Live FlightAware API connection to automatically adjust airport cab pickup times based on real-time flight delay telemetry. | Pages 13, 31 |

---

## 5. User Stories by Screen

### 5.1 Onboarding & Authentication Flow (Pages 1–5)
- **Onboarding Screens (Steps 1–5):**  
  *As a new user,* I want to swipe through an animated 5-step onboarding guide introducing Saharsa/Bihar booking modes, live GPS tracking, transparent payments, and a 3-step guide *so that* I understand AOLO Cabs' features before logging in.
- **Login / Authentication Screen:**  
  *As a passenger,* I want to log in using my mobile number/password or via 1-tap Google SSO *so that* I can securely access my account and wallet without repetitive credential prompts.

### 5.2 Dynamic Home Screen & Navigation (Pages 6–7)
- **Live Map & Mode Switcher:**  
  *As a passenger,* I want to view my current GPS location on a full-screen interactive Google Map with local weather updates and toggle between "Ride Mode" and "Travel Mode" *so that* I can quickly choose my travel type.
- **Quick Booking Cards:**  
  *As a passenger,* I want quick-action chips for City, Intercity, Hourly Rental, and Airport Express *so that* I can trigger specific booking flows in one tap.

### 5.3 Location Selector & Address Management (Pages 7, 16, 22)
- **Pickup & Drop Pinning Screen:**  
  *As a passenger,* I want an auto-suggest location search bar supporting Google Places and popular district hubs *so that* I can set precise pickup and drop locations.
- **Saved Places & Hotspots Screen:**  
  *As a passenger,* I want to save "Home", "Work", and custom places like "Gym" *so that* I can navigate to frequent destinations with 1-tap fast destination resolution.

### 5.4 City & Intercity Booking Engine (Pages 9, 23–27)
- **Multi-Stop Route Builder Screen:**  
  *As an intercity passenger,* I want to add intermediate highway pitstops between my pickup point and final drop destination *so that* my driver is aware of highway break stops and the app calculates the stopover routing automatically.
- **Vehicle Selection & Pricing Screen:**  
  *As a passenger,* I want to compare vehicle tiers (Compact AC vs Sedan AC) displaying seat capacity, luggage capacity, and price range *so that* I can pick the vehicle best suited for my group.
- **Route Geometry Preview Screen:**  
  *As a passenger,* I want to inspect the trip distance (e.g., 12 km), estimated duration (16 min), and choose between immediate pickup ("Now") or scheduled departure *so that* I can confirm my ride details.
- **Passenger Verification & Luggage Screen:**  
  *As a passenger,* I want to specify passenger counts (Adults, Children) and luggage units (Big/Small bags) *so that* the driver accepts a verified trip without space conflicts.

### 5.5 Transparent Fare Breakdown & Payment Trigger (Pages 27–28)
- **Fare Breakdown & Split Payout Screen:**  
  *As a passenger,* I want to see an itemized fare breakdown (Base Fare + Taxes + Driver Allowance + Extra Km/Min rates) and the split payout (Online Advance Token vs Remaining Payout to Driver) *so that* I know exactly what I pay upfront and what I hand over to the driver.

### 5.6 Live Taxi Dispatch Radar & Ride Execution (Pages 10, 30, Active App)
- **Dispatch Radar Screen:**  
  *As a passenger,* I want to see a radar scanning animation matching me with nearby drivers while displaying an option to cancel instantly *so that* I am informed during driver allocation.
- **Active Ride & Live Tracking Screen:**  
  *As a passenger,* I want to see the assigned driver's details (name, photo, vehicle number, rating), vehicle GPS position moving on the map, 4-digit PIN, and an in-app chat drawer *so that* I can communicate with the driver and monitor my journey.

### 5.7 Rental Services (Page 12)
- **Hourly & Daily Rental Screen:**  
  *As a business traveler,* I want to select hourly rental packages (4h/40km, 8h/80km, 12h, 15h) or daily multi-day rentals with drop dates *so that* I can keep a dedicated cab and captain for multiple meetings.

### 5.8 Airport Transfers (Page 13)
- **Airport Express Screen:**  
  *As an air traveler,* I want to toggle between "Ride to Airport" and "Ride from Airport", select my terminal (T1/T2), and input my flight number *so that* my cab arrival is synchronized with my flight.

### 5.9 Digital Wallet & Financial Ledger (Page 15)
- **AOLO Digital Wallet Screen:**  
  *As a passenger,* I want to view my wallet balance, trigger preset top-ups (+₹100, +₹500, +₹1,000), toggle auto-replenish, and view past transaction logs *so that* I can pay seamlessly without cash hassle.

### 5.10 Booking Management (Page 14)
- **My Rides Dashboard Screen:**  
  *As a passenger,* I want a tri-tab view of Upcoming, Current, and History rides with booking IDs (#AOLO111192), e-invoices, and re-book buttons *so that* I can track all past and future trips.

### 5.11 Curated Road Trips & Offers (Pages 18–19)
- **Road Trips & Coupon Portal Screen:**  
  *As a passenger,* I want to browse fixed-fare intercity road trips (Saharsa-Patna ₹2,499) and apply coupon codes (AOLONEW, RENTAL50) *so that* I get maximum value on my trips.

### 5.12 Refer & Earn Program (Page 20 - Phase 2)
- **Referral Rewards Screen:**  
  *As a passenger,* I want to copy and share my unique referral code *so that* both my friend and I receive ₹100 wallet cashback when they complete their first ride.

### 5.13 AOLO Corporate Portal (Page 21 - Phase 2)
- **Role-Based Enterprise Screen:**  
  *As a corporate admin/manager/employee,* I want role-restricted views to manage department wallets, approve travel requests, or book rides charged directly to the company budget.

### 5.14 Travel Mode Ecosystem (Page 8 - Phase 2)
- **Multi-Modal Tourism Screen:**  
  *As a traveler,* I want to explore flight, train, bus, hotel, and visa services within the app *so that* I can plan end-to-end travel.

---

## 6. Out of Scope for v1 (Real vs. Simulated Matrix)

The existing React web prototype (`aolo-passenger_apk`) utilizes mock data generators, simulated timeouts, and static state objects. The table below explicitly defines what must transition to **REAL production systems** in v1 versus what remains **SIMULATED or deferred to Phase 2**.

| Component / Feature | React Web Prototype State | v1 React Native Mobile App Requirement | Reason / Technical Target |
| :--- | :--- | :--- | :--- |
| **Driver Matching & Dispatch** | `SIMULATED_DRIVERS` array with `setTimeout` (2.5s delay to mock accept). | **BECOMES REAL** | Live WebSocket / Firebase Cloud Messaging (FCM) dispatch engine broadcasting booking payload to real Driver App instances within radius. |
| **Interactive Map & GPS** | `MapSimulator.tsx` rendering HTML5 Canvas with static SVG cars. | **BECOMES REAL** | Native `react-native-maps` integration using real Google Maps SDK API key, live device geolocation geolocation, and Google Directions API polyline rendering. |
| **Authentication & OTP** | Hardcoded `userProfile` state and mock login toggle. | **BECOMES REAL** | Firebase Authentication (SMS Phone OTP verification) & Google OAuth 2.0 Native SSO SDK. |
| **Payment Gateway & Wallet** | State integer `walletBalance: 250` updated via local increment. | **BECOMES REAL** | Production Razorpay / Cashfree SDK integration for real UPI (GPay/PhonePe), Credit/Debit cards, netbanking top-ups, and automated split payment payouts. |
| **Geocoding & Location Search** | Static `POPULAR_LOCATIONS` array in `mockData.ts`. | **BECOMES REAL** | Google Places Autocomplete API & Google Reverse Geocoding API integration for real-time worldwide address resolution. |
| **AOLO Corporate Portal** | `CorporateSheet.tsx` UI tabs with simulated department balances. | **STAYS SIMULATED / DEFERRED TO PHASE 2** | v1 renders a Corporate Inquiry / Registration waitlist sheet. Full 3-tier enterprise DB schema and approval workflow deferred to Phase 2. |
| **Travel Mode (Flights/Trains/Hotels)**| `TravelModeView.tsx` cards rendering static deal cards. | **STAYS SIMULATED / DEFERRED TO PHASE 2** | v1 presents promotional UI entry points opening external affiliate webviews or lead capture modals. Deep API integrations deferred to Phase 2. |
| **Flight Delay Tracking API** | Text input field storing flight number in local state. | **STAYS SIMULATED / DEFERRED TO PHASE 2** | Flight number string stored as metadata in airport booking payload for driver reference. Real-time FlightAware telemetry connection deferred to Phase 2. |
| **Referral Credit Distribution** | Static referral code text generator. | **STAYS SIMULATED / DEFERRED TO PHASE 2** | Deep link sharing enabled in v1; automated ledger cashback rule engine deferred to Phase 2. |

---

## 7. Success Metrics

To validate the success of the AOLO Cabs React Native mobile app launch, performance will be tracked against the following Key Performance Indicators (KPIs):

1. **Booking Completion Rate:** $\ge 85\%$ of initiated pickup-drop searches result in a confirmed ride.
2. **Average Driver Acceptance Time:** $< 45\text{ seconds}$ from dispatch radar trigger to driver acceptance in primary Bihar corridors (Patna, Saharsa, Darbhanga).
3. **App Crash Rate:** $< 0.1\%$ crashed sessions per 1,000 active user sessions across both iOS and Android platforms.
4. **Digital Wallet Adoption:** $\ge 60\%$ of active monthly passengers maintain a positive AOLO Wallet balance and utilize it for advance token payouts.
5. **Search-to-Book Conversion:** $\ge 35\%$ conversion rate from location input screen to final booking confirmation.
6. **Customer App Store Rating:** Target average rating of $\ge 4.6 / 5.0$ on both Google Play Store and Apple App Store within 90 days of launch.
7. **Driver Cancellation Rate:** $< 5\%$ driver-initiated cancellations after acceptance due to transparent split-payment disclosures.

---

## 8. Assumptions & Technical Constraints

### 8.1 Technical Architecture Stack
- **Frontend Framework:** React Native (Cross-platform targeting iOS 14.0+ and Android 8.0+ / API Level 26+).
- **Navigation Engine:** React Navigation v6 (Native Stack & Bottom Tabs).
- **Backend Infrastructure:** 
  - **Database & Realtime Sync:** Cloud Firestore / Firebase Realtime Database for live ride lifecycle tracking, driver GPS coordinates, and real-time chat messages.
  - **Custom Backend Logic:** Node.js + Express microservices deployed on Google Cloud Run / AWS Lambda for fare computation algorithms, split payout logic, driver dispatch radius queries, and payment webhook processing.
- **Authentication:** Firebase Auth (Phone Number SMS OTP + Google Sign-In SDK).
- **Mapping & Location:** `react-native-maps`, Google Maps SDK for iOS/Android, Google Places API, Google Matrix API.
- **Payment Gateway:** Razorpay / Cashfree India SDK (UPI Deep-Linking, Cards, Netbanking, Auto-Debit).

### 8.2 Design & UX Constraints
- **Pixel-for-Pixel Fidelity:** The React Native mobile app UI/UX must strictly mirror the visual design system established in the 31-page PDF specification and the React prototype.
- **Theme Palette:**
  - Background Dark: `#0F172A` (Slate 900)
  - Card Surface Dark: `#1E293B` (Slate 800)
  - Primary Accent: `#3B82F6` (Electric Blue) & `#10B981` (Emerald Green for active/success states)
  - Text Primary: `#F8FAFC` / Text Secondary: `#94A3B8`
  - Card Borders: `rgba(255, 255, 255, 0.08)`
- **Native Performance Constraints:** Smooth 60 FPS transitions for sheet modals, bottom drawers, and live map markers using Native Driver animations (`react-native-reanimated`).
- **Network Resilience:** Graceful offline handling and auto-retry policies for transient signal drops on highway corridors.

---

**[END OF PRD - AOLO CABS 2.0 MOBILE APP]**
