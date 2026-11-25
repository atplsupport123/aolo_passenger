# Design System & Complete Screen Specification: AOLO Cabs React Native Project

**Document Version:** 2.0.0  
**Target Platform:** React Native (iOS & Android)  
**Status:** Approved Light-Theme Design Specification (Single Source of Truth)  
**Reference Asset:** `Aolocabs_New_Ui_-_Fixed.pdf` (31-Page PDF Spec)  

---

> [!CAUTION]
> ### HARD COLOR RULE (SINGLE SOURCE OF TRUTH)
> **THE ENTIRE APP USES A LIGHT THEME BY DEFAULT.**
> NO dark navy/black background anywhere in the app except for the 2 explicit dark screens:
> 1. Onboarding Step 3 live map preview card (Dark map container)
> 2. Corporate Portal "Secured Gateway / Select Access Level" screen (Dark enterprise security interface)
>
> **Exact Color Tokens:**
> - Page Background: `#F7F9F5` (Off-white) / `#FFFFFF` (White)
> - Card Backgrounds: `#FFFFFF` (White) / `#F7F9F5` (Off-white) with `#E9EDE6` light gray borders
> - Primary Text: `#0A0A0A` (Black)
> - Accent / Primary CTA: `#A8E63C` (AOLO Green) — Log In button, Wallet balance figure, "SELECTED" state, active bottom-nav icon, offer badges
> - Secondary / Onboarding CTAs: `#0A0A0A` Black pill buttons with `#FFFFFF` white text ("NEXT STEP")
> - Muted Text / Subtitles: `#8A9184`
> - Warning / Pending State: `#F59E0B` (Amber / Yellow)
> - Error / Restricted State: `#E53935` (Red)
> - Typography: `"Outfit"` (Headings), `"Inter"` (Body), `"JetBrains Mono"` (Fares / Numbers / IDs / OTPs)

---

## 1. Complete Screen Inventory & Section Layouts (20 Screens across 15 Sections)

### Section 1: Onboarding Sequence (5 Steps)
1. **Step 1 (Welcome Screen):** Animated location tag ("Saharsa, Bihar"), hero branding, tagline. Green step progress dot 1. Black pill CTA ("NEXT STEP"), top-right "SKIP FLOW" link.
2. **Step 2 (Booking Modes):** 4 direct selection cards (One-Way, Round Trip, Rental Packages, Airport Transfers). Green step dot 2. Black pill CTA ("NEXT STEP").
3. **Step 3 (Live Ride Tracking):** Dark map preview card with live captain position, dynamic ETA, location sharing. Green step dot 3. Black pill CTA ("NEXT STEP").
4. **Step 4 (Secure Payments):** AOLO Wallet, UPI (GPay/PhonePe), Credit/Debit Cards, Cash icons. Green step dot 4. Black pill CTA ("NEXT STEP").
5. **Step 5 (3-Step Booking Guide):** 1. Register Instantly, 2. Select Destination, 3. Hop In & Relax. Green step dot 5. Black pill CTA ("GET STARTED ➔") transitioning to Auth.

### Section 2: Customer Authentication (`AuthScreen.tsx`)
- Green "AO" logo box + "CABS" badge, "AOLO PASSENGER" heading, tagline.
- Mobile/Email & Password input fields with `#E9EDE6` borders.
- Primary Green "Log In" button (`#A8E63C` background, `#0A0A0A` text).
- "OR" divider, "Continue with Google" outline button, "Create an account" link.
- Green-outline "One-Click Demo Ride Login" button (`__DEV__` gated).

### Section 3: Dynamic Home Screen (`HomeScreen.tsx`)
- Light map header: Left hamburger menu icon (`Menu`), center location pill ("Stadium Road, Saharsa"), right weather widget (`32°C`, `Sun`).
- Mode Switcher: Dual pill toggle ("RIDE MODE" vs "TRAVEL MODE").
- 4 Quick Booking Tabs with icons: "One-Way", "Round Trip", "Rental", "Airport".
- Promotional Offer Card: "Up to 20% OFF" coupon card.
- 24x7 Support Card: "Your travel expert — Call Expert 24x7".
- Bottom Navigation Bar: Home, Bookings, Wallet, Account (active tab `#A8E63C`).

### Section 4: Pickup & Destination Selector (`PickupDestinationFlow.tsx`)
- Intercity Ride / City Ride dual tabs.
- Pickup location input (Green dot) & Dropoff input (Red pin) with swap button (`ArrowUpDown`).
- "+ STOP" button for multi-stop highway pitstop routing.
- Popular Hubs & Stations shortcuts list.
- Amber warning banner ("PLEASE CHOOSE A DROP DESTINATION").
- Primary "DONE" button.

### Section 5: Travel Mode Ecosystem (`TravelModeScreen.tsx`)
- Heading: "Where would you like to escape next, [Name]?"
- Category Grid Cards: Flights, IRCTC Trains, Sleeper Buses, Hotels, Holidays.
- Second Screen Section: Travel Insurance, Visa Services, promo offer cards with "TAP TO COPY".
- Top "BACK TO LOCAL CABS" toggle button.

### Section 6: Intercity & Outstation Booking (`BookingSheet.tsx`)
- Intercity / Outstation dual tabs.
- Vehicle Tier Cards: Swift/WagonR Compact AC (Fare range ₹12,160 - ₹12,768) vs Dzire/Etios Sedan AC (₹14,848 - ₹15,590) with RECOMMENDED badge.
- Specs: 4 Seats, 1-2 Bags, Km allowance.
- Expandable "FARE BREAKUP" dropdown (Base Fare + Taxes & Fees + Driver Allowance + Extra Km/Min charges).

### Section 7: Trip Summary & Live Driver Matching (`RideProgressSheet.tsx`)
- Route geometry preview map card (Distance/Duration e.g., 12km / 16min).
- RIDE NOW / SCHEDULE departure toggle.
- Secondary "CANCEL RIDE" vs Primary "CONFIRM & BOOK" buttons.
- Pulsing Radar Screen: "FINDING YOUR AOLO CAB..." scanning radar displaying estimated price & vehicle class.

### Section 8: Advance Scheduling & Passenger Verification
- Scheduled departure date/time picker with "RESCHEDULE" calendar trigger.
- Passenger & Luggage Steppers: Adults, Children, Big Bags (25kg), Small Bags (8kg).
- "No pets allowed" policy badge.
- Primary "PROCEED TO PAYMENT" button.

### Section 9: Rental Booking Flow (`RentalBookingFlow.tsx`)
- BY PACKAGE / DAILY RENTAL dual tabs.
- Hourly Package Cards: 4h/40km, 8h/80km, 12h/120km, 15h/150km with price and km inclusions.
- Daily Rental view: Multi-day duration counter (1 Day, 2 Days...) with drop date & time selector.

### Section 10: Airport Transfer Flow (`AirportBookingFlow.tsx`)
- RIDE TO AIRPORT / RIDE FROM AIRPORT direction switcher.
- Terminal T1 (Domestic) / Terminal T2 (International) selector.
- Flight Number input field (e.g. `AI 402`).
- Free 1-hour waiting buffer notice card.

### Section 11: My Rides Dashboard (`RideHistory.tsx`)
- Upcoming / Current / History tri-tab navigator.
- Trip Cards: Booking ID (`#AOLO111192`), vehicle class, pickup/drop addresses, price, status badges (COMPLETED green, CANCELLED red, PENDING amber).
- "Download Invoice" & "Rebook Ride" action links.

### Section 12: Digital Wallet (`WalletSheet.tsx`)
- Total Wallet Balance in large green text (`#A8E63C`).
- "Fast Auto-Replenish" toggle switch.
- Quick Top-Up Presets: `+$10`, `+$20`, `+$50`, `+$100` (or `+₹100`, `+₹500`, `+₹1,000`).
- Saved Payment Methods (Cards / Bank UPI).
- Recent transaction statement ledger.

### Section 13: Account & User Profile (`ProfileSheet.tsx`)
- Avatar circle + Name + "VERIFIED ACCOUNT" badge.
- Personal Details (Name, Phone +91, Email) with EDIT action.
- Saved Hotspots: Home Address & Work Address with SET ADDRESS actions.
- Red "SIGN OUT ACCOUNT" button (`#E53935`).

### Section 14: Sidebar Navigation Drawer (`SidebarDrawer.tsx`)
- Profile header with user avatar & wallet balance pill.
- Menu Items: Digital Wallet, My Rides, Road Trips For You, Offers & Coupons (with NEW badge), Refer & Earn, AOLO Corporate, Saved Places, Customer Support.

### Section 15: Curated Road Trips Modal
- Fixed-fare corridor list: Saharsa ➔ Patna (₹2,499), Patna ➔ Darbhanga (₹1,499), Saharsa ➔ Purnia (₹1,199).
- "BOOKING MODE: COMING SOON" notice badge.

### Section 16: Offers & Coupons Modal
- Coupon Cards: `AOLONEW` (Flat 20% Off first 3 rides), `RENTAL50` (Save ₹150 on rentals).
- "COPY CODE" button & countdown validity expiration tags.

### Section 17: Refer & Earn Rewards Modal
- Gift icon banner + "GET ₹100 FREE RIDE CREDIT" heading.
- Unique referral code with "COPY CODE" button & social share links.
- Rules: Both referrer & referee receive ₹100 wallet cashback upon friend's first completed trip.

### Section 18: Corporate Portal (`CorporateScreen.tsx` - Intentional Dark Screen)
- **DARK THEME SCREEN:** `#0A0A0A` background, "AOLO CORPORATE" header, "SECURED GATEWAY" badge.
- "SELECT YOUR ACCESS LEVEL" 3 role cards:
  1. **Corporate Admin (Level 1):** Manage company wallet, department allocations, consolidated GST billing.
  2. **Team Manager (Level 2):** Trip approval workflows, budget caps, team travel logs.
  3. **Employee Traveler (Level 3):** Frictionless business ride booking under travel policy.
- "CONTINUE SECURITY LOGIN" primary action.

### Section 19: Saved Places Modal
- Favorite places list: Home, Work, Custom Favorites ("FitPro Gym") with "USE" action and "+ ADD NEW LOCATION".

### Section 20: Trip Policies Accordion
- **Inclusions:** Dedicated captain, verified vehicle, delay buffer (Green check list).
- **Exclusions:** Tolls, state taxes, parking (Amber warning list).
- **Restrictions:** Strict no smoking / alcohol rules (Red restriction list).
- **Cancellation Policy:** Free up to 4 hrs before pickup; 50% fee between 2–4 hrs; no refund under 2 hrs.

---

**[END OF COMPLETE SCREEN SPECIFICATION - AOLO CABS 2.0]**
