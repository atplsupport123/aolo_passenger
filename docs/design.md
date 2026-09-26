# Design System & UI/UX Specification: AOLO Cabs React Native Project

**Document Version:** 1.0.0  
**Target Platform:** React Native (iOS & Android)  
**Status:** Strict Design Specification  
**Reference Codebase:** `aolo-passenger.apk/react-native-app` & `AOLOCabs New UI - Fixed.pdf`  

---

> [!CAUTION]
> ### HARD RULE FOR ALL DEVELOPERS & AI AGENTS
> This project is a **STRICT 1:1 VISUAL & LAYOUT PORT** from web/spec to React Native mobile.
> **DO NOT INVENT, GUESS, OR "IMPROVE" ANY COLOR, FONT, SPACING, OR LAYOUT.**
> Every hex color code, font family, typography weight, spacing value, icon, component state, and screen layout MUST match the source specification exactly. Any deviation, "improvement", or creative reinterpretation is **STRICTLY PROHIBITED** and must be flagged for explicit approval before implementation.

---

## 1. Brand Colors (Exact Hex Tokens)

Use ONLY these exact hex color tokens. Do not substitute, approximate, or add unapproved color variations.

```typescript
export const brandColors = {
  // Primary / CTA Accent
  aoloGreen: '#A8E63C',        // Brand Lime Green (Primary CTA, active states, active tab indicator)
  aoloGreenHover: '#7FB82C',   // Pressed / Active hover green state

  // Surface & Background Colors
  aoloBlack: '#0A0A0A',        // Primary App Background (Full screen containers)
  aoloCharcoal: '#151915',     // Card Surface / Sheet Dark Background
  aoloWhite: '#FFFFFF',        // Pure White (High contrast headers & icons)
  aoloSoftWhite: '#F5F7F3',    // Secondary Text & Light Surfaces
  aoloOffWhite: '#F7F9F5',     // Input Backgrounds & Modal Cards
  aoloGray: '#8A9184',         // Muted Text, Subtitles, Inactive Icons

  // Border & Divider Tokens
  aoloBorderDark: '#262B1E',   // Dark Card Borders & Surface Dividers
  aoloBorderLight: '#E9EDE6',  // Light Theme Dividers & Subtle Borders

  // Status & Validation
  aoloRed: '#E53935',          // Error messages, alert badges, cancel actions
} as const;
```

---

## 2. Typography Specification

All text elements must strictly consume one of the three designated font families and approved weights.

| Usage / Category | Font Family | Approved Font Weights | Application Scope |
| :--- | :--- | :--- | :--- |
| **Display & Headings** | `"Outfit"` | `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold), `900` (Black) | Main screen titles, modal headers, vehicle category titles, promotional banners. |
| **Body & UI Labels** | `"Inter"` | `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold) | Button labels, paragraph text, location addresses, subtitles, input field values. |
| **Monospace / Numbers** | `"JetBrains Mono"` | `400` (Regular), `500` (Medium), `700` (Bold) | Fares (`₹12,768`), OTP PIN (`4892`), Booking IDs (`#AOLO111192`), countdown timers, distance metrics. |

---

## 3. Spacing & Grid System (4px Base Scale)

Spacing is strictly governed by a 4px base grid system corresponding to standard Tailwind spacing units used in the source codebase. Do not introduce non-standard pixel values.

```typescript
export const spacing = {
  px_1: 4,     // gap-1, p-1, m-1
  px_2: 8,     // gap-2, p-2, m-2
  px_3: 12,    // gap-3, p-3, m-3
  px_4: 16,    // gap-4, p-4, m-4 (Standard screen padding)
  px_5: 20,    // gap-5, p-5, m-5
  px_6: 24,    // gap-6, p-6, m-6 (Card inner padding)
  px_8: 32,    // gap-8, p-8, m-8
  px_10: 40,   // gap-10, p-10, m-10
  px_12: 48,   // gap-12, p-12, m-12
  px_16: 64,   // gap-16, p-16, m-16
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,      // Modal bottom sheet top radius & overlay cards
  full: 9999,  // Circular avatars & status pills
} as const;
```

---

## 4. Reusable UI Component Inventory & Exact Styling Contracts

### 4.1 Primary CTA Button (`AoloButton`)
- **Default State:** Background `#A8E63C`, Text `#0A0A0A` (`Outfit` Weight 700, 16px), Height `52px`, Border Radius `16px`, Centered text.
- **Pressed/Active State:** Background `#7FB82C`, scale `0.98`.
- **Disabled State:** Background `#262B1E`, Text `#8A9184`, opacity `0.5`, non-interactive.

### 4.2 Secondary Action Card / Chip (`QuickServiceChip`)
- **Default State:** Background `rgba(255, 255, 255, 0.03)`, Border `1px solid #262B1E`, Radius `12px`, Padding `8px 12px`. Text `#FFFFFF` (`Inter` Weight 600, 12px).
- **Selected State:** Background `rgba(168, 230, 60, 0.1)`, Border `1px solid #A8E63C`, Text `#A8E63C`.

### 4.3 Bottom Sheet Modal Container (`BottomSheetModal`)
- **Styling:** Background `#151915` (Charcoal), Top-Left & Top-Right Border Radius `24px`, Border Top `1px solid #262B1E`, Padding `20px`. Top drag indicator handle: Width `40px`, Height `4px`, Radius `2px`, Color `#8A9184`.

### 4.4 Tab Switchers (`ModeSwitcher` & `SubTabSwitcher`)
- **Container:** Background `#0A0A0A`, Border `1px solid #262B1E`, Radius `16px`, Padding `4px`.
- **Active Pill:** Background `#A8E63C`, Text `#0A0A0A` (`Outfit` Weight 700), Radius `12px`.
- **Inactive Pill:** Background `transparent`, Text `#8A9184` (`Outfit` Weight 500).

### 4.5 Luggage & Passenger Steppers (`ItemStepper`)
- **Layout:** Row container with label on left (`Inter` 14px `#FFFFFF`), minus/plus buttons on right.
- **Stepper Buttons:** `36px x 36px` square, Background `#262B1E`, Radius `8px`, Text `#A8E63C` 18px. Value count rendered in `JetBrains Mono` 16px `#FFFFFF`.

---

## 5. Screen-by-Screen UI Inventory

Below is the complete, zero-deviation UI inventory for every screen in the application.

### 5.1 Onboarding Sequence (Steps 1–3)
- **Purpose:** Introduce Bihar district mobility, live tracking, and secure payments before authentication.
- **Order & Elements:**
  1. Top hero illustration banner with location badge ("Saharsa, Bihar").
  2. Progress step indicator dots (3 steps, active dot `#A8E63C`, inactive `#262B1E`).
  3. Feature Title (`Outfit` 24px Bold `#FFFFFF`) & Description (`Inter` 14px `#8A9184`).
  4. Bottom row: "Skip" text link left (`Inter` 14px `#8A9184`), "Continue" Primary CTA right (`AoloButton`).
- **Animations:** Horizontal page slide transition (`react-native-reanimated`).

### 5.2 Authentication Screen (`AuthScreen.tsx`)
- **Purpose:** User registration and sign-in.
- **Order & Elements:**
  1. Top AOLO Cabs animated logo & subtitle "Enter mobile number to continue".
  2. Phone Number input field with country code prefix (+91) (`Inter` 16px `#FFFFFF`, Border `#262B1E`).
  3. Password input field with toggle visibility icon (`lucide-react-native` `Eye` / `EyeOff`).
  4. Primary "SIGN IN / REGISTER" CTA button (`AoloButton`).
  5. Divider "OR CONTINUE WITH".
  6. Google OAuth 2.0 SSO button (Google G icon + "Continue with Google", Background `#151915`, Border `#262B1E`).
  7. Environment-gated "Demo Login" button (`#262B1E` background, text `#8A9184`).

### 5.3 Dynamic Home Screen (`HomeScreen.tsx` & `Header.tsx`)
- **Purpose:** Main hub displaying real-time map, weather, and quick booking triggers.
- **Order & Elements:**
  1. Top `Header`: Left hamburger menu icon (`Menu`), center location pill ("Stadium Road, Saharsa"), right weather widget (Temp `32°C`, Icon `Sun`/`Cloud`) & User avatar.
  2. Main Viewport: Full-screen native Google Map (`<MapView>`).
  3. Floating Overlay Card (Bottom):
     - Search Bar trigger ("Where to?" green dot indicator, text `#8A9184`).
     - Quick Service Row: 4 chips ("City Ride", "Hourly Rental", "Airport Express", "Outstation").
     - Active Ride Progress Bar (Conditional when ride is active: `#A8E63C` background, text `#0A0A0A` bold).

### 5.4 Pickup & Destination Selector (`PickupDestinationFlow.tsx`)
- **Purpose:** Address search and pin positioning.
- **Order & Elements:**
  1. Header: Back arrow (`ArrowLeft`), Title "Select Locations".
  2. Ride Type Switcher: Dual tabs ("ONE WAY" vs "ROUND TRIP").
  3. Input Card: Pickup location input (Green dot) & Dropoff location input (Red pin), Swap locations button (`ArrowUpDown`).
  4. Advance Schedule Picker toggle ("Pick Up Now" vs "Schedule for Later" calendar button).
  5. Auto-Suggest List: Recent locations & Saved Hotspots ("Home", "Work", "FitPro Gym").
  6. Primary "CONFIRM LOCATIONS" CTA button (`AoloButton`).

### 5.5 Fleet & Booking Sheet (`BookingSheet.tsx`)
- **Purpose:** Vehicle class comparison, fare breakdown, and booking confirmation.
- **Order & Elements:**
  1. Route Summary Pill: Pickup ➔ Dropoff distance (`12 km`) and duration (`16 min`).
  2. Vehicle Class List (Selectable Cards):
     - **AOLO Compact (WagonR/Swift):** 4 Seats, 1 Bag limit, Fare `₹12,768` (`JetBrains Mono`).
     - **AOLO Sedan (Dzire/Etios):** 4 Seats, 2 Bags limit, Fare `₹15,590` (`JetBrains Mono`). Recommended badge.
  3. Fare Details Accordion: Base Fare + Taxes + Driver Allowance breakdown.
  4. Payment Method Selector (Dropdown: "AOLO Wallet (₹250)", "UPI / GPay", "Cash to Driver").
  5. Ride Insurance Checkbox (+₹15 toggle).
  6. Primary "CONFIRM & BOOK RIDE" CTA button (`AoloButton`).

### 5.6 Rental Booking Flow (`RentalBookingFlow.tsx`)
- **Purpose:** Hourly and multi-day rental configuration.
- **Order & Elements:**
  1. Rental Mode Switcher: "Hourly Packages" vs "Daily Rental".
  2. Package Grid Cards: `4 hrs / 40 km`, `8 hrs / 80 km`, `12 hrs / 120 km`, `15 hrs / 150 km`.
  3. Daily Rental Counter: Duration stepper (1 Day, 2 Days...) with drop date calendar selector.
  4. Primary "SELECT RENTAL PACKAGE" CTA button (`AoloButton`).

### 5.7 Airport Transfer Flow (`AirportBookingFlow.tsx`)
- **Purpose:** Dedicated airport pickup/drop setup.
- **Order & Elements:**
  1. Direction Switcher: "Ride to Airport" vs "Ride from Airport".
  2. Terminal Selector: "Terminal T1" vs "Terminal T2".
  3. Flight Number input field (e.g. `AI 402`) with 1-hr free buffer notice badge.
  4. Primary "PROCEED TO AIRPORT BOOKING" CTA button (`AoloButton`).

### 5.8 Live Dispatch Radar & Ride Progress (`RideProgressSheet.tsx`)
- **Purpose:** Driver matching scanning, active ride tracking, and PIN disclosure.
- **Order & Elements:**
  1. Pulsing Dispatch Radar Animation (Searching state) with "Scanning for nearby drivers...".
  2. Driver Arrival Card (Matched state): Driver photo avatar, name, rating star, car model & plate number.
  3. 4-Digit Security PIN display (`JetBrains Mono` 24px Bold `#A8E63C`).
  4. Action Buttons: Secondary "Call Captain" (`Phone`), "Chat" (`MessageSquare`), and Red "Cancel Ride" (`X`).

### 5.9 In-App Chat Drawer (`ChatDrawer.tsx`)
- **Purpose:** Real-time text messaging between passenger and assigned captain.
- **Order & Elements:**
  1. Chat Header: Driver name, car details, Close button (`X`).
  2. Message History List: Bubble containers (Passenger messages right `#A8E63C` text `#0A0A0A`; Driver messages left `#262B1E` text `#FFFFFF`).
  3. Bottom Input Bar: Text input field + Send icon button (`Send` `#A8E63C`).

### 5.10 Digital Wallet Sheet (`WalletSheet.tsx`)
- **Purpose:** Balance overview, top-ups, and transaction statements.
- **Order & Elements:**
  1. Balance Hero Card: Total Balance (`₹250` in `JetBrains Mono` 32px Bold), Auto-Replenish toggle switch.
  2. Quick Top-Up Presets: 3 buttons (`+₹100`, `+₹500`, `+₹1,000`).
  3. Saved Payment Methods (Visa Debit, SBI UPI).
  4. Transaction History Statement list (Date, Category, Amount `+₹500` green / `-₹250` white).

### 5.11 My Rides Dashboard (`RideHistory.tsx`)
- **Purpose:** Historical and upcoming booking manager.
- **Order & Elements:**
  1. Tri-Tab Switcher: "UPCOMING", "CURRENT", "HISTORY".
  2. Booking Card List: Booking ID (`#AOLO111192`), Date/Time, Vehicle Class, Status Badge ("COMPLETED" green, "CANCELLED" red, "PENDING" yellow), Pickup/Drop address strings, Fare (`₹2,499`).
  3. Action Links: "Download Invoice" & "Rebook Ride".

### 5.12 User Profile & Saved Hotspots (`ProfileSheet.tsx`)
- **Purpose:** Account credentials and hotspot destination management.
- **Order & Elements:**
  1. Profile Avatar & Edit Photo button.
  2. Text Input Fields: Full Name, Phone Number (+91 verified badge), Email Address.
  3. Saved Hotspots Section: "Home Address" configuration & "Work Address" configuration.
  4. "Sign Out Account" red text action button.

### 5.13 Sidebar Navigation Drawer (`SidebarDrawer.tsx`)
- **Purpose:** App-wide navigation menu.
- **Order & Elements:**
  1. Profile Header: User Name, Phone, Wallet Balance Pill (`₹250`).
  2. Menu Items List with Icons:
     - `Wallet` ➔ Digital Wallet
     - `Clock` ➔ My Rides
     - `MapPin` ➔ Road Trips For You
     - `Tag` ➔ Offers & Coupons
     - `Gift` ➔ Refer & Earn
     - `Briefcase` ➔ AOLO Corporate
     - `HelpCircle` ➔ Customer Support
  3. App Version footer ("AOLO Cabs v2.0.4 Production").

### 5.14 Corporate Portal Sheet (`CorporateSheet.tsx` - Phase 2)
- **Purpose:** Role-based enterprise travel portal interface.
- **Order & Elements:**
  1. Role Level Switcher: Level 1 Admin / Level 2 Manager / Level 3 Employee.
  2. Company Wallet balance card & GST billing status.
  3. Pending team trip approvals list & employee budget cap sliders.

### 5.15 Travel Mode Ecosystem (`TravelModeView.tsx` - Phase 2)
- **Purpose:** Tourism and multi-modal booking portal.
- **Order & Elements:**
  1. Category Grid: Flights, IRCTC Trains, Sleeper Buses, 5-Star Hotels, Travel Insurance, Visas.
  2. Partner discount promotional banners (Flat ₹1,500 OFF on Hotels).

### 5.16 Weather Widget (`WeatherWidget.tsx`)
- **Purpose:** Display local temperature and weather status on Home map header.
- **Order & Elements:**
  1. Horizontal pill container: Weather icon (`Sun`/`Cloud`), Temp (`32°C`), Location ("Saharsa").

---

## 6. Icon Mapping (`lucide-react` ➔ `lucide-react-native`)

All icons MUST use the exact same symbol names from Lucide. Only the package import changes.

```typescript
// WEB IMPORTS (Old Prototype)
// import { MapPin, Navigation, Phone, MessageSquare, ArrowLeft, Menu, Wallet } from 'lucide-react';

// REACT NATIVE IMPORTS (Production Mobile App)
import { 
  MapPin, 
  Navigation, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  Menu, 
  Wallet,
  Clock,
  Tag,
  Gift,
  Briefcase,
  HelpCircle,
  X,
  Send,
  Eye,
  EyeOff,
  Sun,
  Cloud,
  ArrowUpDown,
  Car
} from 'lucide-react-native';
```

---

## 7. Hard Rule for Coding Agents

1. **Strict 1:1 Visual Match:** You are performing a direct, 1:1 visual and functional port. Every color hex code, font family name, font weight, spacing value, component structure, icon selection, and screen layout MUST match the source specification without modification.
2. **No Creative License:** Do NOT attempt to "improve" layouts, change padding, alter color tones, substitute fonts, or rearrange screen elements.
3. **Approval Gate:** If you believe a design element must change for native platform compatibility (e.g., native header adjustments or safe area handling), you MUST explicitly log the proposed change and obtain approval BEFORE modifying the code.

---

## 8. Specification vs. Code Conflict Protocol

If a discrepancy is identified between the 31-page PDF Design Specification (`AOLOCabs New UI - Fixed.pdf`) and the existing React web prototype (`aolo-passenger.apk/react-native-app`), **DO NOT CHOOSE AN OPTION AUTONOMOUSLY.**

List both conflicting values in the log below and ask the user to declare the source of truth before proceeding:

### Known Discrepancy Log for User Alignment

| Screen / Feature | PDF Spec Value (`Aolocabs New UI - Fixed.pdf`) | Web Prototype Code Value (`react-native-app`) | Status / User Decision Required |
| :--- | :--- | :--- | :--- |
| **Color Tokens** | PDF Spec references Slate Dark theme (`#0F172A`, `#1E293B`, `#3B82F6`, `#10B981`). | User Design Request specifies AOLO Lime Green palette (`#A8E63C`, `#0A0A0A`, `#151915`, `#8A9184`). | **RESOLVED:** Use User Design Request palette (`#A8E63C` AOLO Green). |
| **Home Header** | PDF Page 6 displays Weather Widget + "Saharsa, Bihar" location text in top header. | `Header.tsx` displays Location text + Weather Widget + User Avatar. | **PENDING USER ALIGNMENT** |
| **Intercity Pricing** | PDF Page 24 lists Swift/WagonR Compact AC as `₹12,160 - ₹12,768`. | `mockData.ts` computes fare dynamically (`basePrice * 10`). | **PENDING USER ALIGNMENT** |
| **Mode Switcher** | PDF Page 6 shows "Ride Mode" vs "Travel Mode" with sub-tabs "One Way", "Round Trip", "Rental", "Airport". | `App.tsx` renders bottom tabs for Rides/Travel/Corporate + quick service chips. | **PENDING USER ALIGNMENT** |

---

**[END OF DESIGN SPECIFICATION - AOLO CABS REACT NATIVE]**
