# Engineering Rules & Guidelines: AOLO Cabs React Native Project

**Document Version:** 1.0.0  
**Target:** AI Coding Agents & Human Developers  
**Scope:** AOLO Cabs React Native Mobile Application (iOS & Android)  

---

## 1. The Golden Rule of UI/UX Fidelity

> **UI/UX MUST EXACTLY MATCH THE APPROVED DESIGN AT ALL TIMES.**

- **Zero Unapproved Alterations:** Never alter color tokens, font sizes, padding/margins, layout proportions, button positions, copy text, or screen transition sequences without explicit user approval.
- **Dark Theme Palette Adherence:** All styling must strictly utilize the established Slate Dark theme tokens:
  - Background: `#0F172A` (Slate 900)
  - Card Surface: `#1E293B` (Slate 800)
  - Primary Blue Accent: `#3B82F6` (Electric Blue)
  - Emerald Green Accent: `#10B981` (Success / Active state)
  - Borders: `rgba(255, 255, 255, 0.08)`
  - Text Primary: `#F8FAFC` / Text Secondary: `#94A3B8`
- **Pixel-Perfect Alignment:** Component dimensions, modal bottom sheet snap heights, icon sizes, and card borders must match the 31-page PDF design specification (`AOLOCabs New UI - Fixed.pdf`) and existing React prototype pixel-for-pixel.

---

## 2. Mandatory Architectural Context Check

Before proposing or executing ANY code change, refactoring, or feature implementation:

1. **Read Core Specification Documents:**
   - [`prd.md`](file:///c:/Users/bk200/Desktop/ola/prd.md) — For product scope, user stories, MVP boundaries, and acceptance criteria.
   - [`architecture.md`](file:///c:/Users/bk200/Desktop/ola/architecture.md) — For data models, backend endpoints, state management rules, and navigation flow.
   - `design.md` (or PDF design spec) — For exact UI component specifications and styling tokens.
2. **Verify Existing Code Patterns:** Always inspect pre-existing utilities (`src/utils`), themes (`src/theme`), and types (`src/types`) before writing custom helpers to prevent duplicate logic.

---

## 3. Strict Coding & TypeScript Conventions

- **TypeScript Strict Mode Enabled:** `tsconfig.json` must enforce strict type checking (`"strict": true`).
- **No Implicit or Explicit `any`:** Never use `any` as a type definition. Define explicit TypeScript `interfaces` or `types` for all props, states, API payloads, and database documents in `src/types/index.ts`.
- **Naming Conventions:**
  - **React Components & Files:** `PascalCase` (e.g., `BookingSheet.tsx`, `RideProgressSheet.tsx`).
  - **Functions, Variables & Methods:** `camelCase` (e.g., `handleConfirmBooking`, `calculateFare`).
  - **Constants & Environment Variables:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_SEARCH_RADIUS_KM`, `MAX_LUGGAGE_WEIGHT_KG`).
  - **Types & Interfaces:** `PascalCase` (e.g., `UserProfile`, `RideStatus`, `DriverLocation`).
- **Functional Components & Hooks:** Use functional React components with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`). Keep component files focused under 300 lines of code; extract complex sub-views into modular child components.

---

## 4. Shared & Global Component Safety Policy

- **Audit Dependencies Before Editing:** NEVER modify a shared/global component (e.g., `Header.tsx`, `BottomNavigation.tsx`, `MobileFrame.tsx`, `BookingSheet.tsx`, `MapSimulator.tsx`) without first running a workspace code search to identify EVERY screen and modal importing that component.
- **Backward Compatibility:** Modifications to global component signatures or prop interfaces must remain backward compatible. If new props are introduced, mark them as optional (`propName?: Type`) with sensible default values so existing screens do not crash or break layout.

---

## 5. Security & Credentials Policy

- **NEVER Commit Secrets or Config Files:** Do NOT commit `firebase-applet-config.json`, service account JSON keys, Google Maps API private keys, or payment gateway secret keys into Git repositories.
- **Use Environment Variables:** All API keys, base URLs, and environment toggles must be retrieved via `.env` files using `react-native-config` or Expo `extra` / `EXPO_PUBLIC_` variables.
- **Ensure `.gitignore` Protection:** Verify that `.env`, `.env.production`, `google-services.json`, `GoogleService-Info.plist`, and all `*-config.json` files are explicitly listed in `.gitignore`.

---

## 6. Git Branching & Commit Workflow

- **Feature & Fix Branches:** Never commit directly to `main` or `master`. All work must take place on dedicated branches named by task scope:
  - Feature branches: `feature/driver-realtime-tracking`, `feature/razorpay-integration`
  - Bug fix branches: `fix/fare-breakup-calculation`, `fix/location-search-autofill`
- **Conventional Commit Messages:** Format commit messages clearly using standard tags:
  - `feat: implement Google Places autocomplete in PickupDestinationFlow`
  - `fix: resolve keyboard overlap issue on AuthScreen OTP input`
  - `refactor: replace mock driver timer with Firestore onSnapshot subscription`
- **Clean Commits:** Run static analysis and linting (`npm run lint` / `npx tsc --noEmit`) prior to pushing code or creating pull requests.

---

## 7. Scope Alignment & Task Tracking (`task.md`)

- **Pre-Implementation Check:** Every new feature, UI update, or bug fix must be verified against [`prd.md`](file:///c:/Users/bk200/Desktop/ola/prd.md) to ensure it is within current scope.
- **Task Tracking:** Update `task.md` before starting work:
  1. Add new items to `task.md` with explicit acceptance criteria.
  2. Mark tasks as `[IN_PROGRESS]` when active.
  3. Mark tasks as `[DONE]` ONLY after full runtime verification on both iOS and Android platforms.

---

## 8. Mock-to-Real Refactoring Pattern (Interface Stability)

When refactoring a component to replace mock data (e.g., replacing `SIMULATED_DRIVERS`, `MapSimulator`, static flight cards, or local wallet state with real backend APIs):

- **Preserve Existing UI Interfaces:** DO NOT change the visual component's prop interface or layout contract.
- **Data Transport Layer Adapter:** Wrap the real API or Firestore `onSnapshot` subscription in a custom hook or adapter layer (e.g., `useDriverLocation(rideId)`), transforming the backend data payload into the exact `Driver` / `Ride` interface expected by the UI.

```typescript
// EXAMPLE: Adapter pattern preserving UI prop interface
// UI Component remains untouched: <RideProgressSheet driver={assignedDriver} ride={activeRide} />

export const useRealtimeDriver = (driverId: string | null): Driver | null => {
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    if (!driverId) return;
    // Subscribe to real Firestore document stream
    const unsubscribe = firestore()
      .collection('drivers')
      .doc(driverId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Map backend schema to exact UI Driver interface
          setDriver({
            id: doc.id,
            name: data.name,
            phone: data.phone,
            avatar: data.avatar,
            rating: data.rating,
            tripsCount: data.totalTrips,
            carModel: data.vehicleDetails.model,
            carColor: data.vehicleDetails.color,
            carPlate: data.vehicleDetails.plateNumber,
            lat: data.currentLocation.latitude,
            lng: data.currentLocation.longitude,
          });
        }
      });
    return () => unsubscribe();
  }, [driverId]);

  return driver;
};
```

---

## 9. Cross-Platform Verification Policy

- **Dual-Platform Testing Required:** A task is NEVER considered "Done" until it has been executed and visually verified on BOTH:
  1. **iOS Simulator / Physical iPhone**
  2. **Android Emulator / Physical Android Device**
- **Platform-Specific Considerations:** Pay special attention to platform differences:
  - SafeArea insets (`react-native-safe-area-context`) on iOS notch vs. Android status bar.
  - Keyboard avoiding behavior (`KeyboardAvoidingView` behavior differences between `padding` on iOS vs. `height` / `position` on Android).
  - Shadow props (`shadowColor`/`shadowOpacity` on iOS vs. `elevation` on Android).
  - Permission requests (location background permissions, FCM notification permissions).

---

## 10. Ambiguity Policy: Stop & Clarify

- **No Unvalidated Assumptions:** If a requirement, UI state, edge case, or business rule is underspecified or ambiguous, DO NOT guess or proceed based on unverified assumptions.
- **Immediate Pause & Escalation:** Stop execution immediately, outline the specific ambiguity, present candidate solutions with pros/cons, and ask the user for explicit clarification before writing code.

---

## 11. Persistent Memory Policy (`memory.md`)

- **Never Overwrite or Wipe:** NEVER delete, clear, or completely rewrite `memory.md` (or KI knowledge artifacts).
- **Append & Update Only:** Always append new learnings, solved setup issues, architectural decisions, and key project milestones to `memory.md` to preserve historical project context across developer sessions.

---

**[END OF ENGINEERING RULES - AOLO CABS REACT NATIVE]**
