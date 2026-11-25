# Project Memory & Session Context: AOLO Cabs React Native

**Last Updated:** 2026-09-26T16:22:45+05:30  
**Project Name:** AOLO Cabs Mobile App  
**One-Line Summary:** AOLO Cabs is a multi-modal regional cab booking mobile app (Bihar/India intercity + city cab hailing), converted from an existing React web prototype (`aolo-passenger.apk/react-native-app`) and 31-page PDF specification (`AOLOCabs New UI - Fixed.pdf`).

---

> [!IMPORTANT]
> ### MANDATORY AGENT INSTRUCTION
> **READ THIS FILE FIRST AT THE START OF EVERY SESSION BEFORE MAKING ANY CODE OR DOCUMENTATION CHANGES.**  
> **UPDATE THIS FILE AT THE END OF EVERY SESSION WITH WHAT WAS COMPLETED, WHAT WAS ALTERED, AND WHAT IS NEXT.**

---

## 1. Non-Negotiable Tech Stack Decisions

These technical decisions are final and must not be re-debated or altered:

- **Frontend:** React Native (Cross-platform targeting iOS 14+ and Android 8.0+ / API Level 26+).
- **Navigation:** React Navigation v6 (Native Stack & Bottom Tabs).
- **State Management:** Zustand (lightweight, atomic state selectors, zero frame drops during location tracking).
- **Database & Realtime Sync:** Cloud Firestore & Firebase Realtime Database.
- **Authentication:** Firebase Auth (SMS Phone OTP, Google OAuth 2.0 Native SSO, Email/Password).
- **Custom Backend Services:** Hybrid model — Node.js + Express microservices on Google Cloud Run (real-time dispatch matching, H3 spatial indexing, split-payment webhooks) + Firebase Cloud Functions (asynchronous event triggers & push notifications).
- **Mapping & Geolocation:** `react-native-maps` with Google Maps SDK for iOS/Android, Google Places API, and Google Directions API.
- **Payment Gateway:** Razorpay / Cashfree India SDK (UPI Deep-Linking, Credit/Debit Cards, Netbanking).

---

## 2. Non-Negotiable UI/UX Rule

> **UI/UX MUST EXACTLY MATCH THE APPROVED DESIGN AT ALL TIMES.**

- **Zero Unapproved Alterations:** Do NOT invent, guess, or "improve" any color, font family, font weight, spacing value, component structure, or screen layout.
- **Brand Colors:**
  - `aoloGreen` (Primary/CTA): `#A8E63C`
  - `aoloGreenHover`: `#7FB82C`
  - `aoloBlack` (Background): `#0A0A0A`
  - `aoloCharcoal` (Card Surface): `#151915`
  - `aoloWhite`: `#FFFFFF`
  - `aoloGray`: `#8A9184`
  - `aoloBorderDark`: `#262B1E`
  - `aoloRed`: `#E53935`
- **Typography:** Display Headings = `"Outfit"`, Body Text = `"Inter"`, Fares/IDs/Timers = `"JetBrains Mono"`.
- Refer directly to [`design.md`](file:///c:/Users/bk200/Desktop/ola/design.md) for full component contracts.

---

## 3. Current Project Status

- **Phase 0 (Setup):** `[DONE]` — Initialized Expo project, installed dependencies, setup theme engine, Firebase SDK, Zustand stores, and navigation.
- **Phase 1 (Auth & Onboarding):** `[DONE]` — 3-Step Onboarding Slider (`OnboardingScreen.tsx`), Customer Login & SSO (`AuthScreen.tsx`).
- **Phase 2 (Core Booking Engine):** `[DONE]` — `HomeScreen.tsx`, cross-platform `MapViewComponent`, location selector (`PickupDestinationFlow.tsx`), fleet comparison & fare breakup accordion (`BookingSheet.tsx`), driver radar triggers.
- **Phase 3 (Ride Management):** `[DONE]` — Active ride tracking bar, 4-digit PIN disclosure (`RideProgressSheet.tsx`), 2-way text chat (`ChatDrawer.tsx`), tri-tab ride history dashboard (`RideHistory.tsx`).
- **Phase 4 (Wallet & Payments):** `[DONE UI]` — Closed-loop wallet UI (`WalletSheet.tsx`), top-up presets, transaction statement ledger.
- **Phase 5 (Extended Features):** `[DONE]` — Hourly rentals (`RentalBookingFlow.tsx`), Airport transfers (`AirportBookingFlow.tsx`), Saved hotspots & profile (`ProfileSheet.tsx`), Sidebar navigation menu (`SidebarDrawer.tsx`).
- **Phase 6 (Corporate Portal):** `[DONE UI]` — Role-based enterprise portal (`CorporateScreen.tsx`).
- **Phase 7 (Travel Mode):** `[DONE UI]` — Multi-modal travel portal (`TravelModeScreen.tsx`).
- **Phase 8 (Testing & Release):** `[IN_PROGRESS]` — Dual-platform iOS/Android & Web bundler verification.

Full checklist available at [`task.md`](file:///c:/Users/bk200/Desktop/ola/task.md).

---

## 4. Key Decisions Log

| Date | Category | Decision Made | Rationale / Context |
| :--- | :--- | :--- | :--- |
| **2026-09-26** | **Phase 0 & 1** | Built Expo project, navigation, theme system & Onboarding slider. | Completed Phase 0 setup & Phase 1 Onboarding with zero TypeScript errors (`npx tsc --noEmit` verified). |
| **2026-09-26** | **Architecture** | Hybrid Backend Model (Cloud Run Node.js + Firebase Cloud Functions). | Cloud Run avoids cold-start latency for real-time driver dispatch while Cloud Functions handle async push notifications. |
| **2026-09-26** | **State Management** | Selected Zustand over Redux Toolkit and Context API. | $<1.5\text{KB}$ bundle size, zero boilerplate, and atomic state selectors prevent map marker frame drops during 1s driver GPS updates. |
| **2026-09-26** | **Design System** | Enforced AOLO Lime Green palette (`#A8E63C`, `#0A0A0A`, `#151915`, `#262B1E`). | Strict 1:1 visual fidelity with user brand request and `design.md`. |
| **2026-09-26** | **Security** | Demo Access code gated under `__DEV__` and `process.env`. | Prevents simulated demo auth buttons from leaking into production release builds. |
| **2026-09-26** | **Scope Alignment** | Corporate Portal & Travel Mode deep APIs deferred to Phase 2. | v1 presents inquiry sheet and affiliate webview entry points to ship MVP faster while preserving UI layout. |

---

## 5. Known Issues & Open Discrepancies Log

1. **Home Header Layout Discrepancy:** PDF Page 6 displays Weather Widget + Location string in top header, while prototype `Header.tsx` includes Location + Weather Widget + User Avatar. (Pending user confirmation; currently retaining prototype layout).
2. **Intercity Pricing Formula Discrepancy:** PDF Page 24 lists Swift/WagonR Compact AC as fixed range `₹12,160 - ₹12,768`, while web `mockData.ts` computes fare dynamically (`basePrice * 10`). (Backend fare calculation engine will support distance matrix pricing with fallback minimum fixed rates).
3. **Travel Mode API Scope for v1:** Confirmed that Travel Mode (Flights, Trains, Hotels, Visas) will present UI promotional cards opening external affiliate webviews or lead capture modals in v1, with deep GDS/IRCTC APIs deferred to Phase 2.

---

## 6. Source of Truth Document References

- [`prd.md`](file:///c:/Users/bk200/Desktop/ola/prd.md) — Product Overview, Target Users, Problem Statement, MVP vs Phase 2 Features, User Stories, Out of Scope Matrix, Success Metrics.
- [`architecture.md`](file:///c:/Users/bk200/Desktop/ola/architecture.md) — High-Level Architecture, Backend Decision, Firestore Schemas, Real-Time Tracking Pipeline, Auth Flow, State Management, Navigation, Directory Layout.
- [`design.md`](file:///c:/Users/bk200/Desktop/ola/design.md) — Brand Color Tokens (`#A8E63C`), Typography (`Outfit`/`Inter`/`JetBrains Mono`), 4px Spacing Grid, Component Contracts, Screen-by-Screen Inventory, Icon Mapping.
- [`rules.md`](file:///c:/Users/bk200/Desktop/ola/rules.md) — Engineering Guidelines, Golden UI Rule, Context Checks, TypeScript Rules, Security Policies, Git Workflow, Adapter Refactoring Pattern, Ambiguity Policy.
- [`task.md`](file:///c:/Users/bk200/Desktop/ola/task.md) — Phase 0 to Phase 8 Implementation Checklist with file references and task status trackers.

---

**[END OF MEMORY FILE - AOLO CABS REACT NATIVE]**
